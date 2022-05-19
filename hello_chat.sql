-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 19, 2022 at 01:42 AM
-- Server version: 5.7.33
-- PHP Version: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hello_chat`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_history`
--

CREATE TABLE `chat_history` (
  `id` int(11) NOT NULL,
  `connection_id` int(11) DEFAULT NULL,
  `message` text,
  `type` varchar(127) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `chat_history`
--

INSERT INTO `chat_history` (`id`, `connection_id`, `message`, `type`, `created_at`, `user_id`) VALUES
(15, 3, 'Hi', 'text', '2022-05-12 09:08:54', 3),
(16, 4, 'Hello', 'text', '2022-05-12 09:09:08', 6),
(17, 4, 'Ki koro', 'text', '2022-05-12 09:09:29', 1),
(18, 4, 'ki koro ?', 'text', '2022-05-12 09:10:01', 6),
(19, 3, 'Hello mr. bijoy', 'text', '2022-05-12 09:12:01', 1),
(20, 3, 'Hello, it is from bijoy', 'text', '2022-05-12 09:12:20', 3),
(21, 4, 'Koi akhon', 'text', '2022-05-17 23:56:12', 6),
(22, 4, 'ami bogura', 'text', '2022-05-17 23:56:40', 1),
(23, 4, 'Tai naki ?', 'text', '2022-05-17 23:56:47', 6),
(24, 8, 'Hi', 'text', '2022-05-18 23:18:11', 1),
(25, 8, 'Hello', 'text', '2022-05-18 23:18:17', 6);

-- --------------------------------------------------------

--
-- Table structure for table `connections`
--

CREATE TABLE `connections` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `connected_user_id` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `connections`
--

INSERT INTO `connections` (`id`, `user_id`, `connected_user_id`, `status`, `created_at`) VALUES
(1, 1, 2, 1, '2022-05-10 12:02:49'),
(3, 3, 2, 1, '2022-05-10 12:02:49'),
(7, 1, 3, 1, '2022-05-18 23:17:12'),
(8, 1, 6, 1, '2022-05-18 23:17:25'),
(9, 6, 3, 1, '2022-05-18 23:18:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `avatar`, `created_at`) VALUES
(1, 'Rasel', 'rasel@mail.com', '$2b$10$XBevsTsy/wr64.bHk.xR1uLBjXsZF70Rg9GeqRmYYJ0OOUlJjZGwi', 'https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png?1592828498', '2022-05-10 11:59:37'),
(2, 'Kabir', 'kabir@mail.com', '$2b$10$XBevsTsy/wr64.bHk.xR1uLBjXsZF70Rg9GeqRmYYJ0OOUlJjZGwi', 'https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png?1592828498', '2022-05-10 11:59:37'),
(3, 'Bijoy', 'bijoy@mail.com', '$2b$10$XBevsTsy/wr64.bHk.xR1uLBjXsZF70Rg9GeqRmYYJ0OOUlJjZGwi', 'https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png?1592828498', '2022-05-10 11:59:37'),
(6, 'Sub Admin', 'user1@mail.com', '$2b$10$1Y.4ieVOmQl0Nsf7D.TsO.8cZxyqjGpHnw8OKiFCqLuaDG4/Yuvra', 'https://ui-avatars.com/api/?name=Sub+Admin', '2022-05-12 08:53:55'),
(11, 'Yash Dohom', 'user@mail.com', '$2b$10$5EipVf8dQtzxznKkQ63sz.1ijqyp.mqStTuphA6rSgxSBWzcq12p2$2b$10$zWPlScZC657Vs4kPfoTkQOqLvjK6e6TLamUOrX2Zy6FkWBKorEYUO', 'https://ui-avatars.com/api/?name=Yash+Dohom', '2022-05-12 08:59:47'),
(12, 'sdfsd', 'sdfs@m.co', '$2b$10$hFLeQa0kCuYPRURg2bhlzePxGP3zm5cLhyikWVmdc6ZDUw4t7wgNC', 'https://ui-avatars.com/api/?name=sdfsd+', '2022-05-17 23:35:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_history`
--
ALTER TABLE `chat_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `connections`
--
ALTER TABLE `connections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_history`
--
ALTER TABLE `chat_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `connections`
--
ALTER TABLE `connections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
