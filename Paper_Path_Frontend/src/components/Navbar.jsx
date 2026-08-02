import React from 'react';
import { BrainCircuit, LayoutDashboard, LogOut, BookMarked, Sun, Moon } from 'lucide-react';

export default function Navbar({ user, onLogout, setView, currentView, theme, toggleTheme }) {
  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PP';

  const isExplore = currentView === 'dashboard' || currentView === 'reader';
  const isLibrary = currentView === 'profile';

  const tabBase = 'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer';

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'var(--bg-overlay)',
        backdropFilter: 'blur(56px) saturate(200%)',
        WebkitBackdropFilter: 'blur(56px) saturate(200%)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 2px 20px -4px rgba(0,0,0,0.18)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[56px] items-center gap-4">

          {/* ── Logo ── */}
          <button
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 bg-transparent border-0 p-0"
            onClick={() => setView('dashboard')}
          >
            <div
              className="p-1.5 rounded-[10px] flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-[0_6px_20px_-2px_rgba(64,156,255,0.55)]"
              style={{
                background: 'linear-gradient(140deg, var(--accent-blue) 0%, var(--accent-purple) 100%)',
                boxShadow: '0 4px 12px -2px rgba(64,156,255,0.35)',
              }}
            >
              <BrainCircuit className="h-[17px] w-[17px] text-white" />
            </div>

            <span className="font-extrabold text-[15px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
              PaperPath
            </span>

            <span
              className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(48,209,88,0.13)',
                color: 'var(--accent-green)',
                border: '1px solid rgba(48,209,88,0.20)',
              }}
            >
              <span className="pulse-dot" style={{ width: 5, height: 5 }} />
              Gemini
            </span>
          </button>

          {/* ── Center Tabs ── */}
          <div
            className="hidden sm:flex items-center gap-0.5 p-1 rounded-full"
            style={{
              background: 'var(--seg-ctrl-bg)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setView('dashboard')}
              className={tabBase}
              style={
                isExplore
                  ? { background: 'var(--tab-active-bg)', color: 'var(--tab-active-text)', boxShadow: '0 1px 8px rgba(0,0,0,0.14)' }
                  : { color: 'var(--text-secondary)' }
              }
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Explore
            </button>

            <button
              onClick={() => setView('profile')}
              className={tabBase}
              style={
                isLibrary
                  ? { background: 'var(--tab-active-bg)', color: 'var(--tab-active-text)', boxShadow: '0 1px 8px rgba(0,0,0,0.14)' }
                  : { color: 'var(--text-secondary)' }
              }
            >
              <BookMarked className="h-3.5 w-3.5" />
              Library
            </button>
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110"
              style={{
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Avatar pill */}
            <button
              onClick={() => setView('profile')}
              title="View Profile"
              className="flex items-center gap-2 pl-0.5 pr-3 py-0.5 rounded-full transition-all duration-200"
              style={{
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                className="w-7 h-7 rounded-full font-bold text-[11px] flex items-center justify-center text-white shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%)',
                  boxShadow: '0 2px 8px rgba(64,156,255,0.38)',
                }}
              >
                {userInitials}
              </div>
              <span
                className="hidden sm:block text-xs font-semibold max-w-[90px] truncate"
                style={{ color: 'var(--text-secondary)' }}
              >
                {user?.name || 'User'}
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-full transition-all duration-200"
              style={{ color: 'var(--text-muted)' }}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
