import React from 'react';
import { BrainCircuit, LayoutDashboard, LogOut, User, Cpu, BookMarked } from 'lucide-react';

export default function Navbar({ user, onLogout, setView, currentView }) {
  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PP';

  return (
    <nav className="sticky top-0 z-50 border-b border-[#21262d] shadow-lg"
      style={{
        background: 'rgba(7, 11, 17, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">

          {/* Left: Logo + Nav Tabs */}
          <div className="flex items-center gap-5">
            {/* Logo */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => setView('dashboard')}
            >
              <div className="p-1.5 rounded-lg border transition-all duration-200"
                style={{
                  background: 'rgba(63,185,80,0.08)',
                  border: '1px solid rgba(63,185,80,0.25)',
                  boxShadow: '0 0 12px -3px rgba(63,185,80,0.2)',
                }}
              >
                <BrainCircuit className="h-4.5 w-4.5 text-[#3fb950]" style={{ width: 18, height: 18 }} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-sm text-[#e6edf3] tracking-tight group-hover:text-[#79c0ff] transition-colors">
                  PaperPath
                </span>
                <span className="text-[#3d444d] font-medium text-sm">/</span>
                <span className="text-sm text-[#8b949e] font-medium group-hover:text-[#e6edf3] transition-colors">
                  {currentView === 'profile' ? 'Profile' : 'Explore'}
                </span>
              </div>
              {/* Gemini indicator pill */}
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(63,185,80,0.08)',
                  border: '1px solid rgba(63,185,80,0.25)',
                  color: '#3fb950',
                }}
              >
                <span className="pulse-dot" style={{ width: 5, height: 5 }} />
                Gemini
              </span>
            </div>

            {/* Nav Tabs */}
            <div className="hidden sm:flex items-center gap-0.5 p-0.5 rounded-lg"
              style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid rgba(48,54,61,0.6)' }}
            >
              <button
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                  currentView === 'dashboard' || currentView === 'reader'
                    ? 'bg-[#21262d] text-[#e6edf3] shadow-sm border border-[#30363d]/50'
                    : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#1c2128]'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-[#58a6ff]" />
                Explore
              </button>
              <button
                onClick={() => setView('profile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                  currentView === 'profile'
                    ? 'bg-[#21262d] text-[#e6edf3] shadow-sm border border-[#30363d]/50'
                    : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#1c2128]'
                }`}
              >
                <BookMarked className="h-3.5 w-3.5 text-[#a371f7]" />
                Library
              </button>
            </div>
          </div>

          {/* Right: Avatar + Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('profile')}
              className="flex items-center gap-2 px-2 py-1 rounded-full transition-all duration-200 group border"
              style={{
                background: 'rgba(22,27,34,0.9)',
                border: '1px solid rgba(48,54,61,0.7)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(88,166,255,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(48,54,61,0.7)'}
              title="View Profile"
            >
              <div className="w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #1f6feb, #a371f7)' }}
              >
                {userInitials}
              </div>
              <span className="hidden sm:block text-xs font-medium text-[#8b949e] group-hover:text-[#e6edf3] max-w-[100px] truncate transition-colors pr-1">
                {user?.name || 'User'}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-[#545d68] hover:text-[#f85149] hover:bg-[#1c2128] transition-all"
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
