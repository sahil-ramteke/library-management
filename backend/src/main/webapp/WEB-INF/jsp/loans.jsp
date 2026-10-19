<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Borrowed Books - Athenaeum Library</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/athenaeum.css">
</head>
<body class="bg-dark text-light">

    <jsp:include page="common/navbar.jsp" />

    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 class="h3 font-serif fw-bold text-light">My Borrowed Books &amp; Circulation Record</h1>
                <p class="text-secondary small mb-0">Cardholder: ${sessionScope.currentUser.fullName} (${sessionScope.currentUser.membershipId})</p>
            </div>
            <a href="${pageContext.request.contextPath}/catalog" class="btn btn-warning btn-sm fw-bold">Browse Catalog</a>
        </div>

        <c:if test="${empty activeLoans}">
            <div class="text-center py-5 card bg-secondary bg-opacity-25 border-secondary rounded-4">
                <span class="fs-1">📖</span>
                <h4 class="mt-2 text-light">No Active Loans</h4>
                <p class="text-secondary small">You currently do not have any borrowed books.</p>
                <a href="${pageContext.request.contextPath}/catalog" class="btn btn-outline-warning btn-sm mx-auto">Borrow a Book</a>
            </div>
        </c:if>

        <div class="row row-cols-1 row-cols-md-2 g-4">
            <c:forEach items="${activeLoans}" var="loan">
                <div class="col">
                    <div class="card h-100 bg-secondary bg-opacity-25 border-secondary text-light p-3 rounded-4 shadow-sm">
                        <div class="d-flex gap-3">
                            <img src="${loan.book.coverUrl}" class="rounded object-fit-cover" style="width: 70px; height: 100px;" alt="${loan.book.title}">
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between">
                                    <span class="badge ${loan.status == 'OVERDUE' ? 'bg-danger' : (loan.status == 'BORROWED' ? 'bg-warning text-dark' : 'bg-success')}">
                                        ${loan.status}
                                    </span>
                                    <small class="text-muted font-monospace">Record #${loan.id}</small>
                                </div>
                                <h5 class="fw-bold mt-1 mb-0">${loan.book.title}</h5>
                                <small class="text-secondary">By ${loan.book.author}</small>
                                
                                <div class="mt-2 small text-secondary">
                                    <div>Borrowed: <strong class="text-light font-monospace">${loan.borrowDate}</strong></div>
                                    <div>Due Date: <strong class="text-warning font-monospace">${loan.dueDate}</strong></div>
                                </div>
                            </div>
                        </div>

                        <c:if test="${loan.status != 'RETURNED'}">
                            <div class="d-flex gap-2 mt-3 pt-3 border-top border-secondary">
                                <form action="${pageContext.request.contextPath}/borrow/renew/${loan.id}" method="post" class="flex-fill">
                                    <button type="submit" class="btn btn-outline-light btn-sm w-100">Renew (+7d)</button>
                                </form>
                                <form action="${pageContext.request.contextPath}/borrow/return/${loan.id}" method="post" class="flex-fill">
                                    <button type="submit" class="btn btn-success btn-sm w-100 fw-bold">Return Book</button>
                                </form>
                            </div>
                        </c:if>
                    </div>
                </div>
            </c:forEach>
        </div>
    </div>
</body>
</html>