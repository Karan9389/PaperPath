import React, { useState } from 'react';
import {
  Bookmark, Cpu, History, Library, MessageSquare,
  Search, Sparkles, GitPullRequest, Folder, Database,
  FlaskConical, Layers, Zap, ChevronRight
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

  // Derive unique categories for stat panel
  const categories = [...new Set(papers.map(p => p.category).filter(Boolean))];

  // ── Skeleton helpers ───────────────────────────────────────────────────────
  const Bone = ({ w = '100%', h = '12px', radius = '6px', style = {} }) => (
    <div className="shimmer" style={{ width: w, height: h, borderRadius: radius, flexShrink: 0, ...style }} />
  );

  const SkeletonCard = () => (
    <div style={{
      background: 'rgba(22,27,34,0.9)',
      border: '1px solid rgba(48,54,61,0.6)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* colour accent bar */}
      <div className="shimmer" style={{ height: '3px', width: '100%' }} />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* badges + bookmark row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Bone w="64px" h="18px" radius="99px" />
            <Bone w="110px" h="18px" radius="6px" />
          </div>
          <Bone w="28px" h="28px" radius="8px" />
        </div>
        {/* title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Bone w="92%" h="14px" />
          <Bone w="72%" h="14px" />
        </div>
        {/* author */}
        <Bone w="48%" h="11px" />
        {/* abstract */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <Bone w="100%" h="11px" />
          <Bone w="100%" h="11px" />
          <Bone w="78%" h="11px" />
        </div>
        {/* tags */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <Bone w="52px" h="18px" radius="4px" />
          <Bone w="68px" h="18px" radius="4px" />
          <Bone w="44px" h="18px" radius="4px" />
        </div>
      </div>
      {/* footer */}
      <div style={{
        padding: '10px 20px',
        borderTop: '1px solid rgba(33,38,45,0.8)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(13,17,23,0.7)',
      }}>
        <Bone w="90px" h="11px" />
        <div style={{ display: 'flex', gap: '6px' }}>
          <Bone w="42px" h="20px" radius="6px" />
          <Bone w="58px" h="20px" radius="6px" />
        </div>
      </div>
    </div>
  );

  const SkeletonSidePanel = ({ rows = 4, label }) => (
    <div style={{
      background: 'rgba(22,27,34,0.9)',
      border: '1px solid rgba(48,54,61,0.6)',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid rgba(33,38,45,0.8)' }}>
        <Bone w="80px" h="12px" />
        <Bone w="22px" h="18px" radius="99px" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bone w="14px" h="14px" radius="3px" style={{ flexShrink: 0 }} />
          <Bone w={`${60 + (i % 3) * 12}%`} h="11px" />
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Left sidebar skeleton */}
          <div className="lg:col-span-3 space-y-4">
            <SkeletonSidePanel rows={5} />
            <SkeletonSidePanel rows={4} />
            <SkeletonSidePanel rows={5} />
          </div>

          {/* Centre feed skeleton */}
          <div className="lg:col-span-6 space-y-5">
            {/* Search bar skeleton */}
            <div style={{
              background: 'rgba(22,27,34,0.9)',
              border: '1px solid rgba(48,54,61,0.6)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Bone w="130px" h="14px" />
                <Bone w="80px" h="18px" radius="99px" />
              </div>
              <Bone w="100%" h="38px" radius="8px" />
              <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                <Bone w="90px" h="26px" radius="6px" />
                <Bone w="90px" h="26px" radius="6px" />
              </div>
            </div>

            {/* Feed tab skeleton */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <Bone w="70px" h="30px" radius="8px" />
              <Bone w="70px" h="30px" radius="8px" />
              <Bone w="80px" h="30px" radius="8px" />
            </div>

            {/* Paper card skeletons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>

          {/* Right sidebar skeleton */}
          <div className="lg:col-span-3 space-y-4">
            <SkeletonSidePanel rows={4} />
            <SkeletonSidePanel rows={4} />
            <SkeletonSidePanel rows={3} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ── LEFT SIDEBAR ── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Saved Papers panel */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#21262d]">
              <span className="text-xs font-bold text-[#e6edf3] flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-[#a371f7]" />
                Bookmarked
              </span>
              <span className="text-[10px] font-mono font-bold text-[#c4a0ff] bg-[#a371f7]/10 px-2 py-0.5 rounded-full border border-[#8957e5]/30">
                {savedPapers.length}
              </span>
            </div>

            {savedPapers.length > 0 ? (
              <div className="space-y-0.5">
                {savedPapers.slice(0, 6).map((p) => (
                  <div
                    key={p._id}
                    onClick={() => onOpenPaper(p)}
                    className="flex items-center gap-2 text-[11px] text-[#8b949e] hover:text-[#e6edf3] cursor-pointer px-2 py-1.5 rounded-lg hover:bg-[#1c2128] transition-all group"
                  >
                    <Folder className="h-3 w-3 text-[#545d68] group-hover:text-[#a371f7] shrink-0 transition-colors" />
                    <span className="truncate">{p.title}</span>
                    <ChevronRight className="h-3 w-3 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#545d68]" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-[#545d68] italic py-1">Click 🔖 on any card to bookmark it.</p>
            )}
          </div>

          {/* Recent History panel */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#21262d]">
              <span className="text-xs font-bold text-[#e6edf3] flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-[#58a6ff]" />
                Recent
              </span>
              <span className="text-[10px] font-mono font-bold text-[#79c0ff] bg-[#58a6ff]/10 px-2 py-0.5 rounded-full border border-[#58a6ff]/25">
                {readHistory.length}
              </span>
            </div>

            {readHistory.length > 0 ? (
              <div className="space-y-0.5">
                {readHistory.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    onClick={() => onOpenPaper(p)}
                    className="flex items-center gap-2 text-[11px] text-[#8b949e] hover:text-[#e6edf3] cursor-pointer px-2 py-1.5 rounded-lg hover:bg-[#1c2128] transition-all group"
                  >
                    <GitPullRequest className="h-3 w-3 text-[#545d68] group-hover:text-[#58a6ff] shrink-0 transition-colors" />
                    <span className="truncate">{p.title}</span>
                    <ChevronRight className="h-3 w-3 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#545d68]" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-[#545d68] italic py-1">Open any paper to track progress.</p>
            )}
          </div>

          {/* Categories panel */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-[#21262d]">
              <Layers className="h-3.5 w-3.5 text-[#e3b341]" />
              <span className="text-xs font-bold text-[#e6edf3]">Categories</span>
            </div>
            <div className="space-y-1">
              {categories.slice(0, 7).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchQuery(cat)}
                  className="w-full flex items-center gap-2 text-[11px] text-[#8b949e] hover:text-[#e6edf3] px-2 py-1 rounded-lg hover:bg-[#1c2128] transition-all text-left group"
                >
                  <span>{CATEGORY_ICONS[cat] || '📄'}</span>
                  <span className="truncate">{cat}</span>
                  <span className="ml-auto text-[10px] text-[#545d68] group-hover:text-[#8b949e]">
                    {papers.filter(p => p.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTRE FEED ── */}
        <div className="lg:col-span-6 space-y-5">

          {/* Hero search bar */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#58a6ff]" />
                <h2 className="text-sm font-bold text-[#e6edf3]">Research Explorer</h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.25)', color: '#3fb950' }}
              >
                <span className="pulse-dot" style={{ width: 5, height: 5 }} /> Gemini Active
              </span>
            </div>

            <div className="bg-[#0d1117] border border-[#21262d] focus-within:border-[#58a6ff]/50 rounded-lg p-3 space-y-2.5 transition-colors">
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-[#58a6ff] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, topic, or tag..."
                  className="w-full bg-transparent text-xs text-[#e6edf3] placeholder-[#545d68] outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-[#545d68] hover:text-[#e6edf3] text-xs shrink-0 transition-colors">✕</button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#21262d]">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="bg-[#1c2128] border border-[#30363d] rounded-md text-[11px] font-medium text-[#8b949e] px-2.5 py-1 outline-none cursor-pointer hover:border-[#58a6ff]/40 transition-all"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <span className="text-[11px] text-[#545d68] ml-auto font-mono">
                  {displayedPapers.length} result{displayedPapers.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Feed Tabs + Cards */}
          <div className="space-y-3">
            {/* Tab switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg w-fit"
              style={{ background: 'rgba(13,17,23,0.9)', border: '1px solid rgba(48,54,61,0.6)' }}
            >
              {[
                { key: 'all',     label: `Feed`, count: papers.length },
                { key: 'saved',   label: `Saved`, count: savedPapers.length },
                { key: 'history', label: `History`, count: readHistory.length },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFeedTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
                    feedTab === tab.key
                      ? 'bg-[#1c2128] text-[#e6edf3] border border-[#30363d]/70 shadow-sm'
                      : 'text-[#8b949e] hover:text-[#c9d1d9]'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    feedTab === tab.key
                      ? 'bg-[#58a6ff]/15 text-[#79c0ff] border border-[#58a6ff]/20'
                      : 'text-[#545d68]'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Paper cards */}
            {displayedPapers.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {displayedPapers.map((paper) => (
                  <PaperCard
                    key={paper._id}
                    paper={paper}
                    isSaved={savedPapers.some((s) => s._id === paper._id)}
                    onOpen={() => onOpenPaper(paper)}
                    onToggleSave={onToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-10 text-center space-y-3">
                <Library className="h-8 w-8 text-[#30363d] mx-auto" />
                <p className="text-xs text-[#545d68]">
                  {feedTab === 'saved' ? 'No bookmarked papers yet.' : feedTab === 'history' ? 'No reading history yet.' : 'No papers match your search.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="lg:col-span-3 space-y-4">

          {/* AI Engine stats */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-[#21262d]">
              <Cpu className="h-3.5 w-3.5 text-[#3fb950]" />
              <h3 className="text-xs font-bold text-[#e6edf3] uppercase tracking-wider">AI Engine</h3>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Text Model', value: 'Gemini Flash', color: '#3fb950' },
                { label: 'Embeddings', value: 'Gemini Embed', color: '#58a6ff' },
                { label: 'RAG Pipeline', value: 'Active', color: '#a371f7' },
                { label: 'Papers Indexed', value: `${papers.length}`, color: '#e3b341' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center py-1 border-b border-[#21262d]/60 last:border-0">
                  <span className="text-[11px] text-[#8b949e]">{label}</span>
                  <span className="text-[11px] font-mono font-semibold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick tips */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-[#21262d]">
              <Zap className="h-3.5 w-3.5 text-[#e3b341]" />
              <h3 className="text-xs font-bold text-[#e6edf3]">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {[
                'Click any card to open the AI Reader',
                'Ask Gemini questions about the paper',
                'Bookmark papers to save to library',
                'Filter by difficulty or search by author',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-[#8b949e] leading-snug">
                  <span className="text-[#e3b341] font-bold shrink-0 mt-0.5">›</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Level legend */}
          <div className="glass-card rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 pb-2 border-b border-[#21262d]">
              <FlaskConical className="h-3.5 w-3.5 text-[#58a6ff]" />
              <h3 className="text-xs font-bold text-[#e6edf3]">Difficulty</h3>
            </div>
            {[
              { level: 'Beginner', color: '#4ade80', bg: 'rgba(63,185,80,0.1)', border: 'rgba(63,185,80,0.25)', desc: 'Core concepts' },
              { level: 'Intermediate', color: '#79c0ff', bg: 'rgba(88,166,255,0.1)', border: 'rgba(88,166,255,0.25)', desc: 'Applied research' },
              { level: 'Advanced', color: '#fc8888', bg: 'rgba(248,81,73,0.1)', border: 'rgba(248,81,73,0.25)', desc: 'SOTA methods' },
            ].map(({ level, color, bg, border, desc }) => (
              <div key={level} className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                  style={{ color, background: bg, border: `1px solid ${border}` }}
                >
                  {level}
                </span>
                <span className="text-[10px] text-[#545d68]">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}