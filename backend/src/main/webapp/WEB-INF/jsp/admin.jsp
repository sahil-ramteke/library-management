<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Librarian Admin - Athenaeum Library</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/athenaeum.css">
</head>
<body class="bg-dark text-light">

    <jsp:include page="common/navbar.jsp" />

    <div class="container py-4">
        <h1 class="h3 font-serif fw-bold text-warning mb-4">🛡️ Librarian Administration Console</h1>

        <!-- Stats -->
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="card bg-secondary bg-opacity-25 border-secondary p-3 text-center">
                    <span class="text-secondary small">Total Catalog Titles</span>
                    <h3 class="fw-bold mt-1 text-light">${books.size()}</h3>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-secondary bg-opacity-25 border-secondary p-3 text-center">
                    <span class="text-secondary small">Circulation Transactions</span>
                    <h3 class="fw-bold mt-1 text-warning">${borrowRecords.size()}</h3>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-secondary bg-opacity-25 border-secondary p-3 text-center">
                    <span class="text-secondary small">Registered Members</span>
                    <h3 class="fw-bold mt-1 text-light">${users.size()}</h3>
                </div>
            </div>
        </div>

        <!-- System Loans Table -->
        <div class="card bg-secondary bg-opacity-25 border-secondary p-3 rounded-4 shadow-sm">
            <h5 class="fw-bold text-light mb-3">System-Wide Loans Registry (MySQL borrow_records)</h5>
            <div class="table-responsive">
                <table class="table table-dark table-hover table-sm text-light small">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Member</th>
                            <th>Book Title</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach items="${borrowRecords}" var="r">
                            <tr>
                                <td>${r.id}</td>
                                <td>${r.user.fullName} <small class="text-muted font-monospace">(${r.user.membershipId})</small></td>
                                <td>${r.book.title}</td>
                                <td>${r.borrowDate}</td>
                                <td>${r.dueDate}</td>
                                <td>
                                    <span class="badge ${r.status == 'OVERDUE' ? 'bg-danger' : (r.status == 'BORROWED' ? 'bg-warning text-dark' : 'bg-success')}">
                                        ${r.status}
                                    </span>
                                </td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>