import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BookCatalog } from './components/BookCatalog';
import { BorrowModal } from './components/BorrowModal';
import { BookDetailsModal } from './components/BookDetailsModal';
import { UserLoans } from './components/UserLoans';
import { AdminPanel } from './components/AdminPanel';
import { MysqlWorkbench } from './components/MysqlWorkbench';
import { JavaWarGenerator } from './components/JavaWarGenerator';
import { AuthModal } from './components/AuthModal';

import { Book, User, BorrowRecord, Category } from './types';
import { 
  INITIAL_BOOKS, 
  INITIAL_CATEGORIES, 
  INITIAL_USERS, 
  INITIAL_BORROW_RECORDS 
} from './data/initialData';

import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function App() {
  // Persistent State initialization
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('athenaeum_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('athenaeum_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // Start as Jane Doe (Student Reader)
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('athenaeum_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(() => {
    const saved = localStorage.getItem('athenaeum_records');
    return saved ? JSON.parse(saved) : INITIAL_BORROW_RECORDS;
  });

  const [activeTab, setActiveTab] = useState<'catalog' | 'my-loans' | 'admin' | 'mysql' | 'java-war'>('catalog');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedBookForBorrow, setSelectedBookForBorrow] = useState<Book | null>(null);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('athenaeum_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('athenaeum_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('athenaeum_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('athenaeum_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('athenaeum_records', JSON.stringify(borrowRecords));
  }, [borrowRecords]);

  // Borrow Transaction Handler
  const handleConfirmBorrow = (bookId: number, loanDays: number, notes: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook || targetBook.availableCopies <= 0) {
      showToast('This book is currently out of stock.', 'error');
      return;
    }

    // 1. Decrement available copies in books catalog
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b))
    );

    // 2. Generate new borrow record
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + loanDays);

    const newRecord: BorrowRecord = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.fullName,
      membershipId: currentUser.membershipId,
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      bookAuthor: targetBook.author,
      bookCover: targetBook.coverUrl,
      borrowDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null,
      status: 'BORROWED',
      fineAmount: 0,
      renewedCount: 0,
      notes: notes || 'Standard checkout'
    };

    setBorrowRecords((prev) => [newRecord, ...prev]);
    showToast(`Checked out "${targetBook.title}". Due date: ${newRecord.dueDate}.`, 'success');
  };

  // Return Transaction Handler
  const handleReturnBook = (recordId: number) => {
    const targetRecord = borrowRecords.find((r) => r.id === recordId);
    if (!targetRecord) return;

    const todayStr = new Date().toISOString().split('T')[0];

    // Restore stock
    setBooks((prev) =>
      prev.map((b) =>
        b.id === targetRecord.bookId ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) } : b
      )
    );

    // Update record
    setBorrowRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              returnDate: todayStr,
              status: 'RETURNED'
            }
          : r
      )
    );

    showToast(`Successfully returned "${targetRecord.bookTitle}". MySQL stock updated.`, 'success');
  };

  // Renew Loan Handler
  const handleRenewLoan = (recordId: number) => {
    setBorrowRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          const currentDue = new Date(r.dueDate);
          currentDue.setDate(currentDue.getDate() + 7);
          const newDueDateStr = currentDue.toISOString().split('T')[0];
          return {
            ...r,
            dueDate: newDueDateStr,
            renewedCount: r.renewedCount + 1
          };
        }
        return r;
      })
    );

    showToast('Loan renewed for 7 additional days.', 'info');
  };

  // Librarian Book Inventory Actions
  const handleAddBook = (newBookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...newBookData,
      id: Date.now()
    };
    setBooks((prev) => [newBook, ...prev]);
    showToast(`Registered "${newBook.title}" into MySQL books table.`, 'success');
  };

  const handleDeleteBook = (bookId: number) => {
    const b = books.find((x) => x.id === bookId);
    setBooks((prev) => prev.filter((x) => x.id !== bookId));
    showToast(`Removed "${b?.title || 'Book'}" from catalog.`, 'info');
  };

  const handleUpdateCopies = (bookId: number, delta: number) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const newTotal = Math.max(1, b.totalCopies + delta);
          const newAvailable = Math.max(0, Math.min(newTotal, b.availableCopies + delta));
          return { ...b, totalCopies: newTotal, availableCopies: newAvailable };
        }
        return b;
      })
    );
  };

  // Quick switch role between Reader and Librarian
  const handleSwitchRole = () => {
    if (currentUser?.role === 'LIBRARIAN') {
      const reader = users.find((u) => u.role === 'READER') || users[1];
      setCurrentUser(reader);
      showToast(`Switched account to Reader (${reader.fullName})`, 'info');
    } else {
      const librarian = users.find((u) => u.role === 'LIBRARIAN') || users[0];
      setCurrentUser(librarian);
      showToast(`Switched account to Librarian (${librarian.fullName})`, 'info');
    }
  };

  const activeLoansCount = currentUser
    ? borrowRecords.filter((r) => r.userId === currentUser.id && (r.status === 'BORROWED' || r.status === 'OVERDUE')).length
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border text-xs max-w-md ${
            toast.type === 'success'
              ? 'bg-slate-900 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40'
              : toast.type === 'error'
              ? 'bg-slate-900 border-red-500/40 text-red-200 shadow-red-950/40'
              : 'bg-slate-900 border-amber-500/40 text-amber-200 shadow-amber-950/40'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out of library account.', 'info');
        }}
        onSwitchRole={handleSwitchRole}
        activeLoansCount={activeLoansCount}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'catalog' && (
          <BookCatalog
            books={books}
            categories={categories}
            currentUser={currentUser}
            onInitiateBorrow={(b) => setSelectedBookForBorrow(b)}
            onOpenDetails={(b) => setSelectedBookForDetails(b)}
          />
        )}

        {activeTab === 'my-loans' && (
          <UserLoans
            currentUser={currentUser}
            records={borrowRecords}
            onReturnBook={handleReturnBook}
            onRenewLoan={handleRenewLoan}
            onGoToCatalog={() => setActiveTab('catalog')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'admin' && currentUser?.role === 'LIBRARIAN' && (
          <AdminPanel
            books={books}
            categories={categories}
            borrowRecords={borrowRecords}
            users={users}
            onAddBook={handleAddBook}
            onDeleteBook={handleDeleteBook}
            onUpdateCopies={handleUpdateCopies}
            onForceReturn={handleReturnBook}
          />
        )}

        {activeTab === 'mysql' && (
          <MysqlWorkbench
            books={books}
            users={users}
            borrowRecords={borrowRecords}
            categories={categories}
          />
        )}

        {activeTab === 'java-war' && (
          <JavaWarGenerator
            books={books}
            users={users}
            borrowRecords={borrowRecords}
            categories={categories}
          />
        )}
      </main>

      {/* Borrow Checkout Modal */}
      <BorrowModal
        book={selectedBookForBorrow}
        currentUser={currentUser}
        isOpen={Boolean(selectedBookForBorrow)}
        onClose={() => setSelectedBookForBorrow(null)}
        onConfirmBorrow={handleConfirmBorrow}
        onRequireAuth={() => {
          setSelectedBookForBorrow(null);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Book Details Modal */}
      <BookDetailsModal
        book={selectedBookForDetails}
        isOpen={Boolean(selectedBookForDetails)}
        onClose={() => setSelectedBookForDetails(null)}
        onBorrow={(b) => setSelectedBookForBorrow(b)}
      />

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        existingUsers={users}
        onLogin={(u) => {
          setCurrentUser(u);
          showToast(`Welcome back, ${u.fullName}!`, 'success');
        }}
        onRegister={(u) => {
          setUsers((prev) => [u, ...prev]);
          showToast(`Account created for ${u.fullName} (Card: ${u.membershipId})!`, 'success');
        }}
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 font-mono text-[11px]">
            <span>Athenaeum Library Management System</span>
            <span>•</span>
            <span className="text-amber-400">Java Spring Boot 3 + MySQL 8.0</span>
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setActiveTab('java-war')} className="hover:text-orange-400 text-orange-400/80">
              Download .WAR Package
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('mysql')} className="hover:text-cyan-400 text-cyan-400/80">
              MySQL schema.sql
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
