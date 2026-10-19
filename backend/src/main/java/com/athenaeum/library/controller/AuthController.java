package com.athenaeum.library.controller;

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
}