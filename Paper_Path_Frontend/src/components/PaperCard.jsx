import React from 'react';
import { Bookmark, ChevronRight } from 'lucide-react';

export default function PaperCard({ paper, isSaved, onOpen, onToggleSave }) {
  const diffColors = {
    Beginner: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Intermediate: 'bg-amber-100 text-amber-800 border-amber-200',
    Advanced: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <div
      onClick={onOpen}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${diffColors[paper.difficultyLevel] || diffColors.Beginner}`}>
            {paper.difficultyLevel}
          </span>
          <button
            onClick={onToggleSave}
            className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors ${isSaved ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Bookmark className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">{paper.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-3 mb-4">{paper.abstract}</p>

        <div className="flex flex-wrap gap-2 mt-auto">
         {(paper.tags || []).map((tag, index) => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between group">
        <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">Start Reading</span>
        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}
