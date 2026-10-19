<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register - Athenaeum Library System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/athenaeum.css">
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

                    <c:if test="${not empty errorMessage}">
                        <div class="alert alert-danger py-2 small">${errorMessage}</div>
                    </c:if>

                    <form action="${pageContext.request.contextPath}/register" method="post">
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
                        <a href="${pageContext.request.contextPath}/login" class="text-warning text-decoration-none fw-semibold">Sign in</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>