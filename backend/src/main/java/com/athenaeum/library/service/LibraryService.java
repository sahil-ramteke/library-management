package com.athenaeum.library.service;

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

    @Value("${library.max-borrow-limit:5}")
    private int maxBorrowLimit;

    @Value("${library.daily-fine-rate:0.50}")
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
}