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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="glass-card rounded-[32px] p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--accent-blue)] to-[var(--accent-purple)] p-[3px] shadow-lg">
            <div className="w-full h-full rounded-full bg-[var(--bg-surface)] flex items-center justify-center text-3xl font-bold text-white shadow-inner">
              {userInitials}
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left mt-2">
            <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{user?.name || 'Academic User'}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[rgba(10,132,255,0.15)] text-[var(--accent-blue)]">
                {roleName}
              </span>
            </div>
            <p className="text-[14px] text-[var(--text-secondary)] flex items-center justify-center sm:justify-start font-medium">
              <Mail className="h-4 w-4 mr-1.5" />
              {user?.email || 'user@paperpath.com'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setView('dashboard')}
            className="px-5 py-2.5 bg-[var(--bg-overlay)] border border-[var(--border-subtle)] hover:bg-[var(--bg-raised)] text-[13px] font-bold text-white rounded-full transition-all shadow-sm"
          >
            Dashboard
          </button>
          <button
            onClick={onLogout}
            className="px-5 py-2.5 bg-[rgba(255,69,58,0.15)] text-[13px] font-bold text-[var(--accent-red)] rounded-full hover:bg-[rgba(255,69,58,0.25)] transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* QUICK METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-[24px] p-6 flex items-center space-x-5 transition-transform hover:scale-[1.02]">
          <div className="p-4 bg-[rgba(191,90,242,0.15)] rounded-2xl">
            <Bookmark className="h-7 w-7 text-[var(--accent-purple)]" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{savedPapers.length}</div>
            <div className="text-[13px] font-medium text-[var(--text-secondary)]">Saved Papers</div>
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-6 flex items-center space-x-5 transition-transform hover:scale-[1.02]">
          <div className="p-4 bg-[rgba(10,132,255,0.15)] rounded-2xl">
            <History className="h-7 w-7 text-[var(--accent-blue)]" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{readHistory.length}</div>
            <p className="text-[13px] font-medium text-[var(--text-secondary)]">Reading History</p>
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-6 flex items-center space-x-5 transition-transform hover:scale-[1.02]">
          <div className="p-4 bg-[rgba(48,209,88,0.15)] rounded-2xl">
            <Database className="h-7 w-7 text-[var(--accent-green)]" />
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--accent-green)] flex items-center gap-2">
              Active <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-green)] opacity-40"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-green)]"></span></span>
            </div>
            <div className="text-[13px] font-medium text-[var(--text-secondary)]">Vector Index</div>
          </div>
        </div>
      </div>

      {/* MAIN PROFILE BODY & DATASET UPLOADER */}
      <div className="glass-card rounded-[32px] overflow-hidden">
        {/* iOS Segmented Control Style Tabs */}
        <div className="bg-[var(--bg-overlay)] border-b border-[var(--border-subtle)] p-4 flex justify-center sm:justify-start">
          <div className="flex items-center p-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] w-full sm:w-auto shadow-inner">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                activeTab === 'upload' ? 'bg-[#3a3a3c] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              <Upload className="h-4 w-4" /> Upload Dataset
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                activeTab === 'settings' ? 'bg-[#3a3a3c] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              <ShieldCheck className="h-4 w-4" /> Account Details
            </button>
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'upload' ? (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-[17px] font-bold text-white mb-2">Ingest PDF / CSV Dataset into Vector Index</h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  Uploaded files will be securely parsed, chunked, and embedded for PaperPath AI Tutor analysis.
                </p>
              </div>
              <UploadComponent onUploadSuccess={() => window.location.reload()} />
            </div>
          ) : (
            <div className="space-y-4 max-w-xl">
              <div className="bg-[var(--bg-overlay)] p-5 rounded-2xl border border-[var(--border-subtle)] space-y-1.5">
                <span className="text-[11px] text-[var(--text-secondary)] font-bold tracking-wider uppercase">Full Name</span>
                <p className="font-bold text-white text-[17px]">{user?.name || 'Academic User'}</p>
              </div>
              <div className="bg-[var(--bg-overlay)] p-5 rounded-2xl border border-[var(--border-subtle)] space-y-1.5">
                <span className="text-[11px] text-[var(--text-secondary)] font-bold tracking-wider uppercase">Email Address</span>
                <p className="font-bold text-white text-[17px]">{user?.email || 'user@paperpath.com'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
