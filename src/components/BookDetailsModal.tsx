import React from 'react';
import { X, MapPin, BookmarkCheck, Calendar, Hash, Layers, Star } from 'lucide-react';
import { Book } from '../types';

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onBorrow: (book: Book) => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  isOpen,
  onClose,
  onBorrow
}) => {
  if (!isOpen || !book) return null;

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Cover Image */}
        <div className="md:w-5/12 bg-slate-950 relative min-h-[220px] md:min-h-[380px] overflow-hidden">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:hidden" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between md:hidden">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-amber-400 border border-amber-500/20">
              {book.categoryName}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-emerald-400 border border-slate-800">
              {book.availableCopies} available
            </span>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:w-7/12 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {book.categoryName}
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-serif text-xl font-bold text-slate-100 mt-2 leading-snug">
              {book.title}
            </h3>
            <p className="text-sm text-slate-300 font-medium">By {book.author}</p>

            <div className="flex items-center gap-1.5 my-3 text-amber-400 text-xs">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-slate-200 ml-1">{book.rating || 4.8} / 5.0</span>
              <span className="text-slate-500">• Recommended by Faculty</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto pr-1">
              {book.description}
            </p>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-slate-400" /> ISBN Identifier
                </span>
                <p className="font-mono text-[11px] text-slate-200 font-semibold mt-0.5">
                  {book.isbn}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> Physical Stack
                </span>
                <p className="font-mono text-[11px] text-amber-300 font-semibold mt-0.5">
                  {book.shelfLocation}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Published Year
                </span>
                <p className="font-mono text-[11px] text-slate-200 font-semibold mt-0.5">
                  {book.publishedYear}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-400" /> Inventory Ratio
                </span>
                <p className={`font-mono text-[11px] font-semibold mt-0.5 ${
                  isAvailable ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {book.availableCopies} of {book.totalCopies} available
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-3">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800"
            >
              Close
            </button>
            <button
              disabled={!isAvailable}
              onClick={() => {
                onClose();
                onBorrow(book);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                isAvailable
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{isAvailable ? 'Borrow This Edition' : 'Currently Unavailable'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
