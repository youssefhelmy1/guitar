-- Active: 1716015696405@@127.0.0.1@3306@y7elmy
 DROP TABLE IF EXISTS users;
 ALTER TABLE users DISCARD TABLESPACE users;

  CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `experience_level` enum('beginner','intermediate','advanced') NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  );
 DROP TABLE IF EXISTS bookings;
CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `package_type` enum('single','package') NOT NULL,
  `booking_day` varchar(20) NOT NULL,
  `booking_time` varchar(20) NOT NULL,
  `payment_id` varchar(100) NOT NULL,
  `booking_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);