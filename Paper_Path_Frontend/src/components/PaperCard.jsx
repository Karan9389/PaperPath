import React from 'react';
import { Bookmark, ExternalLink, User, Tag, BookOpen, GraduationCap } from 'lucide-react';

// Theme-aware accent pairs: text uses CSS var, bg is a safe rgba tint
const CATEGORY_MAP = {
  'Natural Language Processing': { varName: '--accent-blue',   bg: 'rgba(64,156,255,0.13)' },
  'Computer Vision':             { varName: '--accent-green',  bg: 'rgba(48,209,88,0.13)'  },
  'Generative AI':               { varName: '--accent-purple', bg: 'rgba(191,90,242,0.13)' },
  'Multimodal AI':               { varName: '--accent-orange', bg: 'rgba(255,159,10,0.13)' },
  'Reinforcement Learning':      { varName: '--accent-red',    bg: 'rgba(255,69,58,0.13)'  },
  'Deep Learning':               { varName: '--accent-blue-bright', bg: 'rgba(14,165,233,0.13)' },
  'Large Language Models':       { varName: '--accent-purple', bg: 'rgba(191,90,242,0.13)' },
  'Artificial Intelligence':     { varName: '--accent-green',  bg: 'rgba(48,209,88,0.13)'  },
  'AI Alignment':                { varName: '--accent-orange', bg: 'rgba(255,159,10,0.13)' },
  'Computational Biology':       { varName: '--accent-green',  bg: 'rgba(48,209,88,0.13)'  },
  'Graph Machine Learning':      { varName: '--accent-blue',   bg: 'rgba(64,156,255,0.13)' },
};
const DEFAULT_MAP = { varName: '--text-secondary', bg: 'var(--bg-overlay)' };

export default function PaperCard({ paper, isSaved, onOpen, onToggleSave }) {
  const level = (paper.difficultyLevel || paper.difficulty || 'beginner').toLowerCase();
  const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);
  const cat = CATEGORY_MAP[paper.category] || DEFAULT_MAP;
  const catTextColor = `var(${cat.varName})`;

  const diffBadgeClass = { beginner: 'badge-beginner', intermediate: 'badge-intermediate', advanced: 'badge-advanced' };

  return (
    <div
      onClick={onOpen}
      className="group glass-card rounded-[22px] cursor-pointer flex flex-col overflow-hidden"
    >
      {/* ── Subtle top color accent line ── */}
      <div
        className="h-[2px] w-full shrink-0 rounded-t-[22px]"
        style={{
          background: `linear-gradient(90deg, ${catTextColor} 0%, transparent 100%)`,
          opacity: 0.5,
        }}
      />

      <div className="p-5 flex-grow flex flex-col gap-3.5">

        {/* Header: badges + bookmark */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${diffBadgeClass[level] || diffBadgeClass.beginner}`}
            >
              {formattedLevel}
            </span>

            {paper.category && (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                style={{ background: cat.bg, color: catTextColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: catTextColor }} />
                {paper.category}
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(paper); }}
            className="shrink-0 p-2 rounded-full transition-all duration-200"
            style={
              isSaved
                ? { background: 'var(--accent-purple)', color: '#fff', boxShadow: '0 4px 12px rgba(191,90,242,0.40)' }
                : { background: 'var(--bg-overlay)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
            }
            title={isSaved ? 'Remove bookmark' : 'Save paper'}
          >
            <Bookmark className="h-3.5 w-3.5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Title */}
        <h3
          className="text-[16px] font-bold leading-snug transition-colors duration-200 group-hover:opacity-80"
          style={{ color: 'var(--text-on-card)' }}
        >
          {paper.title}
        </h3>

        {/* Author */}
        <p
          className="text-[12px] flex items-center gap-1.5 font-semibold"
          style={{ color: 'var(--text-secondary)' }}
        >
          <User className="h-3.5 w-3.5 shrink-0" style={{ color: catTextColor }} />
          <span className="truncate">
            {(!paper.authors || paper.authors === 'Unknown Author')
              ? 'Academic Research Consortium'
              : paper.authors}
          </span>
        </p>

        {/* Abstract */}
        <p
          className="text-[13px] line-clamp-3 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {paper.abstract}
        </p>

        {/* Tags */}
        {(paper.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {paper.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1"
                style={{
                  background: 'var(--bg-overlay)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <Tag className="h-2.5 w-2.5 opacity-50" />{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div
        className="px-5 py-3.5 flex items-center justify-between gap-3 transition-colors duration-200"
        style={{
          background: 'var(--bg-overlay)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <span
          className="text-[11px] font-semibold flex items-center gap-1.5 transition-colors duration-200 group-hover:opacity-100"
          style={{ color: 'var(--text-muted)' }}
        >
          <BookOpen className="h-3.5 w-3.5 shrink-0" style={{ color: catTextColor }} />
          Inspect &amp; Ask AI
        </span>

        <div className="flex items-center gap-2">
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-all hover:opacity-80"
              style={{ color: catTextColor, background: cat.bg }}
              title="View PDF"
            >
              <ExternalLink className="h-3 w-3" /> PDF
            </a>
          )}
          <a
            href={`https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-all hover:opacity-80"
            style={{ background: 'var(--scholar-bg)', color: 'var(--scholar-text)' }}
            title="Google Scholar"
          >
            <GraduationCap className="h-3 w-3" /> Scholar
          </a>
        </div>
      </div>
    </div>
  );
}
