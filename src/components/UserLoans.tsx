import React from 'react';
import { 
  BookmarkCheck, 
  RotateCcw, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  History, 
  CreditCard,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { BorrowRecord, User } from '../types';

interface UserLoansProps {
  currentUser: User | null;
  records: BorrowRecord[];
  onReturnBook: (recordId: number) => void;
  onRenewLoan: (recordId: number) => void;
  onGoToCatalog: () => void;
  onOpenAuth: () => void;
}

export const UserLoans: React.FC<UserLoansProps> = ({
  currentUser,
  records,
  onReturnBook,
  onRenewLoan,
  onGoToCatalog,
  onOpenAuth
}) => {
  if (!currentUser) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 max-w-lg mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <BookmarkCheck className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-100">
          Sign In to Access Your Loans
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Please log in with your reader card to view your active borrowed books, renew loan periods, check return due dates, and track fine balances.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Filter records for current user
  const userRecords = records.filter((r) => r.userId === currentUser.id);
  const activeLoans = userRecords.filter((r) => r.status === 'BORROWED' || r.status === 'OVERDUE');
  const pastLoans = userRecords.filter((r) => r.status === 'RETURNED');

  const overdueLoans = activeLoans.filter((r) => {
    const due = new Date(r.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  });

  const totalFines = userRecords.reduce((acc, r) => acc + (r.fineAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Cardholder Record: {currentUser.membershipId}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Joined {currentUser.joinedAt}
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-100">
            {currentUser.fullName}’s Circulation Desk
          </h1>
          <p className="text-xs text-slate-400">
            Real-time loans stored in MySQL table <code className="text-amber-300 font-mono text-[11px]">borrow_records</code>
          </p>
        </div>

        <button
          onClick={onGoToCatalog}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
        >
          <BookOpen className="w-4 h-4" />
          <span>Borrow Another Book</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Active Borrowings</span>
            <BookmarkCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-serif text-slate-100 mt-2">
            {activeLoans.length}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Maximum allowed: 5</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Overdue Notice</span>
            <AlertTriangle className={`w-4 h-4 ${overdueLoans.length > 0 ? 'text-red-400' : 'text-slate-500'}`} />
          </div>
          <p className={`text-2xl font-bold font-serif mt-2 ${
            overdueLoans.length > 0 ? 'text-red-400' : 'text-slate-100'
          }`}>
            {overdueLoans.length}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {overdueLoans.length > 0 ? 'Immediate return requested' : 'All loans in good standing'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Fines Accrued</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-serif text-slate-100 mt-2">
            ${totalFines.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Rate: $0.50/day late</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Lifetime Returned</span>
            <History className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-serif text-slate-100 mt-2">
            {pastLoans.length}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Archived borrow history</p>
        </div>
      </div>

      {/* Active Borrowed Books List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Currently Borrowed Books ({activeLoans.length})</span>
          </h2>
        </div>

        {activeLoans.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-serif text-base font-semibold text-slate-200">
              No active borrowings
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You do not have any books currently checked out. Browse the catalog to borrow from our collection!
            </p>
            <button
              onClick={onGoToCatalog}
              className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLoans.map((record) => {
              const due = new Date(record.dueDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const diffTime = due.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isOverdue = diffDays < 0;

              return (
                <div
                  key={record.id}
                  className={`p-4 rounded-2xl bg-slate-900/90 border transition-all flex flex-col justify-between ${
                    isOverdue
                      ? 'border-red-500/40 shadow-lg shadow-red-500/5'
                      : diffDays <= 2
                      ? 'border-amber-500/40'
                      : 'border-slate-800'
                  }`}
                >
                  <div>
                    {/* Top Status */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                        isOverdue
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : diffDays <= 3
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isOverdue ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            <span>OVERDUE BY {Math.abs(diffDays)} DAYS</span>
                          </>
                        ) : diffDays === 0 ? (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>DUE TODAY</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>{diffDays} DAYS REMAINING</span>
                          </>
                        )}
                      </span>

                      <span className="text-[10px] text-slate-500 font-mono">
                        Record #{record.id}
                      </span>
                    </div>

                    {/* Book Information */}
                    <div className="flex gap-3.5">
                      <img
                        src={record.bookCover}
                        alt={record.bookTitle}
                        className="w-16 h-24 object-cover rounded-lg border border-slate-800 shadow flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-slate-100 text-sm leading-snug line-clamp-1">
                          {record.bookTitle}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">{record.bookAuthor}</p>

                        <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>Borrowed: <strong className="text-slate-300">{record.borrowDate}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Due Date: <strong className={isOverdue ? 'text-red-400' : 'text-amber-300'}>{record.dueDate}</strong></span>
                          </div>
                          {record.notes && (
                            <p className="text-[10px] text-slate-400 italic truncate">
                              Ref: {record.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Overdue Fine Notice */}
                    {record.fineAmount > 0 && (
                      <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center justify-between">
                        <span>Accrued Fine Fee:</span>
                        <strong className="font-mono text-sm">${record.fineAmount.toFixed(2)}</strong>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onRenewLoan(record.id)}
                      title="Extend due date by 7 days"
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Renew (+7d)</span>
                    </button>

                    <button
                      onClick={() => onReturnBook(record.id)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Return Book</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Borrow History Table */}
      {pastLoans.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <h3 className="font-serif text-base font-bold text-slate-200 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Borrowing History &amp; Returned Archives</span>
          </h3>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Book Title</th>
                  <th className="p-3">Borrowed On</th>
                  <th className="p-3">Returned On</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Fine Settled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {pastLoans.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-medium text-slate-100 flex items-center gap-2">
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{rec.bookTitle}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{rec.borrowDate}</td>
                    <td className="p-3 font-mono text-slate-400">{rec.returnDate || 'Returned'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        RETURNED
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono">
                      {rec.fineAmount > 0 ? `$${rec.fineAmount.toFixed(2)}` : '$0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
