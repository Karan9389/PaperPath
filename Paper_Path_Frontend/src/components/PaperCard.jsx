import React from 'react';
import { Bookmark, ExternalLink, User, Tag, BookOpen, GraduationCap } from 'lucide-react';

const CATEGORY_COLORS = {
  'Natural Language Processing': { text: 'var(--accent-blue)', bg: 'rgba(10, 132, 255, 0.15)' },
  'Computer Vision':             { text: 'var(--accent-green)', bg: 'rgba(48, 209, 88, 0.15)' },
  'Generative AI':               { text: 'var(--accent-purple)', bg: 'rgba(191, 90, 242, 0.15)' },
  'Multimodal AI':               { text: 'var(--accent-orange)', bg: 'rgba(255, 159, 10, 0.15)' },
  'Reinforcement Learning':      { text: 'var(--accent-red)', bg: 'rgba(255, 69, 58, 0.15)' },
  'Deep Learning':               { text: 'var(--accent-blue-bright)', bg: 'rgba(100, 210, 255, 0.15)' },
  'Large Language Models':       { text: 'var(--accent-purple)', bg: 'rgba(191, 90, 242, 0.15)' },
  'Artificial Intelligence':     { text: 'var(--accent-green)', bg: 'rgba(48, 209, 88, 0.15)' },
  'AI Alignment':                { text: 'var(--accent-orange)', bg: 'rgba(255, 159, 10, 0.15)' },
  'Computational Biology':       { text: 'var(--accent-green)', bg: 'rgba(48, 209, 88, 0.15)' },
  'Graph Machine Learning':      { text: 'var(--accent-blue)', bg: 'rgba(10, 132, 255, 0.15)' },
};

const DEFAULT_COLOR = { text: 'var(--text-secondary)', bg: 'rgba(235, 235, 245, 0.1)' };

export default function PaperCard({ paper, isSaved, onOpen, onToggleSave }) {
  const level = (paper.difficultyLevel || paper.difficulty || 'beginner').toLowerCase();
  const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);
  const catColor = CATEGORY_COLORS[paper.category] || DEFAULT_COLOR;

  const diffBadgeClass = {
    beginner:     'badge-beginner',
    intermediate: 'badge-intermediate',
    advanced:     'badge-advanced',
  };

  return (
    <div
      onClick={onOpen}
      className="group glass-card rounded-[24px] cursor-pointer flex flex-col overflow-hidden relative transition-all"
    >
      <div className="p-6 flex-grow flex flex-col space-y-4">
        {/* Header: Badges + Bookmark */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Difficulty badge */}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${diffBadgeClass[level] || diffBadgeClass.beginner}`}>
              {formattedLevel}
            </span>

            {/* Category badge */}
            {paper.category && (
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                style={{ background: catColor.bg, color: catColor.text }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: catColor.text }} />
                {paper.category}
              </span>
            )}
          </div>

          {/* Bookmark button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(paper); }}
            className={`shrink-0 p-2 rounded-full transition-all duration-200 ${
              isSaved
                ? 'bg-[var(--accent-purple)] text-white shadow-md'
                : 'bg-[var(--bg-overlay)] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:text-white border border-[var(--border-subtle)]'
            }`}
            title={isSaved ? 'Remove bookmark' : 'Save paper'}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Paper Title */}
        <h3 className="text-[17px] font-bold text-white leading-snug group-hover:text-[var(--accent-blue)] transition-colors duration-200">
          {paper.title}
        </h3>

        {/* Author line */}
        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 font-medium">
          <User className="h-3.5 w-3.5 shrink-0" style={{ color: catColor.text }} />
          <span className="truncate">
            {(!paper.authors || paper.authors === 'Unknown Author') ? 'Academic Research Consortium' : paper.authors}
          </span>
        </p>

        {/* Abstract snippet */}
        <p className="text-[13px] text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
          {paper.abstract}
        </p>

        {/* Tags */}
        {(paper.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {paper.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-[var(--bg-overlay)] text-[var(--text-secondary)] px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
              >
                <Tag className="h-2.5 w-2.5 opacity-60" />{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[var(--bg-overlay)] border-t border-[var(--border-subtle)] flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 group-hover:text-white transition-colors">
          <BookOpen className="h-4 w-4" style={{ color: catColor.text }} />
          Inspect & Ask AI
        </span>

        <div className="flex items-center gap-2">
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all hover:brightness-110"
              style={{
                color: catColor.text,
                background: catColor.bg,
              }}
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
            className="text-xs font-bold text-black bg-[var(--text-primary)] hover:bg-[#e0e0e0] px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
            title="Google Scholar"
          >
            <GraduationCap className="h-3 w-3" /> Scholar
          </a>
        </div>
      </div>
    </div>
  );
}
