package com.athenaeum.library.repository;

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
}