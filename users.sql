-- Active: 1716015696405@@127.0.0.1@3306
CREATE DATABASE IF NOT EXISTS guitar_lessons_db;
USE guitar_lessons_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255) DEFAULT 'default.jpg', -- Default profile picture
    experience_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries on email
CREATE INDEX idx_email ON users(email);
