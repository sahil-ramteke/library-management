import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  BookPlus, 
  Trash2, 
  Edit3, 
  Users, 
  Layers, 
  RotateCcw, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  BookOpen,
  X
} from 'lucide-react';
import { Book, Category, BorrowRecord, User } from '../types';

interface AdminPanelProps {
  books: Book[];
  categories: Category[];
  borrowRecords: BorrowRecord[];
  users: User[];
  onAddBook: (newBook: Omit<Book, 'id'>) => void;
  onDeleteBook: (bookId: number) => void;
  onUpdateCopies: (bookId: number, delta: number) => void;
  onForceReturn: (recordId: number) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  books,
  categories,
  borrowRecords,
  users,
  onAddBook,
  onDeleteBook,
  onUpdateCopies,
  onForceReturn
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'inventory' | 'loans' | 'members'>('inventory');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [loanFilter, setLoanFilter] = useState<'ALL' | 'ACTIVE' | 'OVERDUE' | 'RETURNED'>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  // Form State for Add Book
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newCategoryId, setNewCategoryId] = useState(categories[0]?.id || 1);
  const [newTotalCopies, setNewTotalCopies] = useState(5);
  const [newShelfLocation, setNewShelfLocation] = useState('Stack A-01');
  const [newPublishedYear, setNewPublishedYear] = useState(2024);
  const [newDescription, setNewDescription] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600');

  const totalCopiesInSystem = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const availableCopiesInSystem = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const activeLoansCount = borrowRecords.filter((r) => r.status === 'BORROWED' || r.status === 'OVERDUE').length;
  const overdueCount = borrowRecords.filter((r) => r.status === 'OVERDUE').length;

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim() || !newIsbn.trim()) return;

    const category = categories.find((c) => c.id === Number(newCategoryId));

    onAddBook({
      title: newTitle.trim(),
      author: newAuthor.trim(),
      isbn: newIsbn.trim(),
      categoryId: Number(newCategoryId),
      categoryName: category?.name || 'General',
      totalCopies: Number(newTotalCopies),
      availableCopies: Number(newTotalCopies),
      shelfLocation: newShelfLocation.trim() || 'General Stack',
      publishedYear: Number(newPublishedYear),
      description: newDescription.trim() || 'No description provided.',
      coverUrl: newCoverUrl.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      rating: 4.8
    });

    setIsAddBookModalOpen(false);
    // Reset
    setNewTitle('');
    setNewAuthor('');
    setNewIsbn('');
  };

  const filteredLoans = borrowRecords.filter((r) => {
    if (loanFilter === 'ACTIVE') return r.status === 'BORROWED';
    if (loanFilter === 'OVERDUE') return r.status === 'OVERDUE';
    if (loanFilter === 'RETURNED') return r.status === 'RETURNED';
    return true;
  }).filter((r) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      r.bookTitle.toLowerCase().includes(q) ||
      r.userName.toLowerCase().includes(q) ||
      r.membershipId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              LIBRARIAN PRIVILEGES ACTIVE
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <span>Library Administration Console</span>
          </h1>
          <p className="text-xs text-slate-400">
            Direct inventory control and transactional loan management synced with MySQL database
          </p>
        </div>

        <button
          onClick={() => setIsAddBookModalOpen(true)}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all"
        >
          <BookPlus className="w-4 h-4" />
          <span>Add New Book to Catalog</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Catalog Titles</span>
          <p className="text-2xl font-bold font-serif text-slate-100 mt-2">
            {books.length}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Across {categories.length} categories</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Inventory Stock</span>
          <p className="text-2xl font-bold font-serif text-slate-100 mt-2">
            {availableCopiesInSystem} <span className="text-sm font-normal text-slate-400">/ {totalCopiesInSystem} copies</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Physical copies tracked</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Active Borrowings</span>
          <p className="text-2xl font-bold font-serif text-amber-400 mt-2">
            {activeLoansCount}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{overdueCount} overdue notice(s)</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Registered Members</span>
          <p className="text-2xl font-bold font-serif text-slate-100 mt-2">
            {users.length}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Active library cardholders</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveAdminTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeAdminTab === 'inventory'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Catalog Inventory ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('loans')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeAdminTab === 'loans'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>System-Wide Loan Registry ({borrowRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('members')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeAdminTab === 'members'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Members Directory ({users.length})</span>
        </button>
      </div>

      {/* Tab 1: Inventory Management */}
      {activeAdminTab === 'inventory' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-serif font-bold text-slate-200 text-sm">
              Books Database Inventory Control
            </h3>
            <span className="text-xs text-slate-400">
              Synced with MySQL table <code>books</code>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Book Info</th>
                  <th className="p-3">ISBN</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Shelf</th>
                  <th className="p-3 text-center">Stock Copies</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={b.coverUrl}
                          alt={b.title}
                          className="w-8 h-12 object-cover rounded shadow border border-slate-800 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-100">{b.title}</p>
                          <p className="text-[11px] text-slate-400">{b.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-400 text-[11px]">{b.isbn}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px]">
                        {b.categoryName}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-300">{b.shelfLocation}</td>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => onUpdateCopies(b.id, -1)}
                          disabled={b.availableCopies <= 0}
                          title="Reduce available copies"
                          className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-slate-200 px-1 text-[11px]">
                          {b.availableCopies} / {b.totalCopies}
                        </span>
                        <button
                          onClick={() => onUpdateCopies(b.id, 1)}
                          title="Add copy"
                          className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-xs flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteBook(b.id)}
                        title="Delete from Catalog"
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: System-Wide Loans */}
      {activeAdminTab === 'loans' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {(['ALL', 'ACTIVE', 'OVERDUE', 'RETURNED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLoanFilter(filter)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    loanFilter === filter
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search borrower or title..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Loan ID</th>
                  <th className="p-3">Borrower / Card</th>
                  <th className="p-3">Book Title</th>
                  <th className="p-3">Borrow Date</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredLoans.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-mono text-slate-500 text-[11px]">#{rec.id}</td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-100">{rec.userName}</p>
                      <p className="font-mono text-[10px] text-slate-400">{rec.membershipId}</p>
                    </td>
                    <td className="p-3 font-medium text-slate-200">{rec.bookTitle}</td>
                    <td className="p-3 font-mono text-slate-400">{rec.borrowDate}</td>
                    <td className="p-3 font-mono text-slate-400">{rec.dueDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        rec.status === 'OVERDUE'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : rec.status === 'BORROWED'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {rec.status !== 'RETURNED' && (
                        <button
                          onClick={() => onForceReturn(rec.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[11px] font-semibold transition-colors"
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Member Directory */}
      {activeAdminTab === 'members' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Member Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Card / Membership ID</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right">Active Borrows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {users.map((u) => {
                const userActiveBorrows = borrowRecords.filter(
                  (r) => r.userId === u.id && (r.status === 'BORROWED' || r.status === 'OVERDUE')
                ).length;

                return (
                  <tr key={u.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-slate-100">{u.fullName}</td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3 font-mono text-amber-300 text-[11px]">{u.membershipId}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        u.role === 'LIBRARIAN'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{u.joinedAt}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-200">
                      {userActiveBorrows} books
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add New Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <BookPlus className="w-5 h-5 text-purple-400" />
                <h3 className="font-serif font-bold text-slate-100 text-base">
                  Register New Book into MySQL Catalog
                </h3>
              </div>
              <button
                onClick={() => setIsAddBookModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBookSubmit} className="p-6 space-y-3.5 overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Modern Operating Systems"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Andrew S. Tanenbaum"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ISBN</label>
                  <input
                    type="text"
                    required
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    placeholder="978-0133591620"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500/60"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newTotalCopies}
                    onChange={(e) => setNewTotalCopies(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Shelf Location</label>
                  <input
                    type="text"
                    value={newShelfLocation}
                    onChange={(e) => setNewShelfLocation(e.target.value)}
                    placeholder="Stack CS-22"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Published Year</label>
                  <input
                    type="number"
                    value={newPublishedYear}
                    onChange={(e) => setNewPublishedYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={newCoverUrl}
                  onChange={(e) => setNewCoverUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Synopsis &amp; Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief summary of book contents..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-950 text-slate-400 text-xs font-semibold border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20"
                >
                  Save to MySQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
