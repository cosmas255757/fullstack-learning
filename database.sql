CREATE DATABASE auth_db;
USE auth_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'borrower', 'super_admin') DEFAULT 'borrower',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--==========================================================================================
--=========================================================================================
CREATE TABLE IF NOT EXISTS loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 50000 AND amount <= 200000),
    living_location VARCHAR(255) NOT NULL,
    installment_type ENUM('daily', 'weekly') NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Adds the loan_reason field to existing table
ALTER TABLE loans 
ADD COLUMN loan_reason TEXT NOT NULL AFTER installment_type;
