<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<header class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary sticky-top px-3">
    <div class="container-fluid">
        <a class="navbar-brand d-flex items-center gap-2 font-serif" href="${pageContext.request.contextPath}/catalog">
            <span class="badge bg-warning text-dark p-2 rounded-3">🏛️</span>
            <span class="fw-bold tracking-tight">Athenaeum</span>
            <span class="badge bg-secondary font-monospace fs-6">Java JSP</span>
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href="${pageContext.request.contextPath}/catalog">📚 Book Catalog</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="${pageContext.request.contextPath}/loans">🔖 My Loans</a>
                </li>
                <c:if test="${sessionScope.currentUser.role == 'LIBRARIAN'}">
                    <li class="nav-item">
                        <a class="nav-link text-warning" href="${pageContext.request.contextPath}/admin">🛡️ Admin Console</a>
                    </li>
                </c:if>
            </ul>

            <div class="d-flex align-items-center gap-3">
                <c:choose>
                    <c:when test="${not empty sessionScope.currentUser}">
                        <div class="text-end text-light">
                            <span class="fw-semibold d-block">${sessionScope.currentUser.fullName}</span>
                            <small class="text-muted font-monospace">${sessionScope.currentUser.membershipId} (${sessionScope.currentUser.role})</small>
                        </div>
                        <a href="${pageContext.request.contextPath}/logout" class="btn btn-outline-danger btn-sm">Sign Out</a>
                    </c:when>
                    <c:otherwise>
                        <a href="${pageContext.request.contextPath}/login" class="btn btn-outline-warning btn-sm me-2">Sign In</a>
                        <a href="${pageContext.request.contextPath}/register" class="btn btn-warning btn-sm">Register</a>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>
    </div>
</header>