import React from 'react';
import { 
  BookOpen, 
  Library, 
  BookmarkCheck, 
  ShieldCheck, 
  Database, 
  FileCode2, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'catalog' | 'my-loans' | 'admin' | 'mysql' | 'java-war';
  setActiveTab: (tab: 'catalog' | 'my-loans' | 'admin' | 'mysql' | 'java-war') => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchRole: () => void;
  activeLoansCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onSwitchRole,
  activeLoansCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div 
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Library className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-slate-100 tracking-tight group-hover:text-amber-400 transition-colors">
                  Athenaeum
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Java + MySQL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Library Management &amp; WAR Deployment System
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'catalog'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('my-loans')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all relative ${
                activeTab === 'my-loans'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>My Loans</span>
              {activeLoansCount > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  activeTab === 'my-loans' 
                    ? 'bg-slate-950 text-amber-400' 
                    : 'bg-amber-500 text-slate-950'
                }`}>
                  {activeLoansCount}
                </span>
              )}
            </button>

            {currentUser?.role === 'LIBRARIAN' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Librarian Admin</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('mysql')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'mysql'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>MySQL Workbench</span>
            </button>

            <button
              onClick={() => setActiveTab('java-war')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'java-war'
                  ? 'bg-orange-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>Java .WAR &amp; Source</span>
            </button>
          </nav>

          {/* Right Action & User Profile */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-3 py-1 pr-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-slate-200 leading-tight">
                      {currentUser.fullName}
                    </p>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded font-bold ${
                        currentUser.role === 'LIBRARIAN'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {currentUser.role}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {currentUser.membershipId}
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName.charAt(0)}
                  </div>

                  <button
                    onClick={onSwitchRole}
                    title="Quick switch between Reader and Librarian role"
                    className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors text-xs flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] hidden lg:inline">Switch Role</span>
                  </button>

                  <button
                    onClick={onLogout}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-[11px] font-medium overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              activeTab === 'catalog' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('my-loans')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              activeTab === 'my-loans' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Loans ({activeLoansCount})</span>
          </button>

          {currentUser?.role === 'LIBRARIAN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                activeTab === 'admin' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('mysql')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              activeTab === 'mysql' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-cyan-400'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MySQL</span>
          </button>

          <button
            onClick={() => setActiveTab('java-war')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              activeTab === 'java-war' ? 'bg-orange-500 text-slate-950 font-semibold' : 'text-orange-400'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Java .WAR</span>
          </button>
        </div>
      </div>
    </header>
  );
};
