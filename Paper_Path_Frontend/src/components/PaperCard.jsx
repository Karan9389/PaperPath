import React from 'react';
import { Bookmark, ExternalLink, User, Tag, BookOpen, GraduationCap, Layers } from 'lucide-react';

const CATEGORY_COLORS = {
  'Natural Language Processing': { dot: '#58a6ff', bg: 'rgba(88,166,255,0.1)', border: 'rgba(88,166,255,0.25)', text: '#79c0ff' },
  'Computer Vision':             { dot: '#3fb950', bg: 'rgba(63,185,80,0.1)',  border: 'rgba(63,185,80,0.25)',  text: '#4ade80' },
  'Generative AI':               { dot: '#a371f7', bg: 'rgba(163,113,247,0.1)',border: 'rgba(163,113,247,0.25)',text: '#c4a0ff' },
  'Multimodal AI':               { dot: '#e3b341', bg: 'rgba(227,179,65,0.1)', border: 'rgba(227,179,65,0.25)', text: '#f0cc6e' },
  'Reinforcement Learning':      { dot: '#f85149', bg: 'rgba(248,81,73,0.1)',  border: 'rgba(248,81,73,0.25)',  text: '#fc8888' },
  'Deep Learning':               { dot: '#58a6ff', bg: 'rgba(88,166,255,0.08)',border: 'rgba(88,166,255,0.2)',  text: '#79c0ff' },
  'Large Language Models':       { dot: '#a371f7', bg: 'rgba(163,113,247,0.1)',border: 'rgba(163,113,247,0.25)',text: '#c4a0ff' },
  'Artificial Intelligence':     { dot: '#3fb950', bg: 'rgba(63,185,80,0.08)', border: 'rgba(63,185,80,0.2)',   text: '#4ade80' },
  'AI Alignment':                { dot: '#e3b341', bg: 'rgba(227,179,65,0.1)', border: 'rgba(227,179,65,0.25)', text: '#f0cc6e' },
  'Computational Biology':       { dot: '#3fb950', bg: 'rgba(63,185,80,0.1)',  border: 'rgba(63,185,80,0.25)',  text: '#4ade80' },
  'Graph Machine Learning':      { dot: '#58a6ff', bg: 'rgba(88,166,255,0.1)', border: 'rgba(88,166,255,0.25)', text: '#79c0ff' },
};

const DEFAULT_COLOR = { dot: '#8b949e', bg: 'rgba(139,148,158,0.08)', border: 'rgba(139,148,158,0.2)', text: '#8b949e' };

const ACCENT_BY_LEVEL = {
  beginner:     { from: '#238636', to: '#3fb950' },
  intermediate: { from: '#1f6feb', to: '#58a6ff' },
  advanced:     { from: '#6e40c9', to: '#a371f7' },
};

export default function PaperCard({ paper, isSaved, onOpen, onToggleSave }) {
  const level = (paper.difficultyLevel || paper.difficulty || 'beginner').toLowerCase();
  const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);
  const accent = ACCENT_BY_LEVEL[level] || ACCENT_BY_LEVEL.beginner;
  const catColor = CATEGORY_COLORS[paper.category] || DEFAULT_COLOR;

  const diffBadgeClass = {
    beginner:     'badge-beginner',
    intermediate: 'badge-intermediate',
    advanced:     'badge-advanced',
  };

  return (
    <div
      onClick={onOpen}
      className="group glass-card rounded-xl cursor-pointer flex flex-col overflow-hidden relative"
    >
      {/* Top gradient accent bar based on difficulty */}
      <div
        className="h-[3px] w-full opacity-90 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to}, ${catColor.dot})` }}
      />

      <div className="p-5 flex-grow flex flex-col space-y-3">
        {/* Header: Badges + Bookmark */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Difficulty badge */}
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${diffBadgeClass[level] || diffBadgeClass.beginner}`}>
              {formattedLevel}
            </span>

            {/* Category badge with dynamic color */}
            {paper.category && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1"
                style={{ background: catColor.bg, border: `1px solid ${catColor.border}`, color: catColor.text }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: catColor.dot }} />
                {paper.category}
              </span>
            )}
          </div>

          {/* Bookmark button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(paper); }}
            className={`shrink-0 p-1.5 rounded-lg transition-all duration-200 ${
              isSaved
                ? 'bg-[#a371f7]/15 text-[#c4a0ff] border border-[#8957e5]/40 shadow-[0_0_12px_-3px_rgba(163,113,247,0.4)]'
                : 'text-[#545d68] hover:text-[#e6edf3] hover:bg-[#1c2128] border border-transparent hover:border-[#30363d]'
            }`}
            title={isSaved ? 'Remove bookmark' : 'Save paper'}
          >
            <Bookmark className="h-4 w-4 transition-transform group-hover:scale-105" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Paper Title */}
        <h3 className="text-sm font-bold text-[#e6edf3] line-clamp-2 leading-snug group-hover:text-[#79c0ff] transition-colors duration-200">
          {paper.title}
        </h3>

        {/* Author line */}
        <p className="text-xs text-[#8b949e] flex items-center gap-1.5 min-w-0">
          <User className="h-3 w-3 shrink-0" style={{ color: catColor.dot }} />
          <span className="truncate">
            {(!paper.authors || paper.authors === 'Unknown Author') ? 'Academic Research Consortium' : paper.authors}
          </span>
        </p>

        {/* Abstract snippet */}
        <p className="text-[12px] text-[#8b949e] line-clamp-3 leading-relaxed">
          {paper.abstract}
        </p>

        {/* Tags */}
        {(paper.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {paper.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-medium bg-[#1c2128] text-[#8b949e] px-2 py-0.5 rounded border border-[#30363d]/70 flex items-center gap-1 hover:border-[#58a6ff]/30 hover:text-[#c9d1d9] transition-colors"
              >
                <Tag className="h-2 w-2 text-[#545d68]" />{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 bg-[#0d1117]/70 border-t border-[#21262d] flex items-center justify-between transition-colors group-hover:bg-[#0d1117]/90">
        <span className="text-[11px] font-semibold text-[#545d68] group-hover:text-[#8b949e] flex items-center gap-1.5 transition-colors">
          <BookOpen className="h-3 w-3" style={{ color: catColor.dot }} />
          Inspect &amp; Ask AI
        </span>

        <div className="flex items-center gap-1.5">
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] font-bold px-2.5 py-0.5 rounded border flex items-center gap-1 transition-all"
              style={{
                color: catColor.text,
                background: catColor.bg,
                border: `1px solid ${catColor.border}`,
              }}
              title="View PDF"
            >
              <ExternalLink className="h-2.5 w-2.5" /> PDF
            </a>
          )}
          <a
            href={`https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] font-bold text-[#4ade80] bg-[#238636]/10 px-2.5 py-0.5 rounded border border-[#238636]/30 hover:bg-[#238636]/20 flex items-center gap-1 transition-all"
            title="Google Scholar"
          >
            <GraduationCap className="h-2.5 w-2.5" /> Scholar
          </a>
        </div>
      </div>
    </div>
  );
}
