package com.athenaeum.library.controller;

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
}