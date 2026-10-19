import { Book, Category, BorrowRecord, User } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Computer Science & Software', code: 'CS', description: 'Algorithms, system design, Java programming, databases' },
  { id: 2, name: 'Classic Literature & Fiction', code: 'LIT', description: 'Timeless masterpieces, novels, and award-winning fiction' },
  { id: 3, name: 'Data Engineering & AI', code: 'AI', description: 'Machine learning, relational databases, distributed systems' },
  { id: 4, name: 'Philosophy & Psychology', code: 'PHIL', description: 'Critical thinking, ethics, cognitive science, and human behavior' },
  { id: 5, name: 'Science & Astrophysics', code: 'SCI', description: 'Physics, astronomy, biology, and history of science' }
];

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    email: 'admin@athenaeum.edu',
    fullName: 'Elena Vance (Chief Librarian)',
    membershipId: 'LIB-2024-001',
    role: 'LIBRARIAN',
    phone: '+1 (555) 234-5678',
    joinedAt: '2024-01-15'
  },
  {
    id: 2,
    email: 'jane.doe@campus.edu',
    fullName: 'Jane Doe',
    membershipId: 'STU-2024-884',
    role: 'READER',
    phone: '+1 (555) 987-6543',
    joinedAt: '2024-03-10'
  },
  {
    id: 3,
    email: 'marcus.chen@campus.edu',
    fullName: 'Marcus Chen',
    membershipId: 'STU-2024-912',
    role: 'READER',
    phone: '+1 (555) 456-7890',
    joinedAt: '2024-04-02'
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    isbn: '978-0134685991',
    title: 'Effective Java (3rd Edition)',
    author: 'Joshua Bloch',
    categoryId: 1,
    categoryName: 'Computer Science & Software',
    totalCopies: 5,
    availableCopies: 3,
    shelfLocation: 'Stack A-12',
    description: 'The definitive guide to best practices in Java programming, covering generics, lambdas, streams, concurrency, and serialization.',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2018,
    rating: 4.9
  },
  {
    id: 2,
    isbn: '978-0132350884',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    categoryId: 1,
    categoryName: 'Computer Science & Software',
    totalCopies: 6,
    availableCopies: 4,
    shelfLocation: 'Stack A-14',
    description: 'Even bad code can function. But if code is not clean, it can bring a development organization to its knees. Master meaningful naming, small functions, and unit tests.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2008,
    rating: 4.8
  },
  {
    id: 3,
    isbn: '978-0596009205',
    title: 'Head First Design Patterns',
    author: 'Eric Freeman & Elisabeth Robson',
    categoryId: 1,
    categoryName: 'Computer Science & Software',
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'Stack A-18',
    description: 'A brain-friendly guide to design patterns in Object-Oriented software design, from Singleton and Observer to Decorator and Factory.',
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2020,
    rating: 4.7
  },
  {
    id: 4,
    isbn: '978-1449373320',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    categoryId: 3,
    categoryName: 'Data Engineering & AI',
    totalCopies: 5,
    availableCopies: 1,
    shelfLocation: 'Stack B-04',
    description: 'The big ideas behind reliable, scalable, and maintainable data systems, replication, partitioning, transactions, and stream processing.',
    coverUrl: 'https://images.unsplash.com/photo-1507842229451-7f01be44c067?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2017,
    rating: 5.0
  },
  {
    id: 5,
    isbn: '978-0201633610',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    categoryId: 1,
    categoryName: 'Computer Science & Software',
    totalCopies: 3,
    availableCopies: 2,
    shelfLocation: 'Stack A-20',
    description: 'The classic "Gang of Four" guide cataloging 23 fundamental software engineering design patterns.',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
    publishedYear: 1994,
    rating: 4.8
  },
  {
    id: 6,
    isbn: '978-0141439518',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    categoryId: 2,
    categoryName: 'Classic Literature & Fiction',
    totalCopies: 4,
    availableCopies: 3,
    shelfLocation: 'Stack C-02',
    description: 'A romantic masterpiece centering on Elizabeth Bennet as she learns the repercussions of hasty judgments and comes to appreciate the distinction between superficial goodness and actual goodness.',
    coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600',
    publishedYear: 1813,
    rating: 4.9
  },
  {
    id: 7,
    isbn: '978-0451524935',
    title: '1984',
    author: 'George Orwell',
    categoryId: 2,
    categoryName: 'Classic Literature & Fiction',
    totalCopies: 7,
    availableCopies: 5,
    shelfLocation: 'Stack C-15',
    description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism, mass surveillance, and repressive regimentation of persons and behaviors within society.',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    publishedYear: 1949,
    rating: 4.8
  },
  {
    id: 8,
    isbn: '978-0140449136',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    categoryId: 4,
    categoryName: 'Philosophy & Psychology',
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'Stack D-08',
    description: 'Personal reflections and private notes on Stoic philosophy, duty, inner peace, resilience, and ethical leadership penned by the Roman Emperor.',
    coverUrl: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&q=80&w=600',
    publishedYear: 180,
    rating: 4.9
  },
  {
    id: 9,
    isbn: '978-0393609394',
    title: 'Astrophysics for People in a Hurry',
    author: 'Neil deGrasse Tyson',
    categoryId: 5,
    categoryName: 'Science & Astrophysics',
    totalCopies: 5,
    availableCopies: 4,
    shelfLocation: 'Stack E-03',
    description: 'An essential guide to the cosmos, quantum mechanics, the big bang, black holes, and the fundamental laws of nature in witty, digestible chapters.',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2017,
    rating: 4.7
  }
];

export const INITIAL_BORROW_RECORDS: BorrowRecord[] = [
  {
    id: 1,
    userId: 2,
    userName: 'Jane Doe',
    membershipId: 'STU-2024-884',
    bookId: 1,
    bookTitle: 'Effective Java (3rd Edition)',
    bookAuthor: 'Joshua Bloch',
    bookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    borrowDate: '2026-10-05',
    dueDate: '2026-10-19',
    returnDate: null,
    status: 'BORROWED',
    fineAmount: 0,
    renewedCount: 0,
    notes: 'Checked out for Advanced Java Seminar'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Jane Doe',
    membershipId: 'STU-2024-884',
    bookId: 4,
    bookTitle: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    bookAuthor: 'Martin Kleppmann',
    bookCover: 'https://images.unsplash.com/photo-1507842229451-7f01be44c067?auto=format&fit=crop&q=80&w=600',
    borrowDate: '2026-09-28',
    dueDate: '2026-10-12',
    returnDate: null,
    status: 'OVERDUE',
    fineAmount: 3.50,
    renewedCount: 1,
    notes: 'Semester project research'
  } as any,
  {
    id: 3,
    userId: 3,
    userName: 'Marcus Chen',
    membershipId: 'STU-2024-912',
    bookId: 2,
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    bookAuthor: 'Robert C. Martin',
    bookCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    borrowDate: '2026-10-01',
    dueDate: '2026-10-15',
    returnDate: '2026-10-14',
    status: 'RETURNED',
    fineAmount: 0,
    renewedCount: 0,
    notes: 'Returned in pristine condition'
  },
  {
    id: 4,
    userId: 2,
    userName: 'Jane Doe',
    membershipId: 'STU-2024-884',
    bookId: 8,
    bookTitle: 'Meditations',
    bookAuthor: 'Marcus Aurelius',
    bookCover: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&q=80&w=600',
    borrowDate: '2026-09-10',
    dueDate: '2026-09-24',
    returnDate: '2026-09-23',
    status: 'RETURNED',
    fineAmount: 0,
    renewedCount: 0,
    notes: 'Returned on time'
  }
];
