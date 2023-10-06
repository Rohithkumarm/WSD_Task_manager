# WSD_Task_manager
Code base with a simple web based project for viewing tasks
 Prerequisuites
 1. Xampp
 2. nodejs
 3. VS Code


Mysql Table creation - commands

CREATE DATABASE task_manager
use task_manager
CREATE TABLE `tasks` (

  `id` int(11) NOT NULL AUTO_INCREMENT,

  `title` varchar(255) NOT NULL,

  `description` text DEFAULT NULL,

  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),

  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
