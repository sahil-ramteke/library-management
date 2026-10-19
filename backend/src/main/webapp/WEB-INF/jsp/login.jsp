<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign In - Athenaeum Library System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/athenaeum.css">
</head>
<body class="bg-dark text-light">

    <jsp:include page="common/navbar.jsp" />

    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="card bg-secondary bg-opacity-25 border-secondary shadow-lg rounded-4 p-4">
                    <div class="text-center mb-4">
                        <span class="fs-1">🔒</span>
                        <h2 class="h4 mt-2 fw-bold text-light">Sign In to Library</h2>
                        <p class="text-secondary small">Access catalog borrowings and manage due dates</p>
                    </div>

                    <!-- Alerts -->
                    <c:if test="${not empty errorMessage}">
                        <div class="alert alert-danger py-2 small" role="alert">${errorMessage}</div>
                    </c:if>
                    <c:if test="${not empty successMessage}">
                        <div class="alert alert-success py-2 small" role="alert">${successMessage}</div>
                    </c:if>
                    <c:if test="${not empty infoMessage}">
                        <div class="alert alert-info py-2 small" role="alert">${infoMessage}</div>
                    </c:if>

                    <form action="${pageContext.request.contextPath}/login" method="post">
                        <div class="mb-3">
                            <label class="form-label small text-secondary">Email Address</label>
                            <input type="email" name="email" id="emailInput" class="form-control bg-dark text-light border-secondary" required placeholder="reader@campus.edu">
                        </div>

                        <div class="mb-3">
                            <label class="form-label small text-secondary">Password</label>
                            <input type="password" name="password" id="passwordInput" class="form-control bg-dark text-light border-secondary" required placeholder="••••••••">
                        </div>

                        <button type="submit" class="btn btn-warning w-100 fw-bold mt-2">Sign In</button>
                    </form>

                    <hr class="border-secondary my-4">

                    <!-- Fast Demo Switcher -->
                    <div class="small">
                        <span class="text-secondary d-block mb-2 font-monospace">Quick Test Credentials (Pre-seeded):</span>
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-outline-light btn-sm text-start" onclick="fillCredentials('jane.doe@campus.edu', 'reader123')">
                                🧑‍🎓 Student Reader: <code>jane.doe@campus.edu</code>
                            </button>
                            <button type="button" class="btn btn-outline-warning btn-sm text-start" onclick="fillCredentials('admin@athenaeum.edu', 'admin123')">
                                🛡️ Librarian Admin: <code>admin@athenaeum.edu</code>
                            </button>
                        </div>
                    </div>

                    <div class="text-center mt-4 small">
                        <span class="text-secondary">New cardholder?</span>
                        <a href="${pageContext.request.contextPath}/register" class="text-warning text-decoration-none fw-semibold">Register here</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function fillCredentials(email, pass) {
            document.getElementById('emailInput').value = email;
            document.getElementById('passwordInput').value = pass;
        }
    </script>
</body>
</html>