import React, { useState } from 'react';
import { Bookmark, Bot, Cpu, Filter, History, Library, Loader2, MessageSquare, Plus, Search, Sparkles, Terminal, Zap, GitPullRequest, Folder, ShieldCheck, ArrowRight } from 'lucide-react';
import PaperCard from './PaperCard';

export default function DashboardView({ papers, savedPapers, readHistory, isLoading, onOpenPaper, onToggleSave }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [feedTab, setFeedTab] = useState('all'); // 'all' | 'saved' | 'history'

  const activeBaseList = feedTab === 'saved' ? savedPapers : feedTab === 'history' ? readHistory : papers;

  const displayedPapers = activeBaseList.filter((paper) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      paper.title?.toLowerCase().includes(query) ||
      paper.abstract?.toLowerCase().includes(query) ||
      paper.authors?.toLowerCase().includes(query) ||
      paper.category?.toLowerCase().includes(query);

    const paperDiff = (paper.difficultyLevel || paper.difficulty || 'beginner').toLowerCase();
    const matchesDifficulty = difficultyFilter === 'all' || paperDiff === difficultyFilter.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#3fb950]" />
        <p className="text-xs font-mono text-[#848d96] animate-pulse">Initializing PaperPath Gemini Vector Index...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 🐙 3-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- LEFT SIDEBAR: TOP SAVED PAPERS & RECENT READING (3 cols) --- */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Saved Papers */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center pb-2.5 border-b border-[#30363d]">
              <span className="text-xs font-bold text-[#f0f6fc] flex items-center">
                <Bookmark className="h-3.5 w-3.5 mr-1.5 text-[#3fb950]" /> Saved Papers
              </span>
              <span className="text-[10px] font-mono text-[#3fb950] bg-[#238636]/20 px-2 py-0.5 rounded-full border border-[#238636]/40">
                {savedPapers.length}
              </span>
            </div>

            {savedPapers.length > 0 ? (
              <div className="space-y-1.5">
                {savedPapers.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    onClick={() => onOpenPaper(p)}
                    className="flex items-center space-x-2 text-xs text-[#c9d1d9] hover:text-[#58a6ff] cursor-pointer p-2 rounded-lg hover:bg-[#21262d]/80 transition-colors group"
                  >
                    <Folder className="h-3.5 w-3.5 text-[#848d96] group-hover:text-[#58a6ff] shrink-0" />
                    <span className="truncate font-medium">{p.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#848d96] italic py-2">No saved papers yet. Click bookmark to save.</p>
            )}
          </div>

          {/* Reading History */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center pb-2.5 border-b border-[#30363d]">
              <span className="text-xs font-bold text-[#f0f6fc] flex items-center">
                <History className="h-3.5 w-3.5 mr-1.5 text-[#a371f7]" /> Recent Reading
              </span>
              <span className="text-[10px] font-mono text-[#d2a8ff] bg-[#a371f7]/20 px-2 py-0.5 rounded-full border border-[#8957e5]/40">
                {readHistory.length}
              </span>
            </div>

            {readHistory.length > 0 ? (
              <div className="space-y-1.5">
                {readHistory.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    onClick={() => onOpenPaper(p)}
                    className="flex items-center space-x-2 text-xs text-[#c9d1d9] hover:text-[#58a6ff] cursor-pointer p-2 rounded-lg hover:bg-[#21262d]/80 transition-colors group"
                  >
                    <GitPullRequest className="h-3.5 w-3.5 text-[#3fb950] shrink-0" />
                    <span className="truncate font-medium">{p.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#848d96] italic py-2">No recent papers opened.</p>
            )}
          </div>
        </div>

        {/* --- CENTER FEED: COPILOT PROMPT & PAPER FEED (6 cols) --- */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 🤖 HERO COPILOT PROMPT CARD */}
          <div className="glass-card rounded-xl p-5 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-[#58a6ff]" />
                <h2 className="text-base font-extrabold text-[#f0f6fc]">Academic Copilot Search</h2>
              </div>
              <span className="text-[10px] font-mono text-[#3fb950] bg-[#238636]/20 px-2.5 py-0.5 rounded-full border border-[#238636]/40 flex items-center glow-emerald">
                <span className="w-1.5 h-1.5 bg-[#3fb950] rounded-full mr-1.5 animate-pulse"></span> Active
              </span>
            </div>

            {/* Input Box */}
            <div className="bg-[#0d1117]/90 border border-[#30363d] focus-within:border-[#58a6ff] rounded-lg p-3.5 space-y-3 transition-colors shadow-inner">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-[#58a6ff] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask anything or filter research papers by title, topic, author..."
                  className="w-full bg-transparent text-xs text-[#f0f6fc] placeholder-[#848d96] outline-none font-sans"
                />
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#30363d]/60">
                <button className="flex items-center px-3 py-1 bg-[#21262d] border border-[#30363d] rounded-md text-[11px] font-medium text-[#c9d1d9] hover:bg-[#30363d] hover:text-[#f0f6fc] transition-all">
                  <MessageSquare className="h-3 w-3 mr-1.5 text-[#58a6ff]" /> Ask Gemini AI
                </button>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="bg-[#21262d] border border-[#30363d] rounded-md text-[11px] font-medium text-[#c9d1d9] px-2.5 py-1 outline-none cursor-pointer hover:border-[#58a6ff] transition-all"
                >
                  <option value="all">All Difficulty Levels</option>
                  <option value="beginner">Beginner Level</option>
                  <option value="intermediate">Intermediate Level</option>
                  <option value="advanced">Advanced Level</option>
                </select>
                <span className="text-[11px] text-[#848d96] ml-auto font-mono">{displayedPapers.length} research papers</span>
              </div>
            </div>
          </div>

          {/* PAPER CARDS FEED WITH TAB FILTER */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <div className="flex items-center space-x-1.5 bg-[#161b22]/90 p-1 rounded-lg border border-[#30363d]">
                <button
                  onClick={() => setFeedTab('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    feedTab === 'all' ? 'bg-[#21262d] text-[#f0f6fc] shadow-sm' : 'text-[#848d96] hover:text-[#c9d1d9]'
                  }`}
                >
                  Feed ({papers.length})
                </button>
                <button
                  onClick={() => setFeedTab('saved')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    feedTab === 'saved' ? 'bg-[#21262d] text-[#f0f6fc] shadow-sm' : 'text-[#848d96] hover:text-[#c9d1d9]'
                  }`}
                >
                  Bookmarks ({savedPapers.length})
                </button>
                <button
                  onClick={() => setFeedTab('history')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    feedTab === 'history' ? 'bg-[#21262d] text-[#f0f6fc] shadow-sm' : 'text-[#848d96] hover:text-[#c9d1d9]'
                  }`}
                >
                  History ({readHistory.length})
                </button>
              </div>
            </div>

            {/* Paper Cards List */}
            {displayedPapers.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {displayedPapers.map((paper) => (
                  <PaperCard
                    key={paper._id}
                    paper={paper}
                    isSaved={savedPapers.some((s) => s._id === paper._id)}
                    onOpen={() => onOpenPaper(paper)}
                    onToggleSave={() => onToggleSave(paper)}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-8 text-center space-y-3">
                <Library className="h-8 w-8 text-[#848d96] mx-auto opacity-50" />
                <p className="text-xs text-[#848d96]">No papers found matching your search filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT SIDEBAR: AI TUTOR STATUS & CHANGELOG (3 cols) --- */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#30363d]">
              <Cpu className="h-4 w-4 text-[#3fb950]" />
              <h3 className="text-xs font-bold text-[#f0f6fc] uppercase tracking-wider">PAPERPATH AI ENGINE</h3>
            </div>
            
            <div className="space-y-2 text-xs text-[#848d96]">
              <div className="flex justify-between items-center py-1 border-b border-[#30363d]/40">
                <span>LLM Model:</span>
                <span className="font-mono text-[#3fb950] font-semibold">Gemini Flash</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#30363d]/40">
                <span>Embedding API:</span>
                <span className="font-mono text-[#58a6ff] font-semibold">Gemini Embed-001</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Vector RAG:</span>
                <span className="font-mono text-[#a371f7] font-semibold">Active</span>
              </div>
            </div>
          </div>

          {/* Changelog */}
          <div className="glass-card rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#f0f6fc] uppercase tracking-wider pb-2 border-b border-[#30363d]">
              System Status
            </h3>
            <p className="text-xs text-[#c9d1d9] leading-relaxed">
              Google Gemini API is active for both paper vector embeddings and instant AI tutor responses.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}