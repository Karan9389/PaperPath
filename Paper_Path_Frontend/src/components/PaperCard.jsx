import React from 'react';
import { Bookmark, ExternalLink, GitPullRequest, Sparkles, User, Tag, BookOpen, GraduationCap } from 'lucide-react';

export default function PaperCard({ paper, isSaved, onOpen, onToggleSave }) {
  const level = (paper.difficultyLevel || paper.difficulty || 'beginner').toLowerCase();
  const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);

  const diffBadgeStyles = {
    beginner: 'badge-beginner',
    intermediate: 'badge-intermediate',
    advanced: 'badge-advanced',
  };

  return (
    <div
      onClick={onOpen}
      className="group glass-card rounded-xl border border-[#30363d] cursor-pointer flex flex-col h-full overflow-hidden relative"
    >
      {/* Top Subtle Gradient Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#238636] via-[#3fb950] to-[#58a6ff] opacity-80 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 flex-grow flex flex-col space-y-3.5">
        {/* Header row: Difficulty Badge + Category + Save Bookmark */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${diffBadgeStyles[level] || diffBadgeStyles.beginner}`}>
              {formattedLevel}
            </span>
            {paper.category && (
              <span className="text-[10px] font-semibold text-[#848d96] bg-[#21262d]/80 border border-[#30363d] px-2 py-0.5 rounded-md backdrop-blur-sm">
                {paper.category}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(e);
            }}
            className={`p-1.5 rounded-lg transition-all ${
              isSaved
                ? 'bg-[#a371f7]/20 text-[#d2a8ff] border border-[#8957e5]/50 glow-indigo'
                : 'text-[#848d96] hover:text-[#f0f6fc] hover:bg-[#21262d]'
            }`}
            title={isSaved ? "Remove bookmark" : "Save paper"}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Paper Title */}
        <h3 className="text-sm font-bold text-[#f0f6fc] line-clamp-2 leading-snug group-hover:text-[#58a6ff] transition-colors">
          {paper.title}
        </h3>

        {/* Author Line */}
        <p className="text-xs text-[#848d96] flex items-center">
          <User className="h-3 w-3 mr-1.5 text-[#58a6ff] shrink-0" />
          <span className="truncate">
            {(!paper.authors || paper.authors === 'Unknown Author') ? 'Academic Research Consortium' : paper.authors}
          </span>
        </p>

        {/* Abstract Snippet */}
        <p className="text-xs text-[#848d96] line-clamp-3 leading-relaxed font-normal">
          {paper.abstract}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {(paper.tags || []).map((tag, index) => (
            <span key={index} className="text-[10px] font-medium bg-[#21262d]/90 text-[#c9d1d9] px-2 py-0.5 rounded-md border border-[#30363d] flex items-center">
              <Tag className="h-2.5 w-2.5 mr-1 text-[#848d96]" /> {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3 bg-[#0d1117]/80 border-t border-[#30363d]/80 flex items-center justify-between group-hover:bg-[#161b22] transition-colors">
        <span className="text-xs font-semibold text-[#58a6ff] group-hover:text-[#79c0ff] flex items-center">
          <BookOpen className="h-3.5 w-3.5 mr-1.5 text-[#3fb950]" /> Inspect & Ask AI
        </span>

        <a
          href={`https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] font-bold text-[#3fb950] bg-[#238636]/15 px-2.5 py-1 rounded-md border border-[#238636]/40 hover:bg-[#238636]/30 transition-colors flex items-center"
          title="Search on Google Scholar"
        >
          <GraduationCap className="h-3 w-3 mr-1" /> Scholar
        </a>
      </div>
    </div>
  );
}
