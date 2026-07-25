import React, { useState } from 'react';
import { Bookmark, Bot, Cpu, Filter, History, Library, Loader2, MessageSquare, Plus, Search, Sparkles, Terminal, Zap, GitPullRequest, Folder, ShieldCheck } from 'lucide-react';
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
      <div className="flex flex-col justify-center items-center h-96 space-y-4 bg-[#0d1117]">
        <Loader2 className="h-8 w-8 animate-spin text-[#3fb950]" />
        <p className="text-xs font-mono text-[#848d96] animate-pulse">Initializing PaperPath AI Vector Index...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 🐙 GITHUB 3-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- LEFT SIDEBAR: TOP PAPERS & HISTORY (3 cols) --- */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Saved Papers (GitHub Top Repositories style) */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#30363d]">
              <span className="text-xs font-bold text-[#f0f6fc] flex items-center">
                <Bookmark className="h-3.5 w-3.5 mr-1.5 text-[#3fb950]" /> Top Saved Papers
              </span>
              <span className="text-[10px] font-mono text-[#848d96] bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d]">
                {savedPapers.length}
              </span>
            </div>

            {savedPapers.length > 0 ? (
              <div className="space-y-2">
                {savedPapers.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    onClick={() => onOpenPaper(p)}
                    className="flex items-center space-x-2 text-xs text-[#c9d1d9] hover:text-[#58a6ff] cursor-pointer p-1.5 rounded hover:bg-[#21262d] transition-colors group"
                  >
                    <Folder className="h-3.5 w-3.5 text-[#848d96] group-hover:text-[#58a6ff] shrink-0" />
                    <span className="truncate font-medium">{p.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#848d96] italic py-2">No saved papers yet.</p>
            )}
          </div>

          {/* Reading History */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#30363d]">
              <span className="text-xs font-bold text-[#f0f6fc] flex items-center">
                <History className="h-3.5 w-3.5 mr-1.5 text-[#a371f7]" /> Recent Reading
              </span>
              <span className="text-[10px] font-mono text-[#848d96] bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d]">
                {readHistory.length}
              </span>
            </div>

            {readHistory.length > 0 ? (
              <div className="space-y-2">
                {readHistory.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    onClick={() => onOpenPaper(p)}
                    className="flex items-center space-x-2 text-xs text-[#c9d1d9] hover:text-[#58a6ff] cursor-pointer p-1.5 rounded hover:bg-[#21262d] transition-colors group"
                  >
                    <GitPullRequest className="h-3.5 w-3.5 text-[#3fb950] shrink-0" />
                    <span className="truncate font-medium">{p.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#848d96] italic py-2">No recent papers read.</p>
            )}
          </div>
        </div>

        {/* --- CENTER FEED: COPILOT PROMPT & PAPER FEED (6 cols) --- */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 🤖 GITHUB COPILOT PROMPT BOX (Inspired by Reference Image 3) */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#f0f6fc]">Home</h2>
              <span className="text-[10px] font-mono text-[#3fb950] bg-[#238636]/20 px-2 py-0.5 rounded-full border border-[#238636]/40 flex items-center">
                <span className="w-1.5 h-1.5 bg-[#3fb950] rounded-full mr-1.5 animate-pulse"></span> Copilot Active
              </span>
            </div>

            {/* Input Box */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-3 space-y-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask anything or type @ to filter research papers..."
                className="w-full bg-transparent text-xs text-[#f0f6fc] placeholder-[#848d96] outline-none font-sans"
              />

              {/* Action Buttons Row (GitHub Style) */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#30363d]/60">
                <button className="flex items-center px-2.5 py-1 bg-[#21262d] border border-[#30363d] rounded text-[11px] font-medium text-[#c9d1d9] hover:bg-[#30363d]">
                  <MessageSquare className="h-3 w-3 mr-1 text-[#58a6ff]" /> Ask AI
                </button>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="bg-[#21262d] border border-[#30363d] rounded text-[11px] font-medium text-[#c9d1d9] px-2 py-1 outline-none"
                >
                  <option value="all">All Difficulty Levels</option>
                  <option value="beginner">Beginner Level</option>
                  <option value="intermediate">Intermediate Level</option>
                  <option value="advanced">Advanced Level</option>
                </select>
                <span className="text-[11px] text-[#848d96] ml-auto font-mono">{displayedPapers.length} results</span>
              </div>
            </div>
          </div>

          {/* PAPER CARDS FEED WITH TAB FILTER */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
              <div className="flex items-center space-x-1 bg-[#161b22] p-1 rounded-md border border-[#30363d]">
                <button
                  onClick={() => setFeedTab('all')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center ${
                    feedTab === 'all' ? 'bg-[#21262d] text-[#f0f6fc]' : 'text-[#848d96] hover:text-[#c9d1d9]'
                  }`}
                >
                  <Sparkles className="h-3 w-3 mr-1 text-[#58a6ff]" /> Feed ({papers.length})
                </button>
                <button
                  onClick={() => setFeedTab('saved')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center ${
                    feedTab === 'saved' ? 'bg-[#21262d] text-[#f0f6fc]' : 'text-[#848d96] hover:text-[#c9d1d9]'
                  }`}
                >
                  <Bookmark className="h-3 w-3 mr-1 text-[#3fb950]" /> Bookmarks ({savedPapers.length})
                </button>
                <button
                  onClick={() => setFeedTab('history')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center ${
                    feedTab === 'history' ? 'bg-[#21262d] text-[#f0f6fc]' : 'text-[#848d96] hover:text-[#c9d1d9]'
                  }`}
                >
                  <History className="h-3 w-3 mr-1 text-[#a371f7]" /> History ({readHistory.length})
                </button>
              </div>
            </div>

            {displayedPapers.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {displayedPapers.map((paper) => (
                  <PaperCard
                    key={paper._id}
                    paper={paper}
                    isSaved={!!savedPapers.find((savedPaper) => savedPaper._id === paper._id)}
                    onOpen={() => onOpenPaper(paper)}
                    onToggleSave={(e) => onToggleSave(paper._id, e)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-lg text-center space-y-2">
                <p className="text-sm font-bold text-[#f0f6fc]">
                  {feedTab === 'saved' ? 'No Saved Papers Yet' : feedTab === 'history' ? 'No History Yet' : 'No Papers Found'}
                </p>
                <p className="text-xs text-[#848d96]">
                  {feedTab === 'saved'
                    ? 'Bookmark interesting papers from the feed to view them here!'
                    : 'Try adjusting your search query.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT SIDEBAR: PROMOS & CHANGELOG (3 cols) --- */}
        <div className="lg:col-span-3 space-y-6">
          {/* GitHub Universe Promo Box (Matching Image 3) */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black tracking-wider text-[#a371f7] uppercase">PAPERPATH AI</span>
              <span className="text-[10px] text-[#848d96]">v2.5</span>
            </div>
            <p className="text-xs font-bold text-[#f0f6fc]">AI Tutor & Dual RAG Pipeline</p>
            <p className="text-[11px] text-[#848d96] leading-relaxed">
              Powered by Google Gemini 2.5 Flash & Local Ollama Qwen2.5 for local paper vector analysis.
            </p>
          </div>

          {/* Latest Changelog Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-bold text-[#f0f6fc] border-b border-[#30363d] pb-2">Latest from Changelog</h4>
            <div className="space-y-2 text-xs">
              <p className="text-[#848d96] text-[10px]">18 hours ago</p>
              <p className="text-[#c9d1d9] font-medium hover:text-[#58a6ff] cursor-pointer">
                Gemini 2.5 Flash is now active in PaperPath AI Tutor
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}