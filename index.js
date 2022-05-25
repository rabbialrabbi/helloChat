const express = require('express')
const app = express();
const path = require('path')
const socketio = require('socket.io')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const PORT = process.env.PORT || 5000
const dbConfig ={
    host: "ec2-34-201-95-176.compute-1.amazonaws.com",
    user: "btjqbuvlqdqbap",
    password: "382e768d0b95fec7ccb54ea23aed2858ec9e1edf28bb6e65fcc0de490a0e43ef",
    database: "d4j4dic3fpaqcr"
}
// const dbConfig ={
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hello_chat"
// }

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

const server = app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('auth/login'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/login',(req, res)=>{
    res.render('auth/login');
})

app.post('/login', (req, res) => {

    let email = req.body.email
    let password = req.body.password

    const con = mysql.createConnection(dbConfig);
    con.connect(function(err) {
        if (err) throw err;
        let getUserSQL = 'SELECT * FROM users WHERE email = "' + email +'"'
        con.query(getUserSQL, function (err, result, fields) {
            if (err) throw err;
            let user = result ? result[0] : '';
            if(user){
                bcrypt.compare(password, user.password, function(err, result) {
                    if(result){
                        res.render('chat', {user});
                    }else{
                        res.redirect('/login');
                    }
                });
            }else{
                res.redirect('/login');
            }

        });
    });
})

app.get('/register', (req, res) => {
    res.render('auth/register');
})

app.post('/register', (req, res) => {
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    let fullName = name.split(' ')
    let firstName = fullName[0]
    let lastName = fullName.length > 1 ? fullName[1] : ''
    let avatar = `https://ui-avatars.com/api/?name=${firstName}+${lastName}`
    let created_at = new Date()

    const con = mysql.createConnection(dbConfig);

    con.connect(function(err) {
        if (err) throw err;
        let getUserSQL = 'SELECT * FROM users WHERE email = "' + email +'"'
        con.query(getUserSQL, function (err, result, fields) {
            if (err) throw err;
            let user = result.length ? result[0] : '';
            if(!user){
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        let passwordHash = `${hash}`
                        let formData = [
                            [name,email,passwordHash,avatar,created_at]
                        ]
                        let registerQry = 'INSERT INTO users (name,email,password,avatar,created_at) VALUES ?'
                        con.query(registerQry,[formData], function (err, result, fields) {
                            if (err) throw err;
                            if(result.affectedRows){
                                let getUserQry = 'SELECT * FROM users WHERE id = ' + result.insertId
                                con.query(getUserQry, function (err, result, fields) {
                                    let user = result ? result[0] : '';
                                    if(user){
                                        res.render('chat', {user});
                                    }else{
                                        res.redirect('/login');
                                    }
                                })
                            }else {
                                res.redirect('/login');
                            }
                        })
                    });
                });
            }else{
                res.redirect('/login');
            }

        });
    });
})

app.get('/find-friend', (req, res) => {
    let searchText = req.query.search
    const con = mysql.createConnection(dbConfig);
    con.connect(function(err) {
        if (err) throw err;
        let getUserSQL = 'SELECT id , name, email, avatar, created_at FROM users WHERE name LIKE "%' + searchText +'%" OR email LIKE "%' + searchText +'%"'
        con.query(getUserSQL, function (err, result, fields) {
            if (err) throw err;
            let users = []
            result.forEach((user)=>{
                if(user){
                    users.push(user)
                }
            })
            res.json(users);
        });
    });
})

app.post('/find-friend', (req, res) => {
    let user_id = req.body.user_id
    let partner_id = req.body.partner_id
    const con = mysql.createConnection(dbConfig);
    con.connect(function(err) {
        if (err) throw err;
        let getConnectionSQL = 'INSERT INTO connections (user_id, connected_user_id,status,created_at) VALUES ?'
        var values = [
            [user_id,partner_id,1,new Date()]
        ];
        con.query(getConnectionSQL,[values], function (err, result, fields) {
            if (err) throw err;
            getFriend(user_id)
            getFriend(partner_id)
            res.json([{'status': 'success'}]);
        });
    });
})

const io = socketio(server)

let connectedUser = {}
var liveUser = []

io.on('connection',function (socket) {

    socket.on('ping', function (user) {

        var userid = user.user_id;
        connectedUser[userid] = socket;
        liveUser = Object.keys(connectedUser);

        if(liveUser.includes(String(userid))){
            getFriend(userid)

        }

    });

    socket.on('load_message',function (connection) {
        let userId = connection.user_id

        if(liveUser.includes(String(userId))){
            let message = getMessage(connection)
            connectedUser[userId].emit('load_message', message);
        }
        // let message = getMessage(connection.partner_id)
        // socket.emit('load_message',message)

    })
    socket.on('sentMessage',function (connection) {
        let toId = connection.toId
        let fromId = connection.fromId

        updateMessageToDatabase(connection)

        if(liveUser.includes(String(toId))){
            let message = connection.message
            connectedUser[toId].emit('receiveMessage', {
                toId : fromId,
                message : message
            });
        }

    })
})

function updateMessageToDatabase(connection) {
    const con = mysql.createConnection(dbConfig);

    con.connect(function(err) {
        if (err) throw err;
        let getToUserSQL = 'INSERT INTO chat_history (connection_id, message,type,created_at, user_id) VALUES ?'
        var values = [
            [connection.connection_id,connection.message,connection.messageType,new Date(),connection.fromId]
        ];
        con.query(getToUserSQL, [values], function (err, result, fields) {
            if (err) throw err;
        });
    });

}

function getFriend(user) {

    const con = mysql.createConnection(dbConfig);

    con.connect(function(err) {
        let users = []
        if (err) throw err;
        let getToUserSQL = 'SELECT users.id as id, name, email, avatar, users.created_at , connections.id as connection_id FROM connections INNER JOIN users ON connections.connected_user_id = users.id where user_id = ' + user + ' AND status = 1'
        con.query(getToUserSQL, function (err, result, fields) {
            if (err) throw err;
            result.forEach((user)=>{
                if(user){
                    users.push(user)
                }
            })

            let getFromUserSQL = 'SELECT users.id as id, name, email, avatar, users.created_at , connections.id as connection_id FROM connections INNER JOIN users ON connections.user_id = users.id where connected_user_id = ' + user + ' AND status = 1'

            con.query(getFromUserSQL, function (err, result, fields) {
                if (err) throw err;
                result.forEach((user)=>{
                    let isDuplicate = !!users.find((x)=>x.id == user.id)

                    if(user && !isDuplicate){
                        users.push(user)
                    }

                })
                if(liveUser.includes(String(user))){
                    connectedUser[user].emit('load_friends', users)
                }
            })
        });
    });
}

function getMessage(connection) {

    const con = mysql.createConnection(dbConfig);

    con.connect(function(err) {
        if (err) throw err;
        let connectionQry = 'SELECT * FROM connections where user_id = ' +
            connection.user_id + ' AND connected_user_id = ' + connection.partner_id +
            ' OR user_id = ' +
            connection.partner_id + ' AND connected_user_id = ' + connection.user_id + ' ORDER BY created_at ASC '

        con.query(connectionQry, function (err, result, fields) {
            if (err) throw err;
            let userConnection = result[0]

            let userQry = 'SELECT * FROM chat_history where connection_id = ' + userConnection.id
            con.query(userQry, function (err, result, fields) {
                if (err) throw err;
                connectedUser[connection.user_id].emit('load_message', result);
            })
        });
    });

}
