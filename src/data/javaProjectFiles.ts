import { JavaSourceFile } from '../types';

export const JAVA_PROJECT_FILES: JavaSourceFile[] = [
  {
    path: 'pom.xml',
    name: 'pom.xml',
    category: 'config',
    language: 'xml',
    description: 'Maven configuration configured for WAR packaging with Spring Boot 3, MySQL Connector/J, Hibernate JPA, and provided Tomcat.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
        <relativePath/>
    </parent>
    
    <groupId>com.athenaeum</groupId>
    <artifactId>library-management</artifactId>
    <version>1.0.0-RELEASE</version>
    <packaging>war</packaging>
    
    <name>library-management</name>
    <description>Enterprise Library Management System with MySQL &amp; User Authentication</description>
    
    <properties>
        <java.version>17</java.version>
        <mysql.version>8.3.0</mysql.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Web Starter (MVC, REST, Jackson) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Spring Boot Starter Data JPA (Hibernate ORM) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <!-- MySQL Official JDBC Driver (Connector/J) -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Validation API (Hibernate Validator) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- Embedded Tomcat marked as 'provided' for WAR container deployment -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
            <scope>provided</scope>
        </dependency>
        
        <!-- JSP Engine Support for standalone Tomcat deployment -->
        <dependency>
            <groupId>org.apache.tomcat.embed</groupId>
            <artifactId>tomcat-embed-jasper</artifactId>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>jakarta.servlet.jsp.jstl</groupId>
            <artifactId>jakarta.servlet.jsp.jstl-api</artifactId>
        </dependency>
    </dependencies>
    
    <build>
        <finalName>library-management</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.4.0</version>
                <configuration>
                    <failOnMissingWebXml>false</failOnMissingWebXml>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'src/main/resources/application.properties',
    name: 'application.properties',
    category: 'config',
    language: 'properties',
    description: 'Spring Boot datasource configurations for MySQL, JPA/Hibernate SQL dialect, and server port.',
    content: `# ===============================================
# MySQL Database Connection Configurations
# ===============================================
spring.datasource.url=jdbc:mysql://localhost:3306/library_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=rootpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection Pooling (HikariCP)
spring.datasource.hikari.maximum-pool-size=15
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=30000

# Hibernate JPA Configurations
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server & View Configurations
server.port=8080
server.servlet.context-path=/library-management
spring.mvc.view.prefix=/WEB-INF/jsp/
spring.mvc.view.suffix=.jsp

# Library Business Rules
library.max-borrow-limit=5
library.default-loan-days=14
library.daily-fine-rate=0.50`
  },
  {
    path: 'src/main/webapp/WEB-INF/web.xml',
    name: 'web.xml',
    category: 'webapp',
    language: 'xml',
    description: 'Standard Java EE / Jakarta EE Servlet deployment descriptor for Apache Tomcat and J2EE application servers.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee 
                             https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0">
    
    <display-name>Athenaeum Library Management System</display-name>
    <description>Enterprise Java WAR web application connected to MySQL</description>
    
    <session-config>
        <session-timeout>60</session-timeout>
        <cookie-config>
            <http-only>true</http-only>
            <secure>false</secure>
        </cookie-config>
        <tracking-mode>COOKIE</tracking-mode>
    </session-config>

    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>
</web-app>`
  },
  {
    path: 'schema.sql',
    name: 'schema.sql',
    category: 'sql',
    language: 'sql',
    description: 'Complete MySQL DDL & Seed script creating InnoDB relational tables with foreign keys and indexes.',
    content: `-- ====================================================================
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
(3, 3, 2, '2026-10-01', '2026-10-15', '2026-10-14', 'RETURNED', 0.00, 0);`
  },
  {
    path: 'src/main/java/com/athenaeum/library/LibraryApplication.java',
    name: 'LibraryApplication.java',
    category: 'config',
    language: 'java',
    description: 'Main Spring Boot application class extending SpringBootServletInitializer to support Tomcat WAR deployment.',
    content: `package com.athenaeum.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Entry Point for the Athenaeum Library Management System.
 * 
 * Extends SpringBootServletInitializer to configure application when 
 * deployed as a WAR file inside an external Servlet Container (e.g. Apache Tomcat).
 */
@SpringBootApplication
@EnableScheduling
public class LibraryApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(LibraryApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(LibraryApplication.class, args);
    }
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/model/User.java',
    name: 'User.java',
    category: 'entity',
    language: 'java',
    description: 'JPA Entity representing system users, members, and librarians with roles.',
    content: `package com.athenaeum.library.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 191)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "membership_id", nullable = false, unique = true, length = 50)
    private String membershipId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.READER;

    @Column(length = 30)
    private String phone;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        READER,
        LIBRARIAN
    }

    // Default Constructor for JPA
    public User() {}

    public User(String email, String passwordHash, String fullName, String membershipId, Role role, String phone) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.membershipId = membershipId;
        this.role = role;
        this.phone = phone;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getMembershipId() { return membershipId; }
    public void setMembershipId(String membershipId) { this.membershipId = membershipId; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/model/Book.java',
    name: 'Book.java',
    category: 'entity',
    language: 'java',
    description: 'JPA Entity representing books in the catalog with inventory count and category foreign key.',
    content: `package com.athenaeum.library.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String isbn;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 150)
    private String author;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "total_copies", nullable = false)
    private int totalCopies;

    @Column(name = "available_copies", nullable = false)
    private int availableCopies;

    @Column(name = "shelf_location", nullable = false, length = 50)
    private String shelfLocation;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_url", length = 500)
    private String coverUrl;

    @Column(name = "published_year")
    private Integer publishedYear;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Book() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public int getTotalCopies() { return totalCopies; }
    public void setTotalCopies(int totalCopies) { this.totalCopies = totalCopies; }

    public int getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(int availableCopies) { this.availableCopies = availableCopies; }

    public String getShelfLocation() { return shelfLocation; }
    public void setShelfLocation(String shelfLocation) { this.shelfLocation = shelfLocation; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    public Integer getPublishedYear() { return publishedYear; }
    public void setPublishedYear(Integer publishedYear) { this.publishedYear = publishedYear; }
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/model/BorrowRecord.java',
    name: 'BorrowRecord.java',
    category: 'entity',
    language: 'java',
    description: 'JPA Entity managing transaction state of loans, dates, returns, and overdue fees.',
    content: `package com.athenaeum.library.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_records")
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "borrow_date", nullable = false)
    private LocalDate borrowDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BorrowStatus status = BorrowStatus.BORROWED;

    @Column(name = "fine_amount", precision = 8, scale = 2, nullable = false)
    private BigDecimal fineAmount = BigDecimal.ZERO;

    @Column(name = "renewed_count", nullable = false)
    private int renewedCount = 0;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum BorrowStatus {
        BORROWED,
        RETURNED,
        OVERDUE
    }

    public BorrowRecord() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public BorrowStatus getStatus() { return status; }
    public void setStatus(BorrowStatus status) { this.status = status; }

    public BigDecimal getFineAmount() { return fineAmount; }
    public void setFineAmount(BigDecimal fineAmount) { this.fineAmount = fineAmount; }

    public int getRenewedCount() { return renewedCount; }
    public void setRenewedCount(int renewedCount) { this.renewedCount = renewedCount; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/model/Category.java',
    name: 'Category.java',
    category: 'entity',
    language: 'java',
    description: 'JPA Entity representing library classification categories.',
    content: `package com.athenaeum.library.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Category() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/repository/UserRepository.java',
    name: 'UserRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA Repository for User table with derived queries for email and membership.',
    content: `package com.athenaeum.library.repository;

import com.athenaeum.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMembershipId(String membershipId);
    boolean existsByEmail(String email);
    boolean existsByMembershipId(String membershipId);
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/repository/BookRepository.java',
    name: 'BookRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA Repository for books with full-text title and author query filters.',
    content: `package com.athenaeum.library.repository;

import com.athenaeum.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    
    List<Book> findByCategoryId(Long categoryId);

    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Book> searchBooks(@Param("query") String query);

    @Query("SELECT b FROM Book b WHERE b.availableCopies > 0")
    List<Book> findAvailableBooks();
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/repository/BorrowRecordRepository.java',
    name: 'BorrowRecordRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA Repository for loans, active status lookups, and member loan history.',
    content: `package com.athenaeum.library.repository;

import com.athenaeum.library.model.BorrowRecord;
import com.athenaeum.library.model.BorrowRecord.BorrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUserId(Long userId);
    List<BorrowRecord> findByUserIdAndStatus(Long userId, BorrowStatus status);
    List<BorrowRecord> findByStatus(BorrowStatus status);

    @Query("SELECT r FROM BorrowRecord r WHERE r.status = 'BORROWED' AND r.dueDate < :today")
    List<BorrowRecord> findOverdueRecords(@Param("today") LocalDate today);

    long countByUserIdAndStatus(Long userId, BorrowStatus status);
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/repository/CategoryRepository.java',
    name: 'CategoryRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA Repository for Category taxonomy lookups.',
    content: `package com.athenaeum.library.repository;

import com.athenaeum.library.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCode(String code);
    Optional<Category> findByName(String name);
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/service/LibraryService.java',
    name: 'LibraryService.java',
    category: 'service',
    language: 'java',
    description: 'Core transactional service implementing borrow checkout, stock replenishment on return, renewals, and fine calculation.',
    content: `package com.athenaeum.library.service;

import com.athenaeum.library.model.Book;
import com.athenaeum.library.model.BorrowRecord;
import com.athenaeum.library.model.BorrowRecord.BorrowStatus;
import com.athenaeum.library.model.User;
import com.athenaeum.library.repository.BookRepository;
import com.athenaeum.library.repository.BorrowRecordRepository;
import com.athenaeum.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LibraryService {

    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;

    @Value("\${library.max-borrow-limit:5}")
    private int maxBorrowLimit;

    @Value("\${library.daily-fine-rate:0.50}")
    private double dailyFineRate;

    public LibraryService(BookRepository bookRepository,
                          BorrowRecordRepository borrowRecordRepository,
                          UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.userRepository = userRepository;
    }

    /**
     * Borrow a book with relational transactional integrity in MySQL.
     */
    @Transactional
    public BorrowRecord borrowBook(Long userId, Long bookId, int loanDays, String notes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        long activeLoans = borrowRecordRepository.countByUserIdAndStatus(userId, BorrowStatus.BORROWED);
        if (activeLoans >= maxBorrowLimit) {
            throw new IllegalStateException("Maximum borrowing limit (" + maxBorrowLimit + " books) reached for this account.");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with ID: " + bookId));

        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No available copies of '" + book.getTitle() + "' in stock.");
        }

        // Decrement available copies in MySQL
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // Create transaction record
        LocalDate today = LocalDate.now();
        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBook(book);
        record.setBorrowDate(today);
        record.setDueDate(today.plusDays(loanDays > 0 ? loanDays : 14));
        record.setStatus(BorrowStatus.BORROWED);
        record.setFineAmount(BigDecimal.ZERO);
        record.setNotes(notes);

        return borrowRecordRepository.save(record);
    }

    /**
     * Return a book, restore inventory count, and assess late fines.
     */
    @Transactional
    public BorrowRecord returnBook(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Borrow record not found with ID: " + recordId));

        if (record.getStatus() == BorrowStatus.RETURNED) {
            throw new IllegalStateException("This book has already been returned.");
        }

        LocalDate returnDate = LocalDate.now();
        record.setReturnDate(returnDate);
        record.setStatus(BorrowStatus.RETURNED);

        // Calculate late fine if overdue
        if (returnDate.isAfter(record.getDueDate())) {
            long daysLate = ChronoUnit.DAYS.between(record.getDueDate(), returnDate);
            BigDecimal fine = BigDecimal.valueOf(daysLate * dailyFineRate);
            record.setFineAmount(fine);
        }

        // Restore copy inventory in MySQL
        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return borrowRecordRepository.save(record);
    }

    /**
     * Renew loan by extending due date by 7 days.
     */
    @Transactional
    public BorrowRecord renewLoan(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Borrow record not found with ID: " + recordId));

        if (record.getStatus() != BorrowStatus.BORROWED) {
            throw new IllegalStateException("Only active loans can be renewed.");
        }

        record.setDueDate(record.getDueDate().plusDays(7));
        record.setRenewedCount(record.getRenewedCount() + 1);
        return borrowRecordRepository.save(record);
    }

    /**
     * Scheduled midnight job to update overdue statuses and accumulate fines.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void updateOverdueRecords() {
        LocalDate today = LocalDate.now();
        List<BorrowRecord> overdueRecords = borrowRecordRepository.findOverdueRecords(today);

        for (BorrowRecord r : overdueRecords) {
            r.setStatus(BorrowStatus.OVERDUE);
            long daysLate = ChronoUnit.DAYS.between(r.getDueDate(), today);
            r.setFineAmount(BigDecimal.valueOf(daysLate * dailyFineRate));
            borrowRecordRepository.save(r);
        }
    }
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/controller/AuthController.java',
    name: 'AuthController.java',
    category: 'controller',
    language: 'java',
    description: 'REST Controller handling user authentication (Login and Registration) with JSON responses.',
    content: `package com.athenaeum.library.controller;

import com.athenaeum.library.model.User;
import com.athenaeum.library.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or credentials."));
        }

        User user = userOpt.get();
        // In production, BCryptPasswordEncoder verifies the hash.
        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "membershipId", user.getMembershipId(),
                "role", user.getRole().name()
            )
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String fullName = request.get("fullName");
        String password = request.get("password");
        String roleStr = request.getOrDefault("role", "READER");

        if (email == null || fullName == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please provide name, email, and password."));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "An account with this email already exists."));
        }

        String membershipId = (roleStr.equalsIgnoreCase("LIBRARIAN") ? "LIB-" : "STU-") +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        User user = new User();
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPasswordHash("HASHED_" + password.hashCode());
        user.setMembershipId(membershipId);
        user.setRole(roleStr.equalsIgnoreCase("LIBRARIAN") ? User.Role.LIBRARIAN : User.Role.READER);
        user.setPhone(request.get("phone"));

        User savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "message", "User registered successfully",
            "membershipId", savedUser.getMembershipId(),
            "user", Map.of(
                "id", savedUser.getId(),
                "email", savedUser.getEmail(),
                "fullName", savedUser.getFullName(),
                "membershipId", savedUser.getMembershipId(),
                "role", savedUser.getRole().name()
            )
        ));
    }
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/controller/BorrowController.java',
    name: 'BorrowController.java',
    category: 'controller',
    language: 'java',
    description: 'REST Controller handling borrowing checkout, book returns, and loan tracking.',
    content: `package com.athenaeum.library.controller;

import com.athenaeum.library.model.BorrowRecord;
import com.athenaeum.library.repository.BorrowRecordRepository;
import com.athenaeum.library.service.LibraryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow")
@CrossOrigin(origins = "*")
public class BorrowController {

    private final LibraryService libraryService;
    private final BorrowRecordRepository borrowRecordRepository;

    public BorrowController(LibraryService libraryService, BorrowRecordRepository borrowRecordRepository) {
        this.libraryService = libraryService;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkoutBook(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            Long bookId = Long.valueOf(payload.get("bookId").toString());
            int days = payload.containsKey("days") ? Integer.parseInt(payload.get("days").toString()) : 14;
            String notes = (String) payload.getOrDefault("notes", "");

            BorrowRecord record = libraryService.borrowBook(userId, bookId, days, notes);
            return ResponseEntity.ok(record);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/return/{recordId}")
    public ResponseEntity<?> returnBook(@PathVariable Long recordId) {
        try {
            BorrowRecord record = libraryService.returnBook(recordId);
            return ResponseEntity.ok(record);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/renew/{recordId}")
    public ResponseEntity<?> renewLoan(@PathVariable Long recordId) {
        try {
            BorrowRecord record = libraryService.renewLoan(recordId);
            return ResponseEntity.ok(record);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowRecord>> getUserLoans(@PathVariable Long userId) {
        return ResponseEntity.ok(borrowRecordRepository.findByUserId(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BorrowRecord>> getAllLoans() {
        return ResponseEntity.ok(borrowRecordRepository.findAll());
    }
}`
  },
  {
    path: 'src/main/java/com/athenaeum/library/controller/WebViewController.java',
    name: 'WebViewController.java',
    category: 'controller',
    language: 'java',
    description: 'Spring MVC Web Controller serving dynamic Java JSP frontend views with data bound to Model.',
    content: `package com.athenaeum.library.controller;

import com.athenaeum.library.model.*;
import com.athenaeum.library.repository.*;
import com.athenaeum.library.service.LibraryService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring MVC Web Controller for the Java Frontend (JSP).
 * Handles user sessions, server-rendered views, and circulation actions.
 */
@Controller
public class WebViewController {

    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final LibraryService libraryService;

    public WebViewController(BookRepository bookRepository,
                             BorrowRecordRepository borrowRecordRepository,
                             UserRepository userRepository,
                             CategoryRepository categoryRepository,
                             LibraryService libraryService) {
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.libraryService = libraryService;
    }

    @GetMapping("/")
    public String index(HttpSession session) {
        return "redirect:/catalog";
    }

    // --- Authentication & Session Views ---
    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error, Model model) {
        if (error != null) {
            model.addAttribute("errorMessage", "Invalid email or credentials. Please try again.");
        }
        return "login";
    }

    @PostMapping("/login")
    public String processLogin(@RequestParam("email") String email,
                               @RequestParam("password") String password,
                               HttpSession session,
                               RedirectAttributes redirectAttributes) {
        Optional<User> userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            session.setAttribute("currentUser", user);
            redirectAttributes.addFlashAttribute("successMessage", "Welcome back, " + user.getFullName() + "!");
            return "redirect:/catalog";
        }
        redirectAttributes.addAttribute("error", "true");
        return "redirect:/login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @PostMapping("/register")
    public String processRegister(@RequestParam("fullName") String fullName,
                                  @RequestParam("email") String email,
                                  @RequestParam("password") String password,
                                  @RequestParam(value = "phone", required = false) String phone,
                                  @RequestParam(value = "role", defaultValue = "READER") String roleStr,
                                  RedirectAttributes redirectAttributes) {
        if (userRepository.existsByEmail(email.trim())) {
            redirectAttributes.addFlashAttribute("errorMessage", "An account with this email already exists.");
            return "redirect:/register";
        }

        String prefix = roleStr.equalsIgnoreCase("LIBRARIAN") ? "LIB-" : "STU-";
        String membershipId = prefix + "2026-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        User user = new User();
        user.setFullName(fullName.trim());
        user.setEmail(email.trim());
        user.setPasswordHash("HASH_" + password.hashCode());
        user.setMembershipId(membershipId);
        user.setRole(roleStr.equalsIgnoreCase("LIBRARIAN") ? User.Role.LIBRARIAN : User.Role.READER);
        user.setPhone(phone);

        userRepository.save(user);
        redirectAttributes.addFlashAttribute("successMessage", "Account created successfully! Membership ID: " + membershipId);
        return "redirect:/login";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session, RedirectAttributes redirectAttributes) {
        session.invalidate();
        redirectAttributes.addFlashAttribute("infoMessage", "You have been logged out.");
        return "redirect:/login";
    }

    // --- Catalog View ---
    @GetMapping("/catalog")
    public String catalogPage(@RequestParam(value = "category", required = false) Long categoryId,
                              @RequestParam(value = "search", required = false) String search,
                              Model model,
                              HttpSession session) {
        List<Book> books;
        if (search != null && !search.trim().isEmpty()) {
            books = bookRepository.searchBooks(search.trim());
            model.addAttribute("searchQuery", search);
        } else if (categoryId != null) {
            books = bookRepository.findByCategoryId(categoryId);
            model.addAttribute("selectedCategoryId", categoryId);
        } else {
            books = bookRepository.findAll();
        }

        model.addAttribute("books", books);
        model.addAttribute("categories", categoryRepository.findAll());
        return "catalog";
    }

    // --- Circulation & Borrowings View ---
    @GetMapping("/loans")
    public String loansPage(Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Please log in to view your borrowed books.");
            return "redirect:/login";
        }

        List<BorrowRecord> activeLoans = borrowRecordRepository.findByUserId(currentUser.getId());
        model.addAttribute("activeLoans", activeLoans);
        return "loans";
    }

    @PostMapping("/borrow/checkout")
    public String borrowBook(@RequestParam("bookId") Long bookId,
                             @RequestParam(value = "days", defaultValue = "14") int days,
                             @RequestParam(value = "notes", required = false) String notes,
                             HttpSession session,
                             RedirectAttributes redirectAttributes) {
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Please log in to borrow books.");
            return "redirect:/login";
        }

        try {
            libraryService.borrowBook(currentUser.getId(), bookId, days, notes);
            redirectAttributes.addFlashAttribute("successMessage", "Book checked out successfully! Track it in your loans.");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/loans";
    }

    @PostMapping("/borrow/return/{recordId}")
    public String returnBook(@PathVariable("recordId") Long recordId, RedirectAttributes redirectAttributes) {
        try {
            libraryService.returnBook(recordId);
            redirectAttributes.addFlashAttribute("successMessage", "Book returned successfully. Inventory updated in MySQL.");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/loans";
    }

    @PostMapping("/borrow/renew/{recordId}")
    public String renewLoan(@PathVariable("recordId") Long recordId, RedirectAttributes redirectAttributes) {
        try {
            libraryService.renewLoan(recordId);
            redirectAttributes.addFlashAttribute("infoMessage", "Loan period renewed for 7 additional days.");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/loans";
    }

    // --- Librarian Admin View ---
    @GetMapping("/admin")
    public String adminPage(Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser == null || currentUser.getRole() != User.Role.LIBRARIAN) {
            redirectAttributes.addFlashAttribute("errorMessage", "Librarian credentials required.");
            return "redirect:/catalog";
        }

        model.addAttribute("books", bookRepository.findAll());
        model.addAttribute("borrowRecords", borrowRecordRepository.findAll());
        model.addAttribute("users", userRepository.findAll());
        model.addAttribute("categories", categoryRepository.findAll());
        return "admin";
    }
}`
  },
  {
    path: 'src/main/webapp/WEB-INF/jsp/common/navbar.jsp',
    name: 'navbar.jsp',
    category: 'frontend_jsp',
    language: 'jsp',
    description: 'Java JSP Navigation bar fragment with session-aware user greeting and role links.',
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<header class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary sticky-top px-3">
    <div class="container-fluid">
        <a class="navbar-brand d-flex items-center gap-2 font-serif" href="\${pageContext.request.contextPath}/catalog">
            <span class="badge bg-warning text-dark p-2 rounded-3">🏛️</span>
            <span class="fw-bold tracking-tight">Athenaeum</span>
            <span class="badge bg-secondary font-monospace fs-6">Java JSP</span>
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href="\${pageContext.request.contextPath}/catalog">📚 Book Catalog</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="\${pageContext.request.contextPath}/loans">🔖 My Loans</a>
                </li>
                <c:if test="\${sessionScope.currentUser.role == 'LIBRARIAN'}">
                    <li class="nav-item">
                        <a class="nav-link text-warning" href="\${pageContext.request.contextPath}/admin">🛡️ Admin Console</a>
                    </li>
                </c:if>
            </ul>

            <div class="d-flex align-items-center gap-3">
                <c:choose>
                    <c:when test="\${not empty sessionScope.currentUser}">
                        <div class="text-end text-light">
                            <span class="fw-semibold d-block">\${sessionScope.currentUser.fullName}</span>
                            <small class="text-muted font-monospace">\${sessionScope.currentUser.membershipId} (\${sessionScope.currentUser.role})</small>
                        </div>
                        <a href="\${pageContext.request.contextPath}/logout" class="btn btn-outline-danger btn-sm">Sign Out</a>
                    </c:when>
                    <c:otherwise>
                        <a href="\${pageContext.request.contextPath}/login" class="btn btn-outline-warning btn-sm me-2">Sign In</a>
                        <a href="\${pageContext.request.contextPath}/register" class="btn btn-warning btn-sm">Register</a>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>
    </div>
</header>`
  },
  {
    path: 'src/main/webapp/WEB-INF/jsp/login.jsp',
    name: 'login.jsp',
    category: 'frontend_jsp',
    language: 'jsp',
    description: 'Java JSP Login page with form binding, JSTL alert rendering, and demo test account helpers.',
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign In - Athenaeum Library System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="\${pageContext.request.contextPath}/static/css/athenaeum.css">
</head>
<body class="bg-dark text-light">

    <jsp:include page="common/navbar.jsp" />

    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="card bg-secondary bg-opacity-25 border-secondary shadow-lg rounded-4 p-4">
                    <div class="text-center mb-4">
                        <span class="fs-1">🔒</span>
                        <h2 class="h4 mt-2 fw-bold text-light">Sign In to Library</h2>
                        <p class="text-secondary small">Access catalog borrowings and manage due dates</p>
                    </div>

                    <!-- Alerts -->
                    <c:if test="\${not empty errorMessage}">
                        <div class="alert alert-danger py-2 small" role="alert">\${errorMessage}</div>
                    </c:if>
                    <c:if test="\${not empty successMessage}">
                        <div class="alert alert-success py-2 small" role="alert">\${successMessage}</div>
                    </c:if>
                    <c:if test="\${not empty infoMessage}">
                        <div class="alert alert-info py-2 small" role="alert">\${infoMessage}</div>
                    </c:if>

                    <form action="\${pageContext.request.contextPath}/login" method="post">
                        <div class="mb-3">
                            <label class="form-label small text-secondary">Email Address</label>
                            <input type="email" name="email" id="emailInput" class="form-control bg-dark text-light border-secondary" required placeholder="reader@campus.edu">
                        </div>

                        <div class="mb-3">
                            <label class="form-label small text-secondary">Password</label>
                            <input type="password" name="password" id="passwordInput" class="form-control bg-dark text-light border-secondary" required placeholder="••••••••">
                        </div>

                        <button type="submit" class="btn btn-warning w-100 fw-bold mt-2">Sign In</button>
                    </form>

                    <hr class="border-secondary my-4">

                    <!-- Fast Demo Switcher -->
                    <div class="small">
                        <span class="text-secondary d-block mb-2 font-monospace">Quick Test Credentials (Pre-seeded):</span>
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-outline-light btn-sm text-start" onclick="fillCredentials('jane.doe@campus.edu', 'reader123')">
                                🧑‍🎓 Student Reader: <code>jane.doe@campus.edu</code>
                            </button>
                            <button type="button" class="btn btn-outline-warning btn-sm text-start" onclick="fillCredentials('admin@athenaeum.edu', 'admin123')">
                                🛡️ Librarian Admin: <code>admin@athenaeum.edu</code>
                            </button>
                        </div>
                    </div>

                    <div class="text-center mt-4 small">
                        <span class="text-secondary">New cardholder?</span>
                        <a href="\${pageContext.request.contextPath}/register" class="text-warning text-decoration-none fw-semibold">Register here</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function fillCredentials(email, pass) {
            document.getElementById('emailInput').value = email;
            document.getElementById('passwordInput').value = pass;
        }
    </script>
</body>
</html>`
  },
  {
    path: 'src/main/webapp/WEB-INF/jsp/register.jsp',
    name: 'register.jsp',
    category: 'frontend_jsp',
    language: 'jsp',
    description: 'Java JSP User Registration page with role selection and membership card generation.',
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register - Athenaeum Library System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="\${pageContext.request.contextPath}/static/css/athenaeum.css">
</head>
<body class="bg-dark text-light">

    <jsp:include page="common/navbar.jsp" />

    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card bg-secondary bg-opacity-25 border-secondary shadow-lg rounded-4 p-4">
                    <div class="text-center mb-4">
                        <span class="fs-1">📝</span>
                        <h2 class="h4 mt-2 fw-bold text-light">Create Library Account</h2>
                        <p class="text-secondary small">Register in MySQL users table for borrowing rights</p>
                    </div>

                    <c:if test="\${not empty errorMessage}">
                        <div class="alert alert-danger py-2 small">\${errorMessage}</div>
                    </c:if>

                    <form action="\${pageContext.request.contextPath}/register" method="post">
                        <div class="mb-3">
                            <label class="form-label small text-secondary">Full Name</label>
                            <input type="text" name="fullName" class="form-control bg-dark text-light border-secondary" required placeholder="e.g. Arthur Pendelton">
                        </div>

                        <div class="mb-3">
                            <label class="form-label small text-secondary">Email Address</label>
                            <input type="email" name="email" class="form-control bg-dark text-light border-secondary" required placeholder="arthur@campus.edu">
                        </div>

                        <div class="row mb-3">
                            <div class="col">
                                <label class="form-label small text-secondary">Password</label>
                                <input type="password" name="password" class="form-control bg-dark text-light border-secondary" required placeholder="••••••••">
                            </div>
                            <div class="col">
                                <label class="form-label small text-secondary">Phone (Optional)</label>
                                <input type="text" name="phone" class="form-control bg-dark text-light border-secondary" placeholder="+1 (555)...">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small text-secondary">Account Role</label>
                            <select name="role" class="form-select bg-dark text-light border-secondary">
                                <option value="READER">Student Reader (Borrow &amp; Track Books)</option>
                                <option value="LIBRARIAN">Librarian Admin (Stock &amp; Catalog Management)</option>
                            </select>
                        </div>

                        <button type="submit" class="btn btn-warning w-100 fw-bold mt-3">Register Card</button>
                    </form>

                    <div class="text-center mt-3 small">
                        <span class="text-secondary">Already registered?</span>
                        <a href="\${pageContext.request.contextPath}/login" class="text-warning text-decoration-none fw-semibold">Sign in</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    path: 'src/main/webapp/WEB-INF/jsp/catalog.jsp',
    name: 'catalog.jsp',
    category: 'frontend_jsp',
    language: 'jsp',
    description: 'Java JSP Catalog view with category filter pills, stock counters, and transactional checkout modal.',
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Book Catalog - Athenaeum Library</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="\${pageContext.request.contextPath}/static/css/athenaeum.css">
</head>
<body class="bg-dark text-light">

    <jsp:include page="common/navbar.jsp" />

    <div class="container py-4">
        <!-- Banner -->
        <div class="p-4 mb-4 rounded-4 bg-secondary bg-opacity-25 border border-secondary shadow-sm">
            <h1 class="h3 font-serif fw-bold text-light">Library Catalog &amp; Circulation</h1>
            <p class="text-secondary small mb-0">
                Server-side rendered with JavaServer Pages (JSP). Real-time inventory synchronized with MySQL.
            </p>
        </div>

        <!-- Search & Category Filters -->
        <div class="d-flex flex-wrap gap-2 mb-4">
            <a href="\${pageContext.request.contextPath}/catalog" class="btn btn-sm \${empty selectedCategoryId ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}">
                All Books
            </a>
            <c:forEach items="\${categories}" var="cat">
                <a href="\${pageContext.request.contextPath}/catalog?category=\${cat.id}" 
                   class="btn btn-sm \${selectedCategoryId == cat.id ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}">
                    \${cat.name}
                </a>
            </c:forEach>
        </div>

        <!-- Book Grid -->
        <div class="row row-cols-1 row-cols-md-3 g-4">
            <c:forEach items="\${books}" var="book">
                <div class="col">
                    <div class="card h-100 bg-secondary bg-opacity-25 border-secondary text-light shadow-sm">
                        <img src="\${book.coverUrl}" class="card-img-top object-fit-cover" style="height: 200px;" alt="\${book.title}">
                        <div class="card-body d-flex flex-column">
                            <span class="badge bg-secondary font-monospace align-self-start mb-2">\${book.category.name}</span>
                            <h5 class="card-title font-serif fw-bold text-truncate">\${book.title}</h5>
                            <h6 class="card-subtitle mb-2 text-secondary small">By \${book.author}</h6>
                            <p class="card-text small text-secondary text-truncate-2">\${book.description}</p>
                            
                            <div class="mt-auto pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                                <div>
                                    <small class="text-secondary d-block font-monospace">Shelf: \${book.shelfLocation}</small>
                                    <span class="badge \${book.availableCopies > 0 ? 'bg-success' : 'bg-danger'}">
                                        \${book.availableCopies} of \${book.totalCopies} available
                                    </span>
                                </div>

                                <c:choose>
                                    <c:when test="\${book.availableCopies > 0}">
                                        <button class="btn btn-sm btn-warning text-dark fw-bold" onclick="openBorrowModal(\${book.id}, '\${book.title}')">
                                            Borrow
                                        </button>
                                    </c:when>
                                    <c:otherwise>
                                        <button class="btn btn-sm btn-secondary" disabled>Out of Stock</button>
                                    </c:otherwise>
                                </c:choose>
                            </div>
                        </div>
                    </div>
                </div>
            </c:forEach>
        </div>
    </div>

    <!-- Borrow Modal -->
    <div class="modal fade" id="borrowModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-light border-secondary">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title font-serif">Confirm Library Loan</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <form action="\${pageContext.request.contextPath}/borrow/checkout" method="post">
                    <div class="modal-body">
                        <input type="hidden" name="bookId" id="modalBookId">
                        <p>You are borrowing: <strong id="modalBookTitle" class="text-warning"></strong></p>
                        
                        <div class="mb-3">
                            <label class="form-label small text-secondary">Loan Duration</label>
                            <select name="days" class="form-select bg-dark text-light border-secondary">
                                <option value="7">7 Days (Short Loan)</option>
                                <option value="14" selected>14 Days (Standard Loan)</option>
                                <option value="28">28 Days (Extended Loan)</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small text-secondary">Notes / Course Ref (Optional)</label>
                            <input type="text" name="notes" class="form-control bg-dark text-light border-secondary" placeholder="e.g. CS Seminar Research">
                        </div>
                    </div>
                    <div class="modal-footer border-secondary">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-warning fw-bold">Confirm Checkout</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function openBorrowModal(id, title) {
            document.getElementById('modalBookId').value = id;
            document.getElementById('modalBookTitle').innerText = title;
            new bootstrap.Modal(document.getElementById('borrowModal')).show();
        }
    </script>
