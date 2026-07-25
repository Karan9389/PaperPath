import React from 'react';
import { BrainCircuit, LayoutDashboard, LogOut, Search, Sparkles, User, Terminal } from 'lucide-react';

export default function Navbar({ user, onLogout, setView, currentView }) {
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <nav className="bg-[#010409] border-b border-[#30363d] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center space-x-6">
            {/* GitHub Octocat / Copilot Emblem */}
            <div className="flex items-center cursor-pointer group" onClick={() => setView('dashboard')}>
              <div className="p-1.5 rounded-lg bg-[#21262d] border border-[#30363d] group-hover:border-[#8b949e] transition-colors mr-2.5">
                <BrainCircuit className="h-5 w-5 text-[#3fb950]" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-[#f0f6fc] tracking-tight group-hover:text-[#58a6ff] transition-colors">
                  PaperPath <span className="text-[#848d96] font-normal">/</span> Dashboard
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
                  AI Tutor
                </span>
              </div>
            </div>

            {/* Interactive Search Bar Input */}
            <div className="hidden md:flex items-center bg-[#161b22] border border-[#30363d] focus-within:border-[#58a6ff] rounded-md px-3 py-1.5 w-64 space-x-2 transition-colors">
              <Search className="h-3.5 w-3.5 text-[#848d96]" />
              <input
                type="text"
                placeholder="Search papers or authors..."
                onClick={() => setView('dashboard')}
                className="bg-transparent text-xs text-[#f0f6fc] placeholder-[#848d96] outline-none w-full"
              />
            </div>

            {/* Navigation Tabs */}
            <div className="hidden sm:flex items-center space-x-1">
              <button
                onClick={() => setView('dashboard')}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                    : 'text-[#848d96] hover:text-[#f0f6fc] hover:bg-[#161b22]'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5 mr-1.5 text-[#58a6ff]" />
                Explore
              </button>
              <button
                onClick={() => setView('profile')}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  currentView === 'profile'
                    ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
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
              className="flex items-center space-x-2 p-1 pr-3 rounded-full bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] transition-all group"
              title="View Profile"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#238636] to-[#a371f7] text-white font-bold text-[10px] flex items-center justify-center">
                {userInitials}
              </div>
              <span className="text-xs font-medium text-[#c9d1d9] group-hover:text-[#f0f6fc] max-w-[120px] truncate">
                {user?.name || 'Researcher'}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="text-[#848d96] hover:text-[#f85149] transition-colors p-1.5 rounded-md hover:bg-[#21262d]"
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



