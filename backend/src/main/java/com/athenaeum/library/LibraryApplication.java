package com.athenaeum.library;

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
}