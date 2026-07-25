import React, { useState } from 'react';
import { Check, Copy, Sparkles } from 'lucide-react';

export default function MarkdownMessage({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to parse text into clean rendered React elements
  const renderFormattedMarkdown = (rawText) => {
    if (!rawText) return null;

    // Normalize inline spacing issues like "--- ###" into proper line splits
    const normalized = rawText
      .replace(/---\s*(###|##|#)/g, '\n\n$1')
      .replace(/([^\n])\s*(###|##|#)\s+/g, '$1\n\n$2 ')
      .replace(/([^\n])\s*(\*|\-)\s+\*\*/g, '$1\n$2 **');

    const lines = normalized.split('\n');
    const elements = [];
    let currentList = [];
    let inCodeBlock = false;
    let codeContent = [];

    const flushList = (key) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} className="space-y-1.5 my-2.5 pl-4 list-disc marker:text-[#3fb950]">
            {currentList.map((item, idx) => (
              <li key={idx} className="text-xs text-[#d0d7de] leading-relaxed">
                {formatInline(item)}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const flushCode = (key) => {
      if (codeContent.length > 0) {
        elements.push(
          <div key={`code-${key}`} className="my-3 p-3 bg-[#161b22] border border-[#30363d] rounded-lg font-mono text-[11px] text-[#58a6ff] overflow-x-auto">
            <pre>{codeContent.join('\n')}</pre>
          </div>
        );
        codeContent = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Code Block toggle
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          flushCode(idx);
          inCodeBlock = false;
        } else {
          flushList(idx);
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Empty line -> paragraph break
      if (!trimmed) {
        flushList(idx);
        return;
      }

      // Headers (###, ##, #)
      if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
        flushList(idx);
        const headerText = trimmed.replace(/^#+\s*/, '');
        elements.push(
          <h4 key={idx} className="text-xs font-bold text-[#f0f6fc] mt-4 mb-2 pb-1 border-b border-[#30363d]/60 flex items-center tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] mr-2 shrink-0"></span>
            {formatInline(headerText)}
          </h4>
        );
        return;
      }

      // Horizontal rule (---)
      if (trimmed === '---' || trimmed === '***') {
        flushList(idx);
        elements.push(<hr key={idx} className="my-3 border-[#30363d]" />);
        return;
      }

      // Blockquotes (> text)
      if (trimmed.startsWith('>')) {
        flushList(idx);
        const quoteText = trimmed.replace(/^>\s*/, '');
        elements.push(
          <blockquote key={idx} className="my-2.5 pl-3 py-1.5 border-l-2 border-[#58a6ff] bg-[#58a6ff]/10 text-xs text-[#58a6ff] italic rounded-r-md">
            {formatInline(quoteText)}
          </blockquote>
        );
        return;
      }

      // Bullet List (* item, - item, 1. item)
      if (/^(\*|-|\d+\.)\s+/.test(trimmed)) {
        const listText = trimmed.replace(/^(\*|-|\d+\.)\s+/, '');
        currentList.push(listText);
        return;
      }

      // Regular Paragraph
      flushList(idx);
      elements.push(
        <p key={idx} className="text-xs text-[#c9d1d9] leading-relaxed my-1.5">
          {formatInline(trimmed)}
        </p>
      );
    });

    flushList('final');
    flushCode('final');

    return elements;
  };

  // Helper to format inline bold, italic, code tags
  const formatInline = (text) => {
    if (!text) return '';
    const parts = [];
    // Split by inline code, bold (**text**), italic (*text*)
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    const tokens = text.split(regex);

    tokens.forEach((token, i) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={i} className="font-semibold text-[#f0f6fc] bg-[#21262d]/60 px-1 py-0.5 rounded text-[11.5px]">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
        parts.push(
          <em key={i} className="italic text-[#a371f7]">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={i} className="font-mono text-[11px] bg-[#161b22] text-[#79c0ff] px-1.5 py-0.5 rounded border border-[#30363d]">
            {token.slice(1, -1)}
          </code>
        );
      } else {
        parts.push(token);
      }
    });

    return parts;
  };

  return (
    <div className="relative group/msg">
      <div className="space-y-1 text-xs">
        {renderFormattedMarkdown(content)}
      </div>

      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover/msg:opacity-100 p-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#848d96] hover:text-[#f0f6fc] rounded border border-[#30363d] transition-all"
        title="Copy response"
      >
        {copied ? <Check className="h-3 w-3 text-[#3fb950]" /> : <Copy className="h-3 w-3" />}
      </button>
    </div>
  );
}
