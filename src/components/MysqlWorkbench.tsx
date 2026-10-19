import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Play, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  Key, 
  Terminal, 
  Code2, 
  CheckCircle2, 
  AlertCircle,
  FileDown
} from 'lucide-react';
import { Book, User, BorrowRecord, Category, SqlQueryRecord } from '../types';
import { executeSqlSimulation } from '../utils/sqlEngine';
import { generateDynamicSqlDump } from '../utils/warPackager';

interface MysqlWorkbenchProps {
  books: Book[];
  users: User[];
  borrowRecords: BorrowRecord[];
  categories: Category[];
}

export const MysqlWorkbench: React.FC<MysqlWorkbenchProps> = ({
  books,
  users,
  borrowRecords,
  categories
}) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'query' | 'schema' | 'erd'>('erd');
  const [selectedTable, setSelectedTable] = useState<'books' | 'users' | 'borrow_records' | 'categories'>('books');
  const [queryInput, setQueryInput] = useState<string>(
    'SELECT u.full_name, b.title, r.borrow_date, r.due_date, r.status\nFROM borrow_records r\nJOIN users u ON r.user_id = u.id\nJOIN books b ON r.book_id = b.id;'
  );
  const [lastQueryResult, setLastQueryResult] = useState<SqlQueryRecord | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const fullSqlDump = generateDynamicSqlDump(books, users, borrowRecords, categories);

  const handleRunQuery = () => {
    const res = executeSqlSimulation(queryInput, {
      books,
      users,
      borrowRecords,
      categories
    });
    setLastQueryResult(res);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(fullSqlDump);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([fullSqlDump], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'library_db_mysql_dump.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const PRESET_QUERIES = [
    {
      title: 'Active Loans with Member & Book Info (JOIN)',
      sql: 'SELECT u.full_name, b.title, r.borrow_date, r.due_date, r.status\nFROM borrow_records r\nJOIN users u ON r.user_id = u.id\nJOIN books b ON r.book_id = b.id;'
    },
    {
      title: 'Available Books for Checkout',
      sql: 'SELECT * FROM books WHERE available_copies > 0;'
    },
    {
      title: 'All Registered Members & Roles',
      sql: 'SELECT * FROM users;'
    },
    {
      title: 'Raw Borrow Transaction Records',
      sql: 'SELECT * FROM borrow_records;'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              MYSQL 8.0 INNODB ENGINE • LIVE DATABASE
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            <span>MySQL Workbench &amp; Schema Inspector</span>
          </h1>
          <p className="text-xs text-slate-400">
            Inspect relational tables, test SQL queries, and export full MySQL DDL schema
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySql}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
          >
            {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
          </button>

          <button
            onClick={handleDownloadSql}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export schema.sql</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('erd')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'erd'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Relational Schema (ERD)</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'tables'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Live Data Tables</span>
        </button>

        <button
          onClick={() => setActiveTab('query')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'query'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>SQL Query Runner</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'schema'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>DDL Script (schema.sql)</span>
        </button>
      </div>

      {/* View: ERD Schema Diagram */}
      {activeTab === 'erd' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>Database: <strong className="text-cyan-300 font-mono">library_db</strong> (InnoDB, UTF8mb4)</span>
            <span className="text-slate-500 font-mono text-[11px]">4 Normalized Tables • Foreign Key Constraints</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Table: users */}
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 overflow-hidden shadow-lg">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-300">
                  <Table className="w-3.5 h-3.5" />
                  <span>users</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{users.length} rows</span>
              </div>
              <div className="p-3 divide-y divide-slate-800/60 font-mono text-[11px]">
                <div className="py-1 flex items-center justify-between text-amber-400">
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3 text-amber-400" /> id
                  </span>
                  <span className="text-slate-500">BIGINT (PK)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>email</span>
                  <span className="text-slate-500">VARCHAR(191) UQ</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>password_hash</span>
                  <span className="text-slate-500">VARCHAR(255)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>full_name</span>
                  <span className="text-slate-500">VARCHAR(150)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>membership_id</span>
                  <span className="text-slate-500">VARCHAR(50) UQ</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>role</span>
                  <span className="text-slate-500">ENUM</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>created_at</span>
                  <span className="text-slate-500">TIMESTAMP</span>
                </div>
              </div>
            </div>

            {/* Table: categories */}
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 overflow-hidden shadow-lg">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-300">
                  <Table className="w-3.5 h-3.5" />
                  <span>categories</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{categories.length} rows</span>
              </div>
              <div className="p-3 divide-y divide-slate-800/60 font-mono text-[11px]">
                <div className="py-1 flex items-center justify-between text-amber-400">
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3 text-amber-400" /> id
                  </span>
                  <span className="text-slate-500">BIGINT (PK)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>name</span>
                  <span className="text-slate-500">VARCHAR(100) UQ</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>code</span>
                  <span className="text-slate-500">VARCHAR(20) UQ</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>description</span>
                  <span className="text-slate-500">TEXT</span>
                </div>
              </div>
            </div>

            {/* Table: books */}
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 overflow-hidden shadow-lg">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-300">
                  <Table className="w-3.5 h-3.5" />
                  <span>books</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{books.length} rows</span>
              </div>
              <div className="p-3 divide-y divide-slate-800/60 font-mono text-[11px]">
                <div className="py-1 flex items-center justify-between text-amber-400">
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3 text-amber-400" /> id
                  </span>
                  <span className="text-slate-500">BIGINT (PK)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>isbn</span>
                  <span className="text-slate-500">VARCHAR(20) UQ</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>title</span>
                  <span className="text-slate-500">VARCHAR(255)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>author</span>
                  <span className="text-slate-500">VARCHAR(150)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-purple-400">
                  <span>category_id</span>
                  <span className="text-purple-400/80">BIGINT (FK)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-emerald-400">
                  <span>available_copies</span>
                  <span className="text-slate-500">INT</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>total_copies</span>
                  <span className="text-slate-500">INT</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>shelf_location</span>
                  <span className="text-slate-500">VARCHAR(50)</span>
                </div>
              </div>
            </div>

            {/* Table: borrow_records */}
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 overflow-hidden shadow-lg">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-300">
                  <Table className="w-3.5 h-3.5" />
                  <span>borrow_records</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{borrowRecords.length} rows</span>
              </div>
              <div className="p-3 divide-y divide-slate-800/60 font-mono text-[11px]">
                <div className="py-1 flex items-center justify-between text-amber-400">
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3 text-amber-400" /> id
                  </span>
                  <span className="text-slate-500">BIGINT (PK)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-purple-400">
                  <span>user_id</span>
                  <span className="text-purple-400/80">BIGINT (FK)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-purple-400">
                  <span>book_id</span>
                  <span className="text-purple-400/80">BIGINT (FK)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>borrow_date</span>
                  <span className="text-slate-500">DATE</span>
                </div>
                <div className="py-1 flex items-center justify-between text-amber-300">
                  <span>due_date</span>
                  <span className="text-slate-500">DATE</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>return_date</span>
                  <span className="text-slate-500">DATE NULL</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>status</span>
                  <span className="text-slate-500">ENUM</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-200">
                  <span>fine_amount</span>
                  <span className="text-slate-500">DECIMAL(8,2)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View: Live Data Tables */}
      {activeTab === 'tables' && (
        <div className="space-y-4">
          {/* Table Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['books', 'borrow_records', 'users', 'categories'] as const).map((tbl) => (
              <button
                key={tbl}
                onClick={() => setSelectedTable(tbl)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 ${
                  selectedTable === tbl
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>{tbl}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-lg">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">TABLE: <strong>{selectedTable}</strong></span>
              <span>Updated in real-time with app interactions</span>
            </div>

            <div className="overflow-x-auto">
              {selectedTable === 'books' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">id</th>
                      <th className="p-3">isbn</th>
                      <th className="p-3">title</th>
                      <th className="p-3">author</th>
                      <th className="p-3">category_id</th>
                      <th className="p-3">available_copies</th>
                      <th className="p-3">total_copies</th>
                      <th className="p-3">shelf_location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px] text-slate-300">
                    {books.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/30">
                        <td className="p-3 text-amber-400">{b.id}</td>
                        <td className="p-3 text-slate-400">{b.isbn}</td>
                        <td className="p-3 font-sans font-semibold text-slate-100">{b.title}</td>
                        <td className="p-3 font-sans text-slate-300">{b.author}</td>
                        <td className="p-3 text-purple-400">{b.categoryId}</td>
                        <td className="p-3 font-bold text-emerald-400">{b.availableCopies}</td>
                        <td className="p-3">{b.totalCopies}</td>
                        <td className="p-3 text-amber-300">{b.shelfLocation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'borrow_records' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">id</th>
                      <th className="p-3">user_id</th>
                      <th className="p-3">book_id</th>
                      <th className="p-3">borrow_date</th>
                      <th className="p-3">due_date</th>
                      <th className="p-3">return_date</th>
                      <th className="p-3">status</th>
                      <th className="p-3">fine_amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px] text-slate-300">
                    {borrowRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/30">
                        <td className="p-3 text-amber-400">{r.id}</td>
                        <td className="p-3 text-purple-400">{r.userId} ({r.userName})</td>
                        <td className="p-3 text-purple-400">{r.bookId} ({r.bookTitle})</td>
                        <td className="p-3">{r.borrowDate}</td>
                        <td className="p-3 text-amber-300">{r.dueDate}</td>
                        <td className="p-3 text-slate-400">{r.returnDate || 'NULL'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            r.status === 'OVERDUE'
                              ? 'bg-red-500/20 text-red-300'
                              : r.status === 'BORROWED'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3">${r.fineAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'users' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">id</th>
                      <th className="p-3">email</th>
                      <th className="p-3">full_name</th>
                      <th className="p-3">membership_id</th>
                      <th className="p-3">role</th>
                      <th className="p-3">created_at</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px] text-slate-300">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30">
                        <td className="p-3 text-amber-400">{u.id}</td>
                        <td className="p-3 text-slate-300">{u.email}</td>
                        <td className="p-3 font-sans font-semibold text-slate-100">{u.fullName}</td>
                        <td className="p-3 text-cyan-300">{u.membershipId}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{u.joinedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'categories' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">id</th>
                      <th className="p-3">code</th>
                      <th className="p-3">name</th>
                      <th className="p-3">description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px] text-slate-300">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/30">
                        <td className="p-3 text-amber-400">{c.id}</td>
                        <td className="p-3 text-cyan-300">{c.code}</td>
                        <td className="p-3 font-sans font-semibold text-slate-100">{c.name}</td>
                        <td className="p-3 font-sans text-slate-400">{c.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View: SQL Query Console */}
      {activeTab === 'query' && (
        <div className="space-y-4">
          {/* Preset queries */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Preset Query
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_QUERIES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQueryInput(item.sql);
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-colors"
                >
                  <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                  <p className="text-[10px] font-mono text-cyan-400/80 truncate mt-0.5">
                    {item.sql.split('\n')[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* SQL Editor Area */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
            <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" /> SQL Query Console
              </span>
              <button
                onClick={handleRunQuery}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute SQL</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="w-full bg-slate-950 p-4 font-mono text-xs text-cyan-300 focus:outline-none resize-none leading-relaxed"
              placeholder="SELECT * FROM books WHERE available_copies > 0;"
            />
          </div>

          {/* Query Results */}
          {lastQueryResult && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-slate-200">
                    Query OK, {lastQueryResult.rowsAffected || 0} rows retrieved ({lastQueryResult.executedAt})
                  </span>
                </div>
              </div>

              {lastQueryResult.resultColumns && lastQueryResult.resultRows && (
                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800 sticky top-0">
                      <tr>
                        {lastQueryResult.resultColumns.map((col) => (
                          <th key={col} className="p-2.5">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
                      {lastQueryResult.resultRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          {lastQueryResult.resultColumns!.map((col) => (
                            <td key={col} className="p-2.5">
                              {String(row[col] ?? 'NULL')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* View: Raw DDL Script */}
      {activeTab === 'schema' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
          <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300">schema.sql (MySQL 8.0+ Compatible)</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 text-slate-400 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
          </div>
          <pre className="p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[480px] overflow-y-auto leading-relaxed">
            {fullSqlDump}
          </pre>
        </div>
      )}
    </div>
  );
};
