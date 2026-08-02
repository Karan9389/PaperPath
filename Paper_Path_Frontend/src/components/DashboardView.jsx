import React, { useState } from 'react';
import {
  Bookmark, Cpu, History, Library, Search, Sparkles, ChevronDown, Layers, LayoutGrid
} from 'lucide-react';
import PaperCard from './PaperCard';

const CATEGORY_ICONS = {
  'Natural Language Processing': '💬',
  'Computer Vision': '👁️',
  'Generative AI': '🎨',
  'Multimodal AI': '🔀',
  'Reinforcement Learning': '🎮',
  'Deep Learning': '🧠',
  'Large Language Models': '📖',
  'Artificial Intelligence': '🤖',
  'AI Alignment': '⚖️',
  'Computational Biology': '🧬',
  'Graph Machine Learning': '🕸️',
};

export default function DashboardView({ papers, savedPapers, readHistory, isLoading, onOpenPaper, onToggleSave }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [feedTab, setFeedTab] = useState('all');

  const activeBaseList = feedTab === 'saved' ? savedPapers : feedTab === 'history' ? readHistory : papers;

  const displayedPapers = activeBaseList.filter((paper) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      paper.title?.toLowerCase().includes(query) ||
      paper.abstract?.toLowerCase().includes(query) ||
      paper.authors?.toLowerCase().includes(query) ||
      paper.category?.toLowerCase().includes(query) ||
      paper.tags?.some(t => t.toLowerCase().includes(query));

    const paperDiff = (paper.difficultyLevel || paper.difficulty || 'beginner').toLowerCase();
    const matchesDifficulty = difficultyFilter === 'all' || paperDiff === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const categories = [...new Set(papers.map(p => p.category).filter(Boolean))];

  // ── Skeleton helpers ───────────────────────────────────────────────────────
  const Bone = ({ w = '100%', h = '12px', radius = '8px', style = {} }) => (
    <div className="shimmer" style={{ width: w, height: h, borderRadius: radius, flexShrink: 0, ...style }} />
  );

  const SkeletonCard = () => (
    <div className="glass-card rounded-[20px] p-5 flex flex-col gap-4 break-inside-avoid mb-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Bone w="70px" h="22px" radius="12px" />
          <Bone w="90px" h="22px" radius="12px" />
        </div>
        <Bone w="32px" h="32px" radius="16px" />
      </div>
      <div className="flex flex-col gap-2">
        <Bone w="95%" h="16px" />
        <Bone w="80%" h="16px" />
      </div>
      <Bone w="50%" h="12px" />
      <div className="flex flex-col gap-1.5 mt-1">
        <Bone w="100%" h="12px" />
        <Bone w="100%" h="12px" />
        <Bone w="70%" h="12px" />
      </div>
      <div className="flex gap-2 mt-2">
        <Bone w="60px" h="20px" radius="6px" />
        <Bone w="75px" h="20px" radius="6px" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="glass-card rounded-[32px] p-6 flex flex-col gap-4">
            <Bone w="100%" h="48px" radius="24px" />
          </div>
          <div className="columns-1 md:columns-2 xl:columns-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const TABS = [
    { key: 'all',     label: 'Feed',    icon: <LayoutGrid className="h-3.5 w-3.5" />, count: papers.length },
    { key: 'saved',   label: 'Saved',   icon: <Bookmark className="h-3.5 w-3.5" />,  count: savedPapers.length },
    { key: 'history', label: 'History', icon: <History className="h-3.5 w-3.5" />,   count: readHistory.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">

      {/* ── Hero Search Card ── */}
      <div
        className="glass-card rounded-[28px] p-6 sm:p-8 relative overflow-hidden flex flex-col gap-5"
        style={{ cursor: 'default' }}
      >
        {/* Decorative glow blobs */}
        <div
          className="absolute -top-12 -left-12 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(64,156,255,0.12) 0%, transparent 70%)',
            filter: 'blur(24px)',
          }}
        />
        <div
          className="absolute -bottom-16 -right-8 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(191,90,242,0.10) 0%, transparent 70%)',
            filter: 'blur(24px)',
          }}
        />

        {/* Header row */}
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2
            className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            <Sparkles className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--accent-blue)' }} />
            Research Explorer
          </h2>

          {/* Status row */}
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-full self-start sm:self-auto"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-1.5 border-r pr-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <Cpu className="h-3.5 w-3.5" style={{ color: 'var(--accent-green)' }} />
              <span className="text-[11px] font-bold" style={{ color: 'var(--accent-green)' }}>Gemini Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>Indexed:</span>
              <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>{papers.length} Papers</span>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <div
            className="flex items-center rounded-2xl px-5 py-3.5 transition-all duration-200"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-subtle)',
            }}
            onFocusCapture={e => {
              e.currentTarget.style.borderColor = 'var(--accent-blue)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(64,156,255,0.16)';
            }}
            onBlurCapture={e => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Search className="h-4 w-4 shrink-0 mr-3" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, topic, or tag…"
              className="w-full bg-transparent text-[15px] font-medium outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 p-1 rounded-full transition-all duration-150"
                style={{ color: 'var(--text-muted)', background: 'var(--bg-raised)' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex items-center gap-1 shrink-0 mr-1" style={{ color: 'var(--text-muted)' }}>
              <Layers className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Topics</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchQuery(cat === searchQuery ? '' : cat)}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200"
                style={{
                  background: searchQuery === cat ? 'var(--accent-blue)' : 'var(--bg-overlay)',
                  color: searchQuery === cat ? '#fff' : 'var(--text-primary)',
                  border: `1px solid ${searchQuery === cat ? 'transparent' : 'var(--border-subtle)'}`,
                }}
              >
                <span className="text-[11px]">{CATEGORY_ICONS[cat] || '📄'}</span>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Filters row */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 pt-4"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          {/* Feed tabs */}
          <div
            className="flex items-center p-1 rounded-full seg-ctrl"
            style={{ gap: '2px' }}
          >
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFeedTab(tab.key)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200"
                style={
                  feedTab === tab.key
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
                {tab.count > 0 && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{
                      background: feedTab === tab.key ? 'var(--bg-surface)' : 'var(--bg-raised)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Difficulty + count */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="select-glass appearance-none rounded-full text-[12px] font-bold pl-4 pr-8 py-2 outline-none cursor-pointer transition-all"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <ChevronDown
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
                style={{ color: 'var(--text-secondary)' }}
              />
            </div>
            <span className="text-[12px] font-bold shrink-0" style={{ color: 'var(--text-muted)' }}>
              {displayedPapers.length} result{displayedPapers.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ── Paper Grid ── */}
      {displayedPapers.length > 0 ? (
        <div className="columns-1 md:columns-2 xl:columns-3 gap-5 space-y-5 pb-12">
          {displayedPapers.map((paper) => (
            <div key={paper._id} className="break-inside-avoid">
              <PaperCard
                paper={paper}
                isSaved={savedPapers.some((s) => s._id === paper._id)}
                onOpen={() => onOpenPaper(paper)}
                onToggleSave={onToggleSave}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="glass-card rounded-[28px] p-16 text-center flex flex-col items-center justify-center max-w-xl mx-auto mt-6"
        >
          <div
            className="h-20 w-20 rounded-full flex items-center justify-center mb-5"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Library className="h-10 w-10" style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-on-card)' }}>Nothing found</h3>
          <p className="text-[14px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            {feedTab === 'saved'
              ? 'No bookmarked papers yet.'
              : feedTab === 'history'
              ? 'No reading history yet.'
              : 'Try adjusting your search or selecting a different category.'}
          </p>
        </div>
      )}
    </div>
  );
}