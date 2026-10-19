import { Book, User, BorrowRecord, Category, SqlQueryRecord } from '../types';

export interface SqlExecutionState {
  users: User[];
  books: Book[];
  borrowRecords: BorrowRecord[];
  categories: Category[];
}

export function executeSqlSimulation(
  rawQuery: string,
  state: SqlExecutionState
): SqlQueryRecord {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();

  const record: SqlQueryRecord = {
    id: 'query_' + Date.now(),
    query,
    executedAt: new Date().toLocaleTimeString(),
    status: 'SUCCESS'
  };

  try {
    // 1. SELECT * FROM books
    if (lower.startsWith('select') && lower.includes('from books') && !lower.includes('join')) {
      let filtered = [...state.books];
      if (lower.includes('available_copies > 0') || lower.includes('availablecopies > 0')) {
        filtered = filtered.filter((b) => b.availableCopies > 0);
      }
      record.resultColumns = ['id', 'isbn', 'title', 'author', 'category_id', 'total_copies', 'available_copies', 'shelf_location'];
      record.resultRows = filtered.map((b) => ({
        id: b.id,
        isbn: b.isbn,
        title: b.title,
        author: b.author,
        category_id: b.categoryId,
        total_copies: b.totalCopies,
        available_copies: b.availableCopies,
        shelf_location: b.shelfLocation
      }));
      record.rowsAffected = filtered.length;
      return record;
    }

    // 2. SELECT * FROM users
    if (lower.startsWith('select') && lower.includes('from users')) {
      record.resultColumns = ['id', 'email', 'full_name', 'membership_id', 'role', 'phone', 'joined_at'];
      record.resultRows = state.users.map((u) => ({
        id: u.id,
        email: u.email,
        full_name: u.fullName,
        membership_id: u.membershipId,
        role: u.role,
        phone: u.phone || 'N/A',
        joined_at: u.joinedAt
      }));
      record.rowsAffected = state.users.length;
      return record;
    }

    // 3. SELECT * FROM categories
    if (lower.startsWith('select') && lower.includes('from categories')) {
      record.resultColumns = ['id', 'code', 'name', 'description'];
      record.resultRows = state.categories.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        description: c.description
      }));
      record.rowsAffected = state.categories.length;
      return record;
    }

    // 4. JOIN query: borrow_records with users and books
    if (lower.startsWith('select') && (lower.includes('borrow_records') || lower.includes('borrowrecords')) && lower.includes('join')) {
      record.resultColumns = ['borrow_id', 'member_name', 'membership_no', 'book_title', 'borrow_date', 'due_date', 'status', 'fine_amount'];
      record.resultRows = state.borrowRecords.map((r) => {
        const user = state.users.find((u) => u.id === r.userId);
        const book = state.books.find((b) => b.id === r.bookId);
        return {
          borrow_id: r.id,
          member_name: user?.fullName || r.userName,
          membership_no: user?.membershipId || r.membershipId,
          book_title: book?.title || r.bookTitle,
          borrow_date: r.borrowDate,
          due_date: r.dueDate,
          status: r.status,
          fine_amount: `$${r.fineAmount.toFixed(2)}`
        };
      });
      record.rowsAffected = state.borrowRecords.length;
      return record;
    }

    // 5. SELECT * FROM borrow_records
    if (lower.startsWith('select') && (lower.includes('from borrow_records') || lower.includes('from borrowrecords'))) {
      record.resultColumns = ['id', 'user_id', 'book_id', 'borrow_date', 'due_date', 'return_date', 'status', 'fine_amount'];
      record.resultRows = state.borrowRecords.map((r) => ({
        id: r.id,
        user_id: r.userId,
        book_id: r.bookId,
        borrow_date: r.borrowDate,
        due_date: r.dueDate,
        return_date: r.returnDate || 'NULL',
        status: r.status,
        fine_amount: `$${r.fineAmount.toFixed(2)}`
      }));
      record.rowsAffected = state.borrowRecords.length;
      return record;
    }

    // 6. Aggregation: count loans by book
    if (lower.startsWith('select') && lower.includes('count') && lower.includes('group by')) {
      const counts: Record<string, number> = {};
      state.borrowRecords.forEach((r) => {
        counts[r.bookTitle] = (counts[r.bookTitle] || 0) + 1;
      });
      record.resultColumns = ['book_title', 'total_borrows'];
      record.resultRows = Object.entries(counts).map(([title, cnt]) => ({
        book_title: title,
        total_borrows: cnt
      }));
      record.rowsAffected = record.resultRows.length;
      return record;
    }

    // Default fallback mock query execution
    record.resultColumns = ['status', 'message'];
    record.resultRows = [
      {
        status: 'OK',
        message: `Query parsed successfully. MySQL 8.0 InnoDB engine processed 0 errors.`
      }
    ];
    record.rowsAffected = 1;
    return record;
  } catch (err: any) {
    return {
      id: 'query_' + Date.now(),
      query,
      executedAt: new Date().toLocaleTimeString(),
      status: 'ERROR',
      errorMessage: err.message || 'Syntax error in SQL statement.'
    };
  }
}
