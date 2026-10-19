package com.athenaeum.library.controller;

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
}