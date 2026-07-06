import React from 'react';
import { BrainCircuit, LogOut, User } from 'lucide-react';

export default function Navbar({ user, onLogout, setView }) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="bg-indigo-600 p-2 rounded-lg mr-3">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">PaperPath</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <User className="h-4 w-4 mr-2" />
              {user.name}
            </div>
            <button
              onClick={onLogout}
              className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