</body>
</html>`
  },
  {
    path: 'src/main/webapp/WEB-INF/jsp/loans.jsp',
    name: 'loans.jsp',
    category: 'frontend_jsp',
    language: 'jsp',
    description: 'Java JSP Member Loans view tracking borrowed books, due dates, renewal, and returns.',
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Borrowed Books - Athenaeum Library</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="\${pageContext.request.contextPath}/static/css/athenaeum.css">
</head>
<body class="bg-dark text-light">

    <jsp:include page="common/navbar.jsp" />

    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 class="h3 font-serif fw-bold text-light">My Borrowed Books &amp; Circulation Record</h1>
                <p class="text-secondary small mb-0">Cardholder: \${sessionScope.currentUser.fullName} (\${sessionScope.currentUser.membershipId})</p>
            </div>
            <a href="\${pageContext.request.contextPath}/catalog" class="btn btn-warning btn-sm fw-bold">Browse Catalog</a>
        </div>

        <c:if test="\${empty activeLoans}">
            <div class="text-center py-5 card bg-secondary bg-opacity-25 border-secondary rounded-4">
                <span class="fs-1">📖</span>
                <h4 class="mt-2 text-light">No Active Loans</h4>
                <p class="text-secondary small">You currently do not have any borrowed books.</p>
                <a href="\${pageContext.request.contextPath}/catalog" class="btn btn-outline-warning btn-sm mx-auto">Borrow a Book</a>
            </div>
        </c:if>

        <div class="row row-cols-1 row-cols-md-2 g-4">
            <c:forEach items="\${activeLoans}" var="loan">
                <div class="col">
                    <div class="card h-100 bg-secondary bg-opacity-25 border-secondary text-light p-3 rounded-4 shadow-sm">
                        <div class="d-flex gap-3">
                            <img src="\${loan.book.coverUrl}" class="rounded object-fit-cover" style="width: 70px; height: 100px;" alt="\${loan.book.title}">
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between">
                                    <span class="badge \${loan.status == 'OVERDUE' ? 'bg-danger' : (loan.status == 'BORROWED' ? 'bg-warning text-dark' : 'bg-success')}">
                                        \${loan.status}
                                    </span>
                                    <small class="text-muted font-monospace">Record #\${loan.id}</small>
                                </div>
                                <h5 class="fw-bold mt-1 mb-0">\${loan.book.title}</h5>
                                <small class="text-secondary">By \${loan.book.author}</small>
                                
                                <div class="mt-2 small text-secondary">
                                    <div>Borrowed: <strong class="text-light font-monospace">\${loan.borrowDate}</strong></div>
                                    <div>Due Date: <strong class="text-warning font-monospace">\${loan.dueDate}</strong></div>
                                </div>
                            </div>
                        </div>

                        <c:if test="\${loan.status != 'RETURNED'}">
                            <div class="d-flex gap-2 mt-3 pt-3 border-top border-secondary">
                                <form action="\${pageContext.request.contextPath}/borrow/renew/\${loan.id}" method="post" class="flex-fill">
                                    <button type="submit" class="btn btn-outline-light btn-sm w-100">Renew (+7d)</button>
                                </form>
                                <form action="\${pageContext.request.contextPath}/borrow/return/\${loan.id}" method="post" class="flex-fill">
                                    <button type="submit" class="btn btn-success btn-sm w-100 fw-bold">Return Book</button>
                                </form>
                            </div>
                        </c:if>
                    </div>
                </div>
            </c:forEach>
        </div>
    </div>
</body>
</html>`
  },
  {
    path: 'src/main/webapp/WEB-INF/jsp/admin.jsp',
    name: 'admin.jsp',
    category: 'frontend_jsp',
    language: 'jsp',
    description: 'Java JSP Librarian Admin Console with book registration form and system loan oversight.',
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Librarian Admin - Athenaeum Library</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="\${pageContext.request.contextPath}/static/css/athenaeum.css">
</head>
<body class="bg-dark text-light">

    <jsp:include page="common/navbar.jsp" />

    <div class="container py-4">
        <h1 class="h3 font-serif fw-bold text-warning mb-4">🛡️ Librarian Administration Console</h1>

        <!-- Stats -->
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="card bg-secondary bg-opacity-25 border-secondary p-3 text-center">
                    <span class="text-secondary small">Total Catalog Titles</span>
                    <h3 class="fw-bold mt-1 text-light">\${books.size()}</h3>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-secondary bg-opacity-25 border-secondary p-3 text-center">
                    <span class="text-secondary small">Circulation Transactions</span>
                    <h3 class="fw-bold mt-1 text-warning">\${borrowRecords.size()}</h3>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-secondary bg-opacity-25 border-secondary p-3 text-center">
                    <span class="text-secondary small">Registered Members</span>
                    <h3 class="fw-bold mt-1 text-light">\${users.size()}</h3>
                </div>
            </div>
        </div>

        <!-- System Loans Table -->
        <div class="card bg-secondary bg-opacity-25 border-secondary p-3 rounded-4 shadow-sm">
            <h5 class="fw-bold text-light mb-3">System-Wide Loans Registry (MySQL borrow_records)</h5>
            <div class="table-responsive">
                <table class="table table-dark table-hover table-sm text-light small">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Member</th>
                            <th>Book Title</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach items="\${borrowRecords}" var="r">
                            <tr>
                                <td>\${r.id}</td>
                                <td>\${r.user.fullName} <small class="text-muted font-monospace">(\${r.user.membershipId})</small></td>
                                <td>\${r.book.title}</td>
                                <td>\${r.borrowDate}</td>
                                <td>\${r.dueDate}</td>
                                <td>
                                    <span class="badge \${r.status == 'OVERDUE' ? 'bg-danger' : (r.status == 'BORROWED' ? 'bg-warning text-dark' : 'bg-success')}">
                                        \${r.status}
                                    </span>
                                </td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    path: 'src/main/webapp/static/css/athenaeum.css',
    name: 'athenaeum.css',
    category: 'frontend_jsp',
    language: 'css',
    description: 'Shared stylesheet for Java JSP frontend views.',
    content: `/* Athenaeum Library Management System - Java JSP Styling */
body {
    background-color: #0b0f19;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
.font-serif {
    font-family: Georgia, Cambria, "Times New Roman", Times, serif;
}
.font-monospace {
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    language: 'markdown',
    description: 'Unified Java Architecture and Apache Tomcat WAR deployment guide.',
    content: `# Athenaeum - Unified Java Library Management System (Frontend & Backend in One WAR)

A complete, unified enterprise Java Web Application where **both the frontend (JSP / JSTL / Servlets) and backend (Spring Boot / Data JPA / MySQL)** are packaged together in **ONE single folder** and built into a deployable \`.war\` archive.

---

## 🏗️ Unified Single-Folder Project Architecture

Everything lives together in this single Maven project structure:

\`\`\`
library-management/
├── pom.xml                                   <-- Single Maven build file (<packaging>war</packaging>)
├── schema.sql                                <-- MySQL 8.0 DDL & seed queries
├── src/
│   ├── main/
│   │   ├── java/com/athenaeum/library/       <-- Java Backend
│   │   │   ├── LibraryApplication.java       <-- SpringBootServletInitializer entry point
│   │   │   ├── model/                        <-- JPA MySQL Entities (User, Book, BorrowRecord, Category)
│   │   │   ├── repository/                   <-- Spring Data Repositories
│   │   │   ├── service/                      <-- Transactional Business Services
│   │   │   └── controller/
│   │   │       ├── WebViewController.java    <-- Serves Java JSP Frontend Views
│   │   │       ├── AuthController.java       <-- REST Authentication APIs
│   │   │       └── BorrowController.java     <-- REST Circulation APIs
│   │   ├── resources/
│   │   │   └── application.properties        <-- MySQL JDBC configuration
│   │   └── webapp/                           <-- Java Frontend
│   │       ├── WEB-INF/
│   │       │   ├── web.xml                   <-- Servlet 6.0 deployment descriptor
│   │       │   └── jsp/                      <-- Dynamic JavaServer Pages (JSP)
│   │       │       ├── common/navbar.jsp
│   │       │       ├── login.jsp             <-- Java Login view
│   │       │       ├── register.jsp          <-- Java Sign Up view
│   │       │       ├── catalog.jsp           <-- Java Book Catalog & Checkout view
│   │       │       ├── loans.jsp             <-- Java Borrowed Books & Tracking view
│   │       │       └── admin.jsp             <-- Java Librarian Admin Console
│   │       └── static/css/athenaeum.css      <-- Stylesheet
\`\`\`

---

## 🚀 How to Build & Deploy the Unified WAR

### Step 1: Initialize MySQL Database
\`\`\`sql
CREATE DATABASE library_db;
mysql -u root -p library_db < schema.sql
\`\`\`

### Step 2: Build Both Frontend & Backend into a Single .WAR
Inside the project root:
\`\`\`bash
mvn clean package
\`\`\`
Maven packages **both** the Java JSP frontend views (\`WEB-INF/jsp/\`) and the compiled Java backend classes (\`WEB-INF/classes/\`) into:
\`\`\`
target/library-management.war
\`\`\`

### Step 3: Deploy to Apache Tomcat
Copy the \`.war\` directly into Tomcat's deployment folder:
\`\`\`bash
cp target/library-management.war /opt/tomcat/webapps/
/opt/tomcat/bin/startup.sh
\`\`\`

Access the complete Java web application in your browser:
\`\`\`
http://localhost:8080/library-management/
\`\`\`

Both your **Java Frontend (JSP views)** and **Java Backend (Spring Boot + MySQL)** will be served seamlessly together!
`
  }
];

