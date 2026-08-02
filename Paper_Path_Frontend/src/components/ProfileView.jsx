import React, { useState } from 'react';
import { Bookmark, Database, History, Mail, ShieldCheck, Upload, Zap } from 'lucide-react';
import UploadComponent from './UploadComponent';

export default function ProfileView({ user, savedPapers = [], readHistory = [], onLogout, setView }) {
  const [activeTab, setActiveTab] = useState('upload');

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const roleName = user?.role ? user.role.toUpperCase() : 'RESEARCHER';

  const METRICS = [
    {
      label: 'Saved Papers',
      value: savedPapers.length,
      icon: <Bookmark className="h-6 w-6" />,
      accent: '--accent-purple',
      bg: 'rgba(191,90,242,0.13)',
    },
    {
      label: 'Reading History',
      value: readHistory.length,
      icon: <History className="h-6 w-6" />,
      accent: '--accent-blue',
      bg: 'rgba(64,156,255,0.13)',
    },
    {
      label: 'Vector Index',
      value: <span className="flex items-center gap-2 text-[var(--accent-green)]">
        Active
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-green)] opacity-50" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-green)]" />
        </span>
      </span>,
      icon: <Database className="h-6 w-6" />,
      accent: '--accent-green',
      bg: 'rgba(48,209,88,0.13)',
    },
  ];

  const TABS = [
    { key: 'upload',   label: 'Upload Dataset', icon: <Upload className="h-4 w-4" /> },
    { key: 'settings', label: 'Account Details', icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      {/* ── Profile Hero Card ── */}
      <div
        className="glass-card rounded-[28px] p-8 relative overflow-hidden"
        style={{ cursor: 'default' }}
      >
        {/* Decorative gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(64,156,255,0.09) 0%, transparent 55%), ' +
              'radial-gradient(ellipse 60% 50% at 90% 100%, rgba(191,90,242,0.07) 0%, transparent 55%)',
          }}
        />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          {/* Left: Avatar + info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar ring */}
            <div
              className="w-20 h-20 rounded-full p-[2.5px] shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%)',
                boxShadow: '0 8px 24px -4px rgba(64,156,255,0.35)',
              }}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-2xl font-extrabold text-white"
                style={{ background: 'var(--bg-surface)' }}
              >
                {userInitials}
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1.5 mt-1">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 flex-wrap">
                <h1
                  className="text-2xl font-extrabold tracking-tight"
                  style={{ color: 'var(--text-on-card)' }}
                >
                  {user?.name || 'Academic User'}
                </h1>
                <span
                  className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(64,156,255,0.13)',
                    color: 'var(--accent-blue)',
                    border: '1px solid rgba(64,156,255,0.20)',
                  }}
                >
                  {roleName}
                </span>
              </div>
              <p
                className="text-[13px] font-medium flex items-center justify-center sm:justify-start gap-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Mail className="h-3.5 w-3.5" />
                {user?.email || 'user@paperpath.com'}
              </p>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex gap-2.5 shrink-0">
            <button
              onClick={() => setView('dashboard')}
              className="px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              Dashboard
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: 'rgba(255,69,58,0.12)',
                color: 'var(--accent-red)',
                border: '1px solid rgba(255,69,58,0.20)',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ── Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {METRICS.map((m, i) => (
          <div
            key={i}
            className="glass-card rounded-[22px] p-5 flex items-center gap-4 hover-lift"
            style={{ cursor: 'default' }}
          >
            <div
              className="p-3.5 rounded-2xl shrink-0"
              style={{ background: m.bg }}
            >
              <span style={{ color: `var(${m.accent})` }}>{m.icon}</span>
            </div>
            <div>
              <div
                className="text-[28px] font-extrabold leading-none mb-0.5"
                style={{ color: typeof m.value === 'string' ? `var(${m.accent})` : 'var(--text-on-card)' }}
              >
                {m.value}
              </div>
              <div className="text-[12px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {m.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content Card ── */}
      <div className="glass-card rounded-[28px] overflow-hidden" style={{ cursor: 'default' }}>
        {/* Tab bar */}
        <div
          className="p-4 flex justify-center sm:justify-start"
          style={{
            background: 'var(--bg-overlay)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center p-1 rounded-full seg-ctrl w-full sm:w-auto">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-200"
                style={
                  activeTab === tab.key
                    ? {
                        background: 'var(--tab-active-bg)',
                        color: 'var(--tab-active-text)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      }
                    : { color: 'var(--text-secondary)' }
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'upload' ? (
            <div className="space-y-5 max-w-3xl">
              <div>
                <h3
                  className="text-[17px] font-extrabold mb-1.5"
                  style={{ color: 'var(--text-on-card)' }}
                >
                  Ingest PDF / CSV Dataset into Vector Index
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Uploaded files will be securely parsed, chunked, and embedded for PaperPath AI Tutor analysis.
                </p>
              </div>
              <UploadComponent onUploadSuccess={() => window.location.reload()} />
            </div>
          ) : (
            <div className="space-y-3 max-w-xl">
              {[
                { label: 'Full Name', value: user?.name || 'Academic User' },
                { label: 'Email Address', value: user?.email || 'user@paperpath.com' },
              ].map(item => (
                <div
                  key={item.label}
                  className="p-5 rounded-2xl space-y-1"
                  style={{
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span
                    className="text-[10px] font-extrabold tracking-widest uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item.label}
                  </span>
                  <p className="font-bold text-[16px]" style={{ color: 'var(--text-on-card)' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
