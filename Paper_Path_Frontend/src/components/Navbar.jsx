import React from 'react';
import { BrainCircuit, LayoutDashboard, LogOut, Search, Sparkles, User, Cpu } from 'lucide-react';

export default function Navbar({ user, onLogout, setView, currentView }) {
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'DU';

  return (
    <nav className="glass-panel sticky top-0 z-50 shadow-xl border-b border-[#30363d]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center space-x-6">
            {/* Logo Emblem */}
            <div className="flex items-center cursor-pointer group" onClick={() => setView('dashboard')}>
              <div className="p-1.5 rounded-lg bg-[#161b22] border border-[#30363d] group-hover:border-[#58a6ff] transition-all glow-emerald mr-2.5">
                <BrainCircuit className="h-5 w-5 text-[#3fb950]" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-[#f0f6fc] tracking-tight group-hover:text-[#58a6ff] transition-colors">
                  PaperPath <span className="text-[#848d96] font-normal">/</span> Dashboard
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 flex items-center">
                  <Cpu className="h-2.5 w-2.5 mr-1 text-[#3fb950]" /> Gemini API Active
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden sm:flex items-center space-x-1">
              <button
                onClick={() => setView('dashboard')}
                className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d] shadow-sm'
                    : 'text-[#848d96] hover:text-[#f0f6fc] hover:bg-[#161b22]'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5 mr-1.5 text-[#58a6ff]" />
                Explore
              </button>
              <button
                onClick={() => setView('profile')}
                className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'profile'
                    ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d] shadow-sm'
                    : 'text-[#848d96] hover:text-[#f0f6fc] hover:bg-[#161b22]'
                }`}
              >
                <User className="h-3.5 w-3.5 mr-1.5 text-[#a371f7]" />
                Profile
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* User Avatar Badge */}
            <button
              onClick={() => setView('profile')}
              className="flex items-center space-x-2 p-1 pr-3 rounded-full bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] transition-all group"
              title="View Profile"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#238636] to-[#58a6ff] text-white font-bold text-[10px] flex items-center justify-center shadow-inner">
                {userInitials}
              </div>
              <span className="text-xs font-medium text-[#c9d1d9] group-hover:text-[#f0f6fc] max-w-[120px] truncate">
                {user?.name || 'Demo User'}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="text-[#848d96] hover:text-[#ff7b72] transition-colors p-1.5 rounded-lg hover:bg-[#21262d]"
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
