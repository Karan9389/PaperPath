import React, { useState } from 'react';
import {
  Bookmark, Cpu, History, Library, Search, Sparkles, ChevronRight, Layers, LayoutGrid
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Spotlight-style Search Bar & Header container */}
      <div className="glass-card rounded-[32px] p-6 sm:p-8 shadow-lg relative overflow-hidden flex flex-col gap-6">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-gradient-to-b from-[rgba(10,132,255,0.05)] to-transparent pointer-events-none" />
        
        {/* Header Row: Title & AI Stats Inline */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[var(--accent-blue)]" />
            Research Explorer
          </h2>
          
          {/* Inline AI Engine Stats replacing the sidebar */}
          <div className="flex items-center gap-4 bg-[var(--bg-overlay)] px-4 py-2 rounded-full border border-[var(--border-subtle)] shadow-sm">
             <div className="flex items-center gap-1.5 border-r border-[var(--border-subtle)] pr-4">
               <Cpu className="h-4 w-4 text-[var(--accent-green)]" />
               <span className="text-[12px] font-bold text-[var(--accent-green)]">Gemini Active</span>
             </div>
             <div className="flex items-center gap-2 pr-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">Indexed:</span>
                <span className="text-[12px] font-bold text-[var(--text-primary)]">{papers.length} Papers</span>
             </div>
          </div>
        </div>

        {/* The Search Input */}
        <div className="relative z-10">
          <div className="flex items-center bg-[var(--bg-overlay)] border border-[var(--border-subtle)] focus-within:border-[var(--accent-blue)] focus-within:bg-[var(--bg-surface)] rounded-2xl px-5 py-4 transition-all shadow-inner">
            <Search className="h-5 w-5 text-[var(--text-secondary)] shrink-0 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, topic, or tag..."
              className="w-full bg-transparent text-[16px] font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">✕</button>
            )}
          </div>
        </div>

        {/* Categories Horizontal Pill List (Replaces left sidebar categories) */}
        {categories.length > 0 && (
          <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-1.5 shrink-0 px-2 text-[var(--text-secondary)]">
              <Layers className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Topics:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchQuery(cat)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)] hover:bg-[var(--bg-raised)] hover:border-[var(--border-muted)] transition-all"
              >
                <span className="text-xs">{CATEGORY_ICONS[cat] || '📄'}</span>
                <span className="text-[13px] font-semibold text-[var(--text-primary)]">{cat}</span>
              </button>
            ))}
          </div>
        )}

        {/* Filters and Tabs Row */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--border-subtle)]">
          {/* iOS Segmented Control Style Tabs */}
          <div className="flex items-center p-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
            {[
              { key: 'all',     label: `Feed`, icon: <LayoutGrid className="h-4 w-4" />, count: papers.length },
              { key: 'saved',   label: `Saved`, icon: <Bookmark className="h-4 w-4" />, count: savedPapers.length },
              { key: 'history', label: `History`, icon: <History className="h-4 w-4" />, count: readHistory.length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFeedTab(tab.key)}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                  feedTab === tab.key
                    ? 'bg-[#3a3a3c] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    feedTab === tab.key
                      ? 'bg-[var(--bg-base)] text-[var(--text-secondary)]'
                      : 'bg-[var(--bg-raised)] text-[var(--text-muted)]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="relative">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="appearance-none bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded-full text-[13px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] pl-5 pr-9 py-2.5 outline-none cursor-pointer hover:border-[var(--border-muted)] focus:border-[var(--accent-blue)] transition-all shadow-sm"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)] pointer-events-none rotate-90" />
            </div>
            <span className="text-[13px] text-[var(--text-muted)] font-bold shrink-0">
              {displayedPapers.length} result{displayedPapers.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* FULL WIDTH Paper Cards (Masonry Layout) */}
      {displayedPapers.length > 0 ? (
        <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6 pb-10">
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
        <div className="glass-card rounded-[32px] p-16 text-center flex flex-col items-center justify-center shadow-sm max-w-2xl mx-auto mt-8">
          <div className="h-20 w-20 rounded-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)] flex items-center justify-center mb-5">
            <Library className="h-10 w-10 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Nothing found</h3>
          <p className="text-[15px] font-medium text-[var(--text-secondary)]">
            {feedTab === 'saved' ? 'No bookmarked papers yet.' : feedTab === 'history' ? 'No reading history yet.' : 'Try adjusting your search query or selecting a different category.'}
          </p>
        </div>
      )}
    </div>
  );
}