import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Sparkles, BookOpenCheck, ArrowRight } from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
  existingUsers: User[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  existingUsers
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('jane.doe@campus.edu');
  const [loginPassword, setLoginPassword] = useState('reader123');

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('READER');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const found = existingUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!found) {
      setErrorMsg('No user account found with this email. Try our demo buttons below or sign up.');
      return;
    }

    onLogin(found);
    onClose();
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const emailTaken = existingUsers.some(
      (u) => u.email.toLowerCase() === signUpEmail.trim().toLowerCase()
    );

    if (emailTaken) {
      setErrorMsg('An account with this email address already exists. Please log in.');
      return;
    }

    const prefix = signUpRole === 'LIBRARIAN' ? 'LIB-' : 'STU-';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newMembershipId = `${prefix}2026-${randomSuffix}`;

    const newUser: User = {
      id: Date.now(),
      email: signUpEmail.trim(),
      fullName: signUpName.trim(),
      membershipId: newMembershipId,
      role: signUpRole,
      phone: signUpPhone.trim() || '+1 (555) 000-0000',
      joinedAt: new Date().toISOString().split('T')[0]
    };

    onRegister(newUser);
    onLogin(newUser);
    onClose();
  };

  const handleQuickDemo = (role: 'READER' | 'LIBRARIAN') => {
    const demoUser = existingUsers.find((u) => u.role === role);
    if (demoUser) {
      onLogin(demoUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-100 text-base">
                {mode === 'LOGIN' ? 'Welcome Back' : 'Create Library Account'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === 'LOGIN' ? 'Sign in to borrow books and manage loans' : 'Register for Athenaeum library privileges'}
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

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 mx-6 mt-4 rounded-xl">
          <button
            onClick={() => {
              setMode('LOGIN');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'LOGIN'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('SIGNUP');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'SIGNUP'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-4">
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {errorMsg}
            </div>
          )}

          {mode === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. jane.doe@campus.edu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <span>Sign In to Library</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Arthur Pendelton"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="e.g. arthur.p@campus.edu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+1 (555)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignUpRole('READER')}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      signUpRole === 'READER'
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <BookOpenCheck className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-xs font-semibold">Student / Reader</p>
                      <p className="text-[10px] text-slate-400">Borrow &amp; track books</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpRole('LIBRARIAN')}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      signUpRole === 'LIBRARIAN'
                        ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs font-semibold">Librarian Admin</p>
                      <p className="text-[10px] text-slate-400">Catalog &amp; stock control</p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
              >
                Complete Registration
              </button>
            </form>
          )}

          {/* Quick Demo Logins */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>One-Click Test Accounts (Pre-configured in MySQL)</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('READER')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    Reader
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">STU-2024-884</span>
                </div>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 mt-1">
                  Jane Doe
                </p>
                <p className="text-[10px] text-slate-400 truncate">jane.doe@campus.edu</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('LIBRARIAN')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-left transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                    Librarian
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">LIB-2024-001</span>
                </div>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-purple-300 mt-1">
                  Elena Vance
                </p>
                <p className="text-[10px] text-slate-400 truncate">admin@athenaeum.edu</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
