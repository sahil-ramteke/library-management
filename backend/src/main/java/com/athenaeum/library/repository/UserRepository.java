package com.athenaeum.library.repository;

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
}