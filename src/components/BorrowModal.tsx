import React, { useState } from 'react';
import { X, Calendar, BookCheck, ShieldAlert, CheckCircle2, Bookmark, Info } from 'lucide-react';
import { Book, User } from '../types';

interface BorrowModalProps {
  book: Book | null;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBorrow: (bookId: number, loanDays: number, notes: string) => void;
  onRequireAuth: () => void;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  book,
  currentUser,
  isOpen,
  onClose,
  onConfirmBorrow,
  onRequireAuth
}) => {
  const [loanDays, setLoanDays] = useState<number>(14);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen || !book) return null;

  const today = new Date();
  const calculatedDueDate = new Date();
  calculatedDueDate.setDate(today.getDate() + loanDays);
  const dueDateStr = calculatedDueDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleBorrow = () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    onConfirmBorrow(book.id, loanDays, notes);
    onClose();
  };

  const isOutOfStock = book.availableCopies <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-100 text-base">
                Confirm Library Loan
              </h3>
              <p className="text-[11px] text-slate-400">
                Transactional checkout registered in MySQL <code>borrow_records</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Book Summary Card */}
          <div className="flex gap-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-16 h-24 object-cover rounded-lg shadow-md border border-slate-800 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {book.categoryName}
              </span>
              <h4 className="font-serif font-bold text-slate-100 text-sm mt-1 truncate">
                {book.title}
              </h4>
              <p className="text-xs text-slate-400">{book.author}</p>
              
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                <span>Location: <strong className="text-slate-200">{book.shelfLocation}</strong></span>
                <span>•</span>
                <span>ISBN: <code className="text-slate-300 font-mono text-[10px]">{book.isbn}</code></span>
              </div>
            </div>
          </div>

          {/* Current Stock Notification */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            isOutOfStock 
              ? 'bg-red-500/10 border-red-500/30 text-red-300' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <ShieldAlert className="w-4 h-4 text-red-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span>
                {isOutOfStock 
                  ? 'All copies currently on loan' 
                  : `${book.availableCopies} of ${book.totalCopies} copies currently available on shelf`}
              </span>
            </div>
            <span className="font-mono text-[11px] font-semibold">
              {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
            </span>
          </div>

          {/* Loan Duration Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Loan Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { days: 7, label: '7 Days', badge: 'Short Loan' },
                { days: 14, label: '14 Days', badge: 'Standard' },
                { days: 28, label: '28 Days', badge: 'Extended' }
              ].map((item) => (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => setLoanDays(item.days)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    loanDays === item.days
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold">{item.label}</p>
                  <span className="text-[10px] opacity-75">{item.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Due Date & Return Policy Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                Scheduled Return Due Date:
              </span>
              <span className="font-semibold text-amber-300 font-mono">
                {dueDateStr}
              </span>
            </div>
            <div className="flex items-start gap-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>Overdue fee: $0.50/day assessed past due date. Maximum 5 simultaneous loans per card.</span>
            </div>
          </div>

          {/* Borrower details */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Borrower Cardholder
            </label>
            {currentUser ? (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{currentUser.fullName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Card ID: {currentUser.membershipId}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  Verified Member
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                <span>Please sign in with a library account to borrow.</span>
                <button
                  type="button"
                  onClick={onRequireAuth}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px]"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Loan Reference / Research Purpose (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Distributed Systems Final Thesis"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isOutOfStock || !currentUser}
              onClick={handleBorrow}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                isOutOfStock || !currentUser
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Confirm &amp; Checkout Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
