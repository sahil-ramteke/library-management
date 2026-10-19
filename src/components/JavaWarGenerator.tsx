import React, { useState } from 'react';
import { 
  FileCode2, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Server, 
  Package, 
  FolderGit2, 
  Cpu, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  FileArchive, 
  Layout, 
  Layers, 
  Code2, 
  Eye, 
  Info, 
  BookMarked, 
  Lock, 
  UserPlus, 
  ShieldCheck,
  Search
} from 'lucide-react';
import { JAVA_PROJECT_FILES } from '../data/javaProjectFiles';
import { JavaSourceFile, Book, User, BorrowRecord, Category } from '../types';
import { generateAndDownloadWar, generateAndDownloadMavenZip } from '../utils/warPackager';

interface JavaWarGeneratorProps {
  books: Book[];
  users: User[];
  borrowRecords: BorrowRecord[];
  categories: Category[];
}

export const JavaWarGenerator: React.FC<JavaWarGeneratorProps> = ({
  books,
  users,
  borrowRecords,
  categories
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'files' | 'jsp-preview' | 'architecture'>('files');
  const [selectedFile, setSelectedFile] = useState<JavaSourceFile>(
    JAVA_PROJECT_FILES.find((f) => f.name === 'WebViewController.java') || JAVA_PROJECT_FILES[0]
  );
  const [fileFilter, setFileFilter] = useState<'ALL' | 'FRONTEND' | 'BACKEND' | 'CONFIG'>('ALL');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isGeneratingWar, setIsGeneratingWar] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);

  // JSP Live Preview Simulation state
  const [selectedJspPage, setSelectedJspPage] = useState<'login' | 'register' | 'catalog' | 'loans' | 'admin'>('catalog');
  const [previewTab, setPreviewTab] = useState<'rendered' | 'jsp-code' | 'controller-code'>('rendered');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadWar = async () => {
    try {
      setIsGeneratingWar(true);
      await generateAndDownloadWar(books, users, borrowRecords, categories);
    } finally {
      setIsGeneratingWar(false);
    }
  };

  const handleDownloadMavenZip = async () => {
    try {
      setIsGeneratingZip(true);
      await generateAndDownloadMavenZip(books, users, borrowRecords, categories);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const filteredFiles = JAVA_PROJECT_FILES.filter((f) => {
    if (fileFilter === 'FRONTEND') {
      return f.category === 'frontend_jsp' || f.category === 'webapp' || f.path.includes('/webapp/');
    }
    if (fileFilter === 'BACKEND') {
      return (
        f.category === 'entity' ||
        f.category === 'repository' ||
        f.category === 'service' ||
        f.category === 'controller' ||
        f.name === 'LibraryApplication.java'
      );
    }
    if (fileFilter === 'CONFIG') {
      return f.category === 'config' || f.category === 'sql' || f.category === 'docs';
    }
    return true;
  });

  // Get corresponding files for JSP Simulation
  const currentJspFile = JAVA_PROJECT_FILES.find((f) => f.name === `${selectedJspPage}.jsp`);
  const webControllerFile = JAVA_PROJECT_FILES.find((f) => f.name === 'WebViewController.java');

  return (
    <div className="space-y-6">
      {/* Hero Action Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-orange-950/50 via-slate-900 to-amber-950/40 border border-orange-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono">
              <Server className="w-3.5 h-3.5" />
              <span>Unified Java Architecture: Frontend (JSP) + Backend (Spring/MySQL)</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-100">
              Java Web Application (.WAR) &amp; Frontend JSP Suite
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Both your <strong className="text-orange-300 font-semibold">Java Frontend (JSP / JSTL / Servlets)</strong> and{' '}
              <strong className="text-orange-300 font-semibold">Java Backend (Spring Boot / Data JPA / MySQL)</strong> are organized inside 
              <span className="text-amber-300 font-bold"> ONE single project folder</span> and packaged into a unified deployable <code className="text-orange-300 font-mono text-xs">library-management.war</code>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={handleDownloadWar}
              disabled={isGeneratingWar}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              <FileArchive className="w-4 h-4" />
              <span>{isGeneratingWar ? 'Packaging .WAR Archive...' : 'Download Unified .WAR'}</span>
            </button>

            <button
              onClick={handleDownloadMavenZip}
              disabled={isGeneratingZip}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Package className="w-4 h-4 text-orange-400" />
              <span>{isGeneratingZip ? 'Packaging ZIP...' : 'Download Single-Folder Project (ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Spec Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Frontend: <strong>JavaServer Pages (JSP) + JSTL</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Backend: <strong>Spring Boot 3 + Hibernate JPA</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Packaging: <strong>Single Folder &lt;war&gt;</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Target: <strong>Apache Tomcat 10+ / Jetty</strong></span>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveMainTab('files')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeMainTab === 'files'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Unified Source Tree &amp; Code ({JAVA_PROJECT_FILES.length} Files)</span>
        </button>

        <button
          onClick={() => setActiveMainTab('jsp-preview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeMainTab === 'jsp-preview'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Live Java JSP Frontend Simulation</span>
        </button>

        <button
          onClick={() => setActiveMainTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeMainTab === 'architecture'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Single-Folder Architecture Guide</span>
        </button>
      </div>

      {/* Mode 1: Unified Files Browser */}
      {activeMainTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Filter and File List */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Project Files</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {filteredFiles.length} of {JAVA_PROJECT_FILES.length}
              </span>
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px]">
              <button
                onClick={() => setFileFilter('ALL')}
                className={`py-1 rounded-lg font-medium transition-colors ${
                  fileFilter === 'ALL' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Files
              </button>
              <button
                onClick={() => setFileFilter('FRONTEND')}
                className={`py-1 rounded-lg font-medium transition-colors ${
                  fileFilter === 'FRONTEND' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ☕ Frontend (JSP)
              </button>
              <button
                onClick={() => setFileFilter('BACKEND')}
                className={`py-1 rounded-lg font-medium transition-colors ${
                  fileFilter === 'BACKEND' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚙️ Backend (Java)
              </button>
              <button
                onClick={() => setFileFilter('CONFIG')}
                className={`py-1 rounded-lg font-medium transition-colors ${
                  fileFilter === 'CONFIG' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                🔧 Config &amp; DDL
              </button>
            </div>

            {/* File List */}
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.path === file.path;
                const isJsp = file.path.includes('.jsp');

                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-orange-500/15 border border-orange-500/40 text-orange-300'
                        : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <FileCode2
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        isSelected ? 'text-orange-400' : isJsp ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="font-mono text-xs font-semibold truncate leading-tight">
                          {file.name}
                        </p>
                        {isJsp && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">
                            JSP
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {file.path}
                      </p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 mt-0.5 ${isSelected ? 'text-orange-400' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Code Viewer */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl flex flex-col">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-orange-300 truncate">
                    {selectedFile.path}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                    {selectedFile.language}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {selectedFile.description}
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex-shrink-0"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                {selectedFile.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Live JSP Simulation */}
      {activeMainTab === 'jsp-preview' && (
        <div className="space-y-4">
          {/* Sub-selector for JSP page */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">JSP View:</span>
              {[
                { id: 'catalog', label: 'catalog.jsp', icon: BookOpen },
                { id: 'loans', label: 'loans.jsp', icon: BookMarked },
                { id: 'login', label: 'login.jsp', icon: Lock },
                { id: 'register', label: 'register.jsp', icon: UserPlus },
                { id: 'admin', label: 'admin.jsp', icon: ShieldCheck }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedJspPage(item.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                      selectedJspPage === item.id
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* View switcher: Rendered HTML vs JSP Code vs WebController */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setPreviewTab('rendered')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  previewTab === 'rendered' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Simulated View</span>
              </button>
              <button
                onClick={() => setPreviewTab('jsp-code')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  previewTab === 'jsp-code' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>JSP Source</span>
              </button>
              <button
                onClick={() => setPreviewTab('controller-code')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  previewTab === 'controller-code' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Java Controller</span>
              </button>
            </div>
          </div>

          {/* Rendered Preview Tab */}
          {previewTab === 'rendered' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
              {/* Browser mockup header */}
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 max-w-md mx-auto bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 truncate text-center">
                  http://localhost:8080/library-management/{selectedJspPage === 'catalog' ? 'catalog' : selectedJspPage}
                </div>
                <span className="text-[10px] font-mono text-amber-400">Tomcat JSP Engine</span>
              </div>

              {/* Rendered content based on selected JSP */}
              <div className="p-6 bg-slate-950">
                {/* Mock JSP Navbar */}
                <div className="p-3 mb-6 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-serif font-bold text-slate-200">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px]">🏛️</span>
                    <span>Athenaeum Library</span>
                    <span className="font-mono text-[10px] text-slate-500">WEB-INF/jsp/{selectedJspPage}.jsp</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <span className="text-amber-400 font-semibold">Jane Doe (STU-2024-884)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">READER</span>
                  </div>
                </div>

                {/* Page-Specific JSP Simulation */}
                {selectedJspPage === 'catalog' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-slate-100 text-base">Book Catalog &amp; Circulation</h3>
                        <p className="text-xs text-slate-400">Rendered from <code>&lt;c:forEach items=&quot;\${'{books}'}&quot; var=&quot;book&quot;&gt;</code></p>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        {books.length} Books in MySQL
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {books.slice(0, 3).map((b) => (
                        <div key={b.id} className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
                          <img src={b.coverUrl} alt={b.title} className="w-full h-32 object-cover rounded-lg border border-slate-800" />
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400">{b.categoryName}</span>
                          <h4 className="font-bold text-slate-100 truncate">{b.title}</h4>
                          <p className="text-[11px] text-slate-400">{b.author}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <span className="font-mono text-emerald-400">{b.availableCopies} available</span>
                            <span className="px-2 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">
                              Borrow (JSP Form)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJspPage === 'loans' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                      <h3 className="font-serif font-bold text-slate-100 text-base">My Borrowed Books &amp; Tracking</h3>
                      <p className="text-xs text-slate-400">Rendered via <code>&lt;c:forEach items=&quot;\${'{activeLoans}'}&quot; var=&quot;loan&quot;&gt;</code></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {borrowRecords.slice(0, 2).map((r) => (
                        <div key={r.id} className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                              {r.status}
                            </span>
                            <span className="text-slate-500 font-mono text-[10px]">Due: {r.dueDate}</span>
                          </div>
                          <h4 className="font-bold text-slate-100 truncate">{r.bookTitle}</h4>
                          <p className="text-[11px] text-slate-400">{r.bookAuthor}</p>
                          <div className="flex gap-2 pt-2 border-t border-slate-800">
                            <button className="flex-1 py-1 rounded bg-slate-800 text-slate-300 text-[10px]">
                              Renew (+7d)
                            </button>
                            <button className="flex-1 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]">
                              Return Book
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJspPage === 'login' && (
                  <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                    <div className="text-center space-y-1">
                      <span className="text-2xl">🔒</span>
                      <h3 className="font-serif font-bold text-slate-100 text-base">Sign In (login.jsp)</h3>
                      <p className="text-slate-400 text-[11px]">Submits POST to <code>WebViewController.processLogin()</code></p>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Email</label>
                      <input type="text" readOnly value="jane.doe@campus.edu" className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-slate-200" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Password</label>
                      <input type="password" readOnly value="reader123" className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-slate-200" />
                    </div>
                    <button className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs mt-2">
                      Sign In (JSP Form POST)
                    </button>
                  </div>
                )}

                {selectedJspPage === 'register' && (
                  <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                    <div className="text-center space-y-1">
                      <span className="text-2xl">📝</span>
                      <h3 className="font-serif font-bold text-slate-100 text-base">Create Account (register.jsp)</h3>
                      <p className="text-slate-400 text-[11px]">Binds to MySQL <code>users</code> table</p>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Full Name</label>
                      <input type="text" readOnly value="Arthur Pendelton" className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-200" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Email</label>
                      <input type="text" readOnly value="arthur@campus.edu" className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-200" />
                    </div>
                    <button className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs mt-2">
                      Register Card
                    </button>
                  </div>
                )}

                {selectedJspPage === 'admin' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30">
                      <h3 className="font-serif font-bold text-purple-300 text-base">🛡️ Librarian Administration (admin.jsp)</h3>
                      <p className="text-xs text-slate-400">Accessible only when <code>sessionScope.currentUser.role == 'LIBRARIAN'</code></p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
                      <p className="font-semibold text-slate-200 mb-2">Live Borrow Registry from MySQL:</p>
                      <table className="w-full text-left font-mono text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="p-2">#</th>
                            <th className="p-2">Member</th>
                            <th className="p-2">Book Title</th>
                            <th className="p-2">Due Date</th>
                            <th className="p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {borrowRecords.slice(0, 3).map((r) => (
                            <tr key={r.id}>
                              <td className="p-2 text-slate-500">#{r.id}</td>
                              <td className="p-2">{r.userName}</td>
                              <td className="p-2">{r.bookTitle}</td>
                              <td className="p-2 text-amber-400">{r.dueDate}</td>
                              <td className="p-2">
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300">{r.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw JSP Source Tab */}
          {previewTab === 'jsp-code' && currentJspFile && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="font-mono text-xs text-amber-300 font-bold">{currentJspFile.path}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">JavaServer Page</span>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[520px] overflow-y-auto leading-relaxed">
                {currentJspFile.content}
              </pre>
            </div>
          )}

          {/* WebController Java Code Tab */}
          {previewTab === 'controller-code' && webControllerFile && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="font-mono text-xs text-orange-300 font-bold">{webControllerFile.path}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">Spring MVC Controller</span>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[520px] overflow-y-auto leading-relaxed">
                {webControllerFile.content}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Unified Single-Folder Architecture Guide */}
      {activeMainTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Folder 1: Frontend inside WEB-INF/jsp */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  ☕
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-100 text-sm">Java Frontend in Single Folder</h3>
                  <p className="text-[11px] text-slate-400 font-mono">src/main/webapp/WEB-INF/jsp/</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                JavaServer Pages (JSP) are server-rendered Java views with JSTL &amp; Expression Language (EL). 
                Because they live in <code className="text-amber-300 font-mono text-[11px]">src/main/webapp/</code>, Maven automatically 
                bundles them into the root of the <code className="text-amber-300 font-mono text-[11px]">.war</code> archive for Apache Tomcat.
              </p>
              <ul className="text-xs text-slate-400 space-y-1 font-mono list-disc list-inside">
                <li><code>login.jsp</code> &amp; <code>register.jsp</code>: User auth forms</li>
                <li><code>catalog.jsp</code>: Book browsing &amp; checkout modal</li>
                <li><code>loans.jsp</code>: Member borrowed books tracking</li>
                <li><code>admin.jsp</code>: Librarian stock &amp; loans registry</li>
                <li><code>common/navbar.jsp</code>: Session-aware top navigation</li>
              </ul>
            </div>

            {/* Folder 2: Backend inside src/main/java */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-orange-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                  ⚙️
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-100 text-sm">Java Backend in Same Folder</h3>
                  <p className="text-[11px] text-slate-400 font-mono">src/main/java/com/athenaeum/library/</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Spring Boot 3, Spring MVC, and Hibernate JPA running with MySQL Connector/J. 
                The <code className="text-orange-300 font-mono text-[11px]">WebViewController.java</code> binds JPA entity data to the JSP frontend views via <code className="text-orange-300 font-mono text-[11px]">org.springframework.ui.Model</code>.
              </p>
              <ul className="text-xs text-slate-400 space-y-1 font-mono list-disc list-inside">
                <li><code>LibraryApplication.java</code>: SpringBootServletInitializer</li>
                <li><code>WebViewController.java</code>: Routes &amp; renders JSP views</li>
                <li><code>model/</code>: JPA entities for MySQL tables</li>
                <li><code>repository/</code>: Spring Data JPA interfaces</li>
                <li><code>service/LibraryService.java</code>: Checkout &amp; return logic</li>
              </ul>
            </div>
          </div>

          {/* Visual packaging diagram */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-serif font-bold text-slate-100 text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-400" />
              <span>How Maven Packages Both Frontend &amp; Backend into ONE .WAR</span>
            </h3>
            <pre className="p-4 rounded-xl bg-slate-900 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
{`library-management/
├── pom.xml                                   <-- Single Maven build file (<packaging>war</packaging>)
├── schema.sql                                <-- MySQL 8.0 DDL & seed queries
├── src/
│   ├── main/
│   │   ├── java/com/athenaeum/library/       <-- Java Backend
│   │   │   ├── LibraryApplication.java       <-- Extends SpringBootServletInitializer
│   │   │   ├── controller/WebViewController.java <-- Binds MySQL data to JSP Frontend
│   │   │   ├── model/ (User, Book, BorrowRecord, Category)
│   │   │   ├── repository/ (UserRepository, BookRepository, BorrowRecordRepository)
│   │   │   └── service/LibraryService.java
│   │   ├── resources/
│   │   │   └── application.properties        <-- MySQL JDBC configuration
│   │   └── webapp/                           <-- Java Frontend
│   │       ├── WEB-INF/
│   │       │   ├── web.xml                   <-- Servlet 6.0 deployment descriptor
│   │       │   └── jsp/                      <-- Dynamic JavaServer Pages (JSP)
│   │       │       ├── common/navbar.jsp
│   │       │       ├── login.jsp             <-- Login view
│   │       │       ├── register.jsp          <-- Sign Up view
│   │       │       ├── catalog.jsp           <-- Book catalog & borrowing view
│   │       │       ├── loans.jsp             <-- Active borrowings & tracking view
│   │       │       └── admin.jsp             <-- Librarian console view
│   │       └── static/css/athenaeum.css
└── target/
    └── library-management.war                <-- UNIFIED ARTIFACT DEPLOYED TO TOMCAT`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
