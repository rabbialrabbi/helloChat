const socket = io('http://localhost:8888')

socket.on('load_namespace',function (namespaces) {
    let namespaceDiv = document.querySelector('.namespaces')
    namespaceDiv.innerHTML = ''
    namespaces.forEach((ns)=>{
        namespaceDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint} ><img src="${ns.image}" /></div>`
    })

    Array.from(document.getElementsByClassName('namespace')).forEach((elem)=>{
        elem.addEventListener('click',function () {
            let endpoint = elem.getAttribute('ns')
            socket.emit('load_room',endpoint)
        })
    })

    joinNs('/wiki')
})