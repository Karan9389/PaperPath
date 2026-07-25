import React, { useState } from 'react';
import { Bookmark, CheckCircle2, Database, History, LayoutDashboard, LogOut, Mail, ShieldCheck, Sparkles, User, Upload, Zap } from 'lucide-react';
import UploadComponent from './UploadComponent';

export default function ProfileView({ user, savedPapers = [], readHistory = [], onLogout, setView }) {
  const [activeTab, setActiveTab] = useState('upload');
  const userInitials = user?.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'U';

  const roleName = user?.role ? user.role.toUpperCase() : 'RESEARCHER';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#238636] to-[#a371f7] p-1 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#0d1117] flex items-center justify-center text-xl font-bold text-[#f0f6fc]">
              {userInitials}
            </div>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h1 className="text-xl font-bold text-[#f0f6fc]">{user?.name || 'Academic User'}</h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
                {roleName}
              </span>
            </div>
            <p className="text-xs text-[#848d96] flex items-center justify-center sm:justify-start">
              <Mail className="h-3.5 w-3.5 mr-1.5 text-[#58a6ff]" />
              {user?.email || 'user@paperpath.com'}
            </p>
            <p className="text-xs text-[#848d96]">PaperPath Academic Researcher • Active RAG Session</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView('dashboard')}
            className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] text-xs font-semibold text-[#c9d1d9] rounded-md transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 bg-[#da3633]/20 border border-[#da3633]/40 text-xs font-semibold text-[#f85149] rounded-md hover:bg-[#da3633]/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* QUICK METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex items-center space-x-4">
          <div className="p-3 bg-[#238636]/10 text-[#3fb950] border border-[#238636]/30 rounded-md">
            <Bookmark className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#f0f6fc]">{savedPapers.length}</div>
            <div className="text-xs text-[#848d96]">Saved Papers</div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex items-center space-x-4">
          <div className="p-3 bg-[#a371f7]/10 text-[#d2a8ff] border border-[#8957e5]/30 rounded-md">
            <History className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#f0f6fc]">{readHistory.length}</div>
            <p className="text-xs text-[#848d96]">PaperPath Academic Researcher • Active AI RAG Session</p>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex items-center space-x-4">
          <div className="p-3 bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/30 rounded-md">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#3fb950]">Active</div>
            <div className="text-xs text-[#848d96]">Vector Index</div>
          </div>
        </div>
      </div>

      {/* MAIN PROFILE BODY & DATASET UPLOADER */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-md">
        <div className="bg-[#010409] border-b border-[#30363d] px-6 py-3 flex space-x-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors flex items-center ${activeTab === 'upload' ? 'bg-[#238636] text-white' : 'text-[#848d96] hover:text-[#f0f6fc]'
              }`}
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload & Ingest PDF Dataset
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors flex items-center ${activeTab === 'settings' ? 'bg-[#238636] text-white' : 'text-[#848d96] hover:text-[#f0f6fc]'
              }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Account Details
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'upload' ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#f0f6fc]">Ingest PDF / CSV Dataset into Vector Index</h3>
                <p className="text-xs text-[#848d96] mt-1">
                  Uploaded files will be parsed, chunked, and embedded for PaperPath AI Tutor analysis.
                </p>
              </div>

              <UploadComponent onUploadSuccess={() => window.location.reload()} />
            </div>
          ) : (
            <div className="space-y-4 max-w-xl text-xs">
              <div className="bg-[#0d1117] p-4 rounded-md border border-[#30363d] space-y-1">
                <span className="text-[#848d96] font-mono">FULL NAME</span>
                <p className="font-bold text-[#f0f6fc] text-sm">{user?.name || 'Academic User'}</p>
              </div>
              <div className="bg-[#0d1117] p-4 rounded-md border border-[#30363d] space-y-1">
                <span className="text-[#848d96] font-mono">EMAIL ADDRESS</span>
                <p className="font-bold text-[#f0f6fc] text-sm">{user?.email || 'user@paperpath.com'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


