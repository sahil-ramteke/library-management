# Athenaeum - Unified Java Library Management System (Frontend & Backend in One WAR)

A complete, unified enterprise Java Web Application where **both the frontend (JSP / JSTL / Servlets) and backend (Spring Boot / Data JPA / MySQL)** are packaged together in **ONE single folder** and built into a deployable `.war` archive.

---

## 🏗️ Unified Single-Folder Project Architecture

Everything lives together in this single Maven project structure:

```
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
```

---

## 🚀 How to Build & Deploy the Unified WAR

### Step 1: Initialize MySQL Database
```sql
CREATE DATABASE library_db;
mysql -u root -p library_db < schema.sql
```

### Step 2: Build Both Frontend & Backend into a Single .WAR
Inside the project root:
```bash
mvn clean package
```
Maven packages **both** the Java JSP frontend views (`WEB-INF/jsp/`) and the compiled Java backend classes (`WEB-INF/classes/`) into:
```
target/library-management.war
```

### Step 3: Deploy to Apache Tomcat
Copy the `.war` directly into Tomcat's deployment folder:
```bash
cp target/library-management.war /opt/tomcat/webapps/
/opt/tomcat/bin/startup.sh
```

Access the complete Java web application in your browser:
```
http://localhost:8080/library-management/
```

Both your **Java Frontend (JSP views)** and **Java Backend (Spring Boot + MySQL)** will be served seamlessly together!
