-- ====================================================================
-- MySQL Database Creation Script for Athenaeum Library Management System
-- Compatible with MySQL 8.0+ / MariaDB 10.5+
-- ====================================================================

CREATE DATABASE IF NOT EXISTS library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE library_db;

-- 1. Table: users (Handles authentication and member profiles)
DROP TABLE IF EXISTS borrow_records;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    membership_id VARCHAR(50) NOT NULL UNIQUE,
    role ENUM('READER', 'LIBRARIAN') NOT NULL DEFAULT 'READER',
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_membership (membership_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table: categories (Book classification taxonomy)
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table: books (Library catalog with stock tracking)
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150) NOT NULL,
    category_id BIGINT NOT NULL,
    total_copies INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    shelf_location VARCHAR(50) NOT NULL,
    description TEXT,
    cover_url VARCHAR(500),
    published_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_book_isbn (isbn),
    INDEX idx_book_title (title),
    INDEX idx_book_author (author)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table: borrow_records (Tracks active borrowings, due dates, returns & fines)
CREATE TABLE borrow_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    status ENUM('BORROWED', 'RETURNED', 'OVERDUE') NOT NULL DEFAULT 'BORROWED',
    fine_amount DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    renewed_count INT NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT,
    INDEX idx_borrow_user (user_id),
    INDEX idx_borrow_book (book_id),
    INDEX idx_borrow_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================================
-- Initial Seed Data
-- ====================================================================
INSERT INTO users (id, email, password_hash, full_name, membership_id, role, phone) VALUES
(1, 'admin@athenaeum.edu', '$2a$10$abcdef...hashedPassword', 'Elena Vance (Chief Librarian)', 'LIB-2024-001', 'LIBRARIAN', '+1 (555) 234-5678'),
(2, 'jane.doe@campus.edu', '$2a$10$reader...hashedPassword', 'Jane Doe', 'STU-2024-884', 'READER', '+1 (555) 987-6543'),
(3, 'marcus.chen@campus.edu', '$2a$10$marcus...hashedPassword', 'Marcus Chen', 'STU-2024-912', 'READER', '+1 (555) 456-7890');

INSERT INTO categories (id, name, code, description) VALUES
(1, 'Computer Science & Software', 'CS', 'Algorithms, system design, Java programming, databases'),
(2, 'Classic Literature & Fiction', 'LIT', 'Timeless masterpieces, novels, and award-winning fiction'),
(3, 'Data Engineering & AI', 'AI', 'Machine learning, relational databases, distributed systems'),
(4, 'Philosophy & Psychology', 'PHIL', 'Critical thinking, ethics, cognitive science, and human behavior'),
(5, 'Science & Astrophysics', 'SCI', 'Physics, astronomy, biology, and history of science');

INSERT INTO books (id, isbn, title, author, category_id, total_copies, available_copies, shelf_location, description, published_year) VALUES
(1, '978-0134685991', 'Effective Java (3rd Edition)', 'Joshua Bloch', 1, 5, 3, 'Stack A-12', 'The definitive guide to best practices in Java programming.', 2018),
(2, '978-0132350884', 'Clean Code', 'Robert C. Martin', 1, 6, 4, 'Stack A-14', 'Agile software craftsmanship and code readability patterns.', 2008),
(3, '978-1449373320', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 3, 5, 1, 'Stack B-04', 'Architecture of high-scale storage, replication, and data systems.', 2017),
(4, '978-0451524935', '1984', 'George Orwell', 2, 7, 5, 'Stack C-15', 'Classic dystopian political fiction on surveillance and liberty.', 1949);

INSERT INTO borrow_records (id, user_id, book_id, borrow_date, due_date, return_date, status, fine_amount, renewed_count) VALUES
(1, 2, 1, '2026-10-05', '2026-10-19', NULL, 'BORROWED', 0.00, 0),
(2, 2, 3, '2026-09-28', '2026-10-12', NULL, 'OVERDUE', 3.50, 1),
(3, 3, 2, '2026-10-01', '2026-10-15', '2026-10-14', 'RETURNED', 0.00, 0);