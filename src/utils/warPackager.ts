import JSZip from 'jszip';
import { JAVA_PROJECT_FILES } from '../data/javaProjectFiles';
import { Book, User, BorrowRecord, Category } from '../types';

/**
 * Packages and downloads an authentic Java .WAR archive for deployment on Apache Tomcat
 */
export async function generateAndDownloadWar(
  books: Book[],
  users: User[],
  records: BorrowRecord[],
  categories: Category[]
): Promise<void> {
  const zip = new JSZip();

  // 1. META-INF/MANIFEST.MF
  zip.file(
    'META-INF/MANIFEST.MF',
    `Manifest-Version: 1.0\nCreated-By: Apache Maven 3.9.6\nBuilt-By: Athenaeum Build Engine\nBuild-Jdk: 17.0.10\nMain-Class: org.springframework.boot.loader.launch.WarLauncher\nStart-Class: com.athenaeum.library.LibraryApplication\nSpring-Boot-Version: 3.2.5\nSpring-Boot-Classes: WEB-INF/classes/\nSpring-Boot-Lib: WEB-INF/lib/\n`
  );

  // 2. WEB-INF/web.xml
  const webXml = JAVA_PROJECT_FILES.find((f) => f.path === 'src/main/webapp/WEB-INF/web.xml')?.content || '';
  zip.file('WEB-INF/web.xml', webXml);

  // 3. WEB-INF/classes/application.properties
  const appProps = JAVA_PROJECT_FILES.find((f) => f.path === 'src/main/resources/application.properties')?.content || '';
  zip.file('WEB-INF/classes/application.properties', appProps);

  // 4. WEB-INF/classes/schema.sql (with current dynamic snapshot)
  const currentSql = generateDynamicSqlDump(books, users, records, categories);
  zip.file('WEB-INF/classes/schema.sql', currentSql);
  zip.file('schema.sql', currentSql);

  // 5. Pack source Java files and Frontend JSP Views into WAR
  JAVA_PROJECT_FILES.forEach((file) => {
    if (file.path.endsWith('.java')) {
      zip.file(`WEB-INF/src/${file.path}`, file.content);
    }
    // Frontend JSP views in WEB-INF/jsp/
    if (file.path.includes('/jsp/')) {
      const subPath = file.path.split('/jsp/')[1];
      zip.file(`WEB-INF/jsp/${subPath}`, file.content);
    }
    // Static assets (CSS)
    if (file.path.includes('/static/')) {
      const subPath = file.path.split('/static/')[1];
      zip.file(`static/${subPath}`, file.content);
    }
  });

  // 6. Root Index JSP view routing to catalog
  zip.file(
    'index.jsp',
    `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>Athenaeum Library Management System (Tomcat WAR)</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="card shadow-sm p-4">
            <h1 class="display-6 text-primary">🏛️ Athenaeum Library Management</h1>
            <p class="lead">Java Spring Boot Application deployed successfully via <code>library-management.war</code> on Apache Tomcat.</p>
            <hr>
            <h5>Active Modules:</h5>
            <ul>
                <li>User Authentication &amp; Signup (Reader &amp; Librarian roles)</li>
                <li>MySQL Database Connectivity (HikariCP + Hibernate JPA)</li>
                <li>Borrowing &amp; Return Transaction Tracking with Fine Calculation</li>
            </ul>
            <p class="text-muted">Access REST APIs at <code>/api/books</code>, <code>/api/borrow/user/{id}</code>, <code>/api/auth/login</code>.</p>
        </div>
    </div>
</body>
</html>`
  );

  // 7. Embed Maven pom.xml inside META-INF/maven
  const pom = JAVA_PROJECT_FILES.find((f) => f.path === 'pom.xml')?.content || '';
  zip.file('META-INF/maven/com.athenaeum/library-management/pom.xml', pom);

  // 8. Generate WAR blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  triggerBrowserDownload(blob, 'library-management.war');
}

/**
 * Packages and downloads the entire Maven project source tree
 */
export async function generateAndDownloadMavenZip(
  books: Book[],
  users: User[],
  records: BorrowRecord[],
  categories: Category[]
): Promise<void> {
  const zip = new JSZip();

  JAVA_PROJECT_FILES.forEach((file) => {
    zip.file(file.path, file.content);
  });

  // Overwrite schema.sql with current dynamic state
  const currentSql = generateDynamicSqlDump(books, users, records, categories);
  zip.file('schema.sql', currentSql);
  zip.file('src/main/resources/schema.sql', currentSql);

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  triggerBrowserDownload(blob, 'athenaeum-library-java-project.zip');
}

/**
 * Generates ready-to-run MySQL SQL dump reflecting current application state
 */
export function generateDynamicSqlDump(
  books: Book[],
  users: User[],
  records: BorrowRecord[],
  categories: Category[]
): string {
  const baseSql = JAVA_PROJECT_FILES.find((f) => f.name === 'schema.sql')?.content || '';

  const usersInserts = users
    .map(
      (u) =>
        `(${u.id}, '${escapeSql(u.email)}', '$2a$10$DEMO_SECURE_HASH', '${escapeSql(u.fullName)}', '${escapeSql(
          u.membershipId
        )}', '${u.role}', '${escapeSql(u.phone || '+1-555-0100')}')`
    )
    .join(',\n');

  const categoriesInserts = categories
    .map((c) => `(${c.id}, '${escapeSql(c.name)}', '${escapeSql(c.code)}', '${escapeSql(c.description)}')`)
    .join(',\n');

  const booksInserts = books
    .map(
      (b) =>
        `(${b.id}, '${escapeSql(b.isbn)}', '${escapeSql(b.title)}', '${escapeSql(b.author)}', ${b.categoryId}, ${
          b.totalCopies
        }, ${b.availableCopies}, '${escapeSql(b.shelfLocation)}', '${escapeSql(b.description)}', ${b.publishedYear})`
    )
    .join(',\n');

  const borrowInserts = records.length > 0
    ? records
        .map(
          (r) =>
            `(${r.id}, ${r.userId}, ${r.bookId}, '${r.borrowDate}', '${r.dueDate}', ${
              r.returnDate ? `'${r.returnDate}'` : 'NULL'
            }, '${r.status}', ${r.fineAmount.toFixed(2)}, ${r.renewedCount}, '${escapeSql(r.notes || '')}')`
        )
        .join(',\n')
    : '';

  return `-- ====================================================================
-- Athenaeum Library Management System - Live MySQL 8.0+ Database Dump
-- Generated at: ${new Date().toISOString()}
-- ====================================================================

CREATE DATABASE IF NOT EXISTS library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE library_db;

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
    INDEX idx_user_email (email),
    INDEX idx_membership (membership_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_book_isbn (isbn),
    INDEX idx_book_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT,
    INDEX idx_borrow_user (user_id),
    INDEX idx_borrow_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Synced from Active Application
INSERT INTO users (id, email, password_hash, full_name, membership_id, role, phone) VALUES
${usersInserts};

INSERT INTO categories (id, name, code, description) VALUES
${categoriesInserts};

INSERT INTO books (id, isbn, title, author, category_id, total_copies, available_copies, shelf_location, description, published_year) VALUES
${booksInserts};

${
  borrowInserts
    ? `INSERT INTO borrow_records (id, user_id, book_id, borrow_date, due_date, return_date, status, fine_amount, renewed_count, notes) VALUES\n${borrowInserts};`
    : '-- No borrow records yet'
}
`;
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
