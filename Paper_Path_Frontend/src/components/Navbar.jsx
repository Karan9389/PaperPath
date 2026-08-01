import React from 'react';
import { BrainCircuit, LayoutDashboard, LogOut, BookMarked, Sun, Moon } from 'lucide-react';

export default function Navbar({ user, onLogout, setView, currentView, theme, toggleTheme }) {
  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PP';

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-overlay)] backdrop-blur-[40px] saturate-[200%]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          
          {/* Left: Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('dashboard')}
          >
            <div className="p-1.5 rounded-[10px] bg-[var(--bg-surface)] border border-[var(--border-muted)] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <BrainCircuit className="h-5 w-5 text-[var(--text-primary)]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-base text-[var(--text-primary)] tracking-tight">
                PaperPath
              </span>
            </div>
            {/* Gemini pill - iOS style */}
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(48,209,88,0.15)] text-[var(--accent-green)] ml-2 border border-[rgba(48,209,88,0.2)]">
              <span className="pulse-dot" style={{ width: 4, height: 4 }} />
              Gemini
            </span>
          </div>

          {/* Center: Nav Tabs (iOS pill style) */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
            <button
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                currentView === 'dashboard' || currentView === 'reader'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-base)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)]'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Explore
            </button>
            <button
              onClick={() => setView('profile')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                currentView === 'profile'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-base)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)]'
              }`}
            >
              <BookMarked className="h-3.5 w-3.5" />
              Library
            </button>
          </div>

          {/* Right: Actions + Avatar */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-all flex items-center justify-center shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => setView('profile')}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] transition-all hover:bg-[var(--bg-raised)] hover:border-[var(--border-muted)] shadow-sm"
              title="View Profile"
            >
              <div className="w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center text-white bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] shadow-sm">
                {userInitials}
              </div>
              <span className="hidden sm:block text-xs font-medium text-[var(--text-secondary)] max-w-[100px] truncate">
                {user?.name || 'User'}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent-red)] hover:bg-[rgba(255,69,58,0.1)] transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
