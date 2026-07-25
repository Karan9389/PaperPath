import React from 'react';
import { Bookmark, ChevronRight, GitPullRequest, Sparkles, User, Tag } from 'lucide-react';

export default function PaperCard({ paper, isSaved, onOpen, onToggleSave }) {
  const level = paper.difficultyLevel || paper.difficulty || 'beginner';
  const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);

  const diffColors = {
    Beginner: 'bg-[#238636]/20 text-[#3fb950] border-[#238636]/40',
    Intermediate: 'bg-[#a371f7]/20 text-[#d2a8ff] border-[#8957e5]/40',
    Advanced: 'bg-[#da3633]/20 text-[#f85149] border-[#da3633]/40',
  };

  return (
    <div
      onClick={onOpen}
      className="group bg-[#161b22] rounded-lg border border-[#30363d] hover:border-[#8b949e] transition-all duration-200 cursor-pointer flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md"
    >
      <div className="p-5 flex-grow flex flex-col space-y-3">
        {/* Header row: Status badge + Category + Save bookmark */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${diffColors[formattedLevel] || diffColors.Beginner}`}>
              {formattedLevel}
            </span>
            {paper.category && (
              <span className="text-[10px] font-medium text-[#848d96] bg-[#21262d] border border-[#30363d] px-2 py-0.5 rounded-md">
                {paper.category}
              </span>
            )}
          </div>
          <button
            onClick={onToggleSave}
            className={`p-1.5 rounded-md transition-all ${
              isSaved
                ? 'bg-[#a371f7]/20 text-[#d2a8ff] border border-[#8957e5]/40'
                : 'text-[#848d96] hover:text-[#f0f6fc] hover:bg-[#21262d]'
            }`}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Paper Title */}
        <h3 className="text-sm font-bold text-[#f0f6fc] line-clamp-2 leading-snug group-hover:text-[#58a6ff] transition-colors">
          {paper.title}
        </h3>

        {/* Author Line */}
        {paper.authors && (
          <p className="text-xs text-[#848d96] flex items-center">
            <User className="h-3 w-3 mr-1.5 text-[#848d96] shrink-0" />
            <span className="truncate">{paper.authors}</span>
          </p>
        )}

        {/* Abstract Snippet */}
        <p className="text-xs text-[#848d96] line-clamp-3 leading-relaxed font-normal">
          {paper.abstract}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {(paper.tags || []).map((tag, index) => (
            <span key={index} className="text-[10px] font-medium bg-[#21262d] text-[#c9d1d9] px-2 py-0.5 rounded border border-[#30363d] flex items-center">
              <Tag className="h-2.5 w-2.5 mr-1 text-[#848d96]" /> {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-2.5 bg-[#010409]/60 border-t border-[#30363d] flex items-center justify-between group-hover:bg-[#21262d] transition-colors">
        <span className="text-xs font-semibold text-[#58a6ff] group-hover:text-[#79c0ff] flex items-center">
          <GitPullRequest className="h-3.5 w-3.5 mr-1.5 text-[#3fb950]" /> Inspect Paper
        </span>
        
        <a
          href={`https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] font-bold text-[#3fb950] bg-[#238636]/15 px-2 py-0.5 rounded border border-[#238636]/30 hover:bg-[#238636]/30 transition-colors"
          title="Search on Google Scholar"
        >
          🎓 Scholar
        </a>
      </div>
    </div>
  );
}



