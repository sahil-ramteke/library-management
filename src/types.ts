export type UserRole = 'READER' | 'LIBRARIAN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  membershipId: string;
  role: UserRole;
  phone?: string;
  joinedAt: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  categoryId: number;
  categoryName: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  description: string;
  coverUrl: string;
  publishedYear: number;
  rating?: number;
}

export type BorrowStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE';

export interface BorrowRecord {
  id: number;
  userId: number;
  userName: string;
  membershipId: string;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  borrowDate: string; // YYYY-MM-DD
  dueDate: string;    // YYYY-MM-DD
  returnDate: string | null;
  status: BorrowStatus;
  fineAmount: number;
  renewedCount: number;
  notes?: string;
}

export interface SqlQueryRecord {
  id: string;
  query: string;
  executedAt: string;
  status: 'SUCCESS' | 'ERROR';
  rowsAffected?: number;
  resultColumns?: string[];
  resultRows?: Record<string, any>[];
  errorMessage?: string;
}

export interface JavaSourceFile {
  path: string;
  name: string;
  category: 'config' | 'entity' | 'repository' | 'service' | 'controller' | 'sql' | 'webapp' | 'docs' | 'frontend_jsp';
  language: 'java' | 'xml' | 'properties' | 'sql' | 'markdown' | 'jsp' | 'html' | 'css';
  content: string;
  description: string;
}
