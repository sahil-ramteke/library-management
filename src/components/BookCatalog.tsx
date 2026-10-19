import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BookMarked, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Info,
  Calendar,
  Star,
  ChevronRight,
  Database
} from 'lucide-react';
import { Book, Category, User } from '../types';

interface BookCatalogProps {
  books: Book[];
  categories: Category[];
  currentUser: User | null;
  onInitiateBorrow: (book: Book) => void;
  onOpenDetails: (book: Book) => void;
}

export const BookCatalog: React.FC<BookCatalogProps> = ({
  books,
  categories,
  currentUser,
  onInitiateBorrow,
  onOpenDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'title' | 'available' | 'year' | 'rating'>('rating');

  const filteredBooks = useMemo(() => {
    return books
      .filter((b) => {
        const matchesSearch =
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.isbn.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategoryId === null || b.categoryId === selectedCategoryId;

        const matchesStock = !inStockOnly || b.availableCopies > 0;

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'available') return b.availableCopies - a.availableCopies;
        if (sortBy === 'year') return b.publishedYear - a.publishedYear;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [books, searchQuery, selectedCategoryId, inStockOnly, sortBy]);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 md:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <Database className="w-3.5 h-3.5" />
            <span>MySQL 8.0 Relational Catalog • Java JPA Backend</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
            Library Catalog &amp; Circulation Desk
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Browse our curated collection of computer science, engineering, literature, and philosophy texts. 
            Real-time inventory levels sync directly with the <code className="text-amber-300 font-mono text-xs">books</code> and <code className="text-amber-300 font-mono text-xs">borrow_records</code> MySQL tables.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/5 to-transparent pointer-events-none" />
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or ISBN (e.g. 'Java', 'Martin')..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[11px] text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/30"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="hidden md:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500/60"
              >
                <option value="rating">Top Rated</option>
                <option value="title">Title (A-Z)</option>
                <option value="available">Available Copies</option>
                <option value="year">Year Published</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategoryId === null
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            All Categories ({books.length})
          </button>

          {categories.map((cat) => {
            const count = books.filter((b) => b.categoryId === cat.id).length;
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-slate-950/20 text-slate-900 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/60 mx-auto flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">No books found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoryId(null);
              setInStockOnly(false);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;
            const stockPct = Math.round((book.availableCopies / book.totalCopies) * 100);

            return (
              <div
                key={book.id}
                className="group flex flex-col justify-between rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/40 transition-all duration-200 overflow-hidden shadow-lg hover:shadow-amber-500/5 hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Cover & Quick Badges */}
                  <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/20 shadow">
                        {book.categoryName}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-semibold border border-slate-800">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{book.rating || 4.8}</span>
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-slate-300 font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {book.shelfLocation}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        Published {book.publishedYear}
                      </span>
                    </div>
                  </div>

                  {/* Book Metadata */}
                  <div className="p-4 space-y-2">
                    <h3 
                      onClick={() => onOpenDetails(book)}
                      className="font-serif font-bold text-slate-100 text-base leading-snug hover:text-amber-400 cursor-pointer transition-colors line-clamp-1"
                    >
                      {book.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-1">
                      By <span className="text-slate-300 font-medium">{book.author}</span>
                    </p>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                      {book.description}
                    </p>

                    {/* Stock Bar */}
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Inventory Available</span>
                        <span className={`font-mono font-semibold ${
                          isAvailable ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {book.availableCopies} of {book.totalCopies} copies
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all rounded-full ${
                            isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${stockPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 border-t border-slate-800/60 mt-3 flex items-center gap-2">
                  <button
                    onClick={() => onOpenDetails(book)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors flex items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <button
                    disabled={!isAvailable}
                    onClick={() => onInitiateBorrow(book)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      isAvailable
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>{isAvailable ? 'Borrow Book' : 'Waitlist'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
