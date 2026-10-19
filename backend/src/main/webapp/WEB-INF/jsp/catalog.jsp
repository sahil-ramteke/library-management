<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Book Catalog - Athenaeum Library</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/athenaeum.css">
</head>
<body class="bg-dark text-light">

    <jsp:include page="common/navbar.jsp" />

    <div class="container py-4">
        <!-- Banner -->
        <div class="p-4 mb-4 rounded-4 bg-secondary bg-opacity-25 border border-secondary shadow-sm">
            <h1 class="h3 font-serif fw-bold text-light">Library Catalog &amp; Circulation</h1>
            <p class="text-secondary small mb-0">
                Server-side rendered with JavaServer Pages (JSP). Real-time inventory synchronized with MySQL.
            </p>
        </div>

        <!-- Search & Category Filters -->
        <div class="d-flex flex-wrap gap-2 mb-4">
            <a href="${pageContext.request.contextPath}/catalog" class="btn btn-sm ${empty selectedCategoryId ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}">
                All Books
            </a>
            <c:forEach items="${categories}" var="cat">
                <a href="${pageContext.request.contextPath}/catalog?category=${cat.id}" 
                   class="btn btn-sm ${selectedCategoryId == cat.id ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}">
                    ${cat.name}
                </a>
            </c:forEach>
        </div>

        <!-- Book Grid -->
        <div class="row row-cols-1 row-cols-md-3 g-4">
            <c:forEach items="${books}" var="book">
                <div class="col">
                    <div class="card h-100 bg-secondary bg-opacity-25 border-secondary text-light shadow-sm">
                        <img src="${book.coverUrl}" class="card-img-top object-fit-cover" style="height: 200px;" alt="${book.title}">
                        <div class="card-body d-flex flex-column">
                            <span class="badge bg-secondary font-monospace align-self-start mb-2">${book.category.name}</span>
                            <h5 class="card-title font-serif fw-bold text-truncate">${book.title}</h5>
                            <h6 class="card-subtitle mb-2 text-secondary small">By ${book.author}</h6>
                            <p class="card-text small text-secondary text-truncate-2">${book.description}</p>
                            
                            <div class="mt-auto pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                                <div>
                                    <small class="text-secondary d-block font-monospace">Shelf: ${book.shelfLocation}</small>
                                    <span class="badge ${book.availableCopies > 0 ? 'bg-success' : 'bg-danger'}">
                                        ${book.availableCopies} of ${book.totalCopies} available
                                    </span>
                                </div>

                                <c:choose>
                                    <c:when test="${book.availableCopies > 0}">
                                        <button class="btn btn-sm btn-warning text-dark fw-bold" onclick="openBorrowModal(${book.id}, '${book.title}')">
                                            Borrow
                                        </button>
                                    </c:when>
                                    <c:otherwise>
                                        <button class="btn btn-sm btn-secondary" disabled>Out of Stock</button>
                                    </c:otherwise>
                                </c:choose>
                            </div>
                        </div>
                    </div>
                </div>
            </c:forEach>
        </div>
    </div>

    <!-- Borrow Modal -->
    <div class="modal fade" id="borrowModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-light border-secondary">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title font-serif">Confirm Library Loan</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <form action="${pageContext.request.contextPath}/borrow/checkout" method="post">
                    <div class="modal-body">
                        <input type="hidden" name="bookId" id="modalBookId">
                        <p>You are borrowing: <strong id="modalBookTitle" class="text-warning"></strong></p>
                        
                        <div class="mb-3">
                            <label class="form-label small text-secondary">Loan Duration</label>
                            <select name="days" class="form-select bg-dark text-light border-secondary">
                                <option value="7">7 Days (Short Loan)</option>
                                <option value="14" selected>14 Days (Standard Loan)</option>
                                <option value="28">28 Days (Extended Loan)</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small text-secondary">Notes / Course Ref (Optional)</label>
                            <input type="text" name="notes" class="form-control bg-dark text-light border-secondary" placeholder="e.g. CS Seminar Research">
                        </div>
                    </div>
                    <div class="modal-footer border-secondary">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-warning fw-bold">Confirm Checkout</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function openBorrowModal(id, title) {
            document.getElementById('modalBookId').value = id;
            document.getElementById('modalBookTitle').innerText = title;
            new bootstrap.Modal(document.getElementById('borrowModal')).show();
        }
    </script>
</body>
</html>