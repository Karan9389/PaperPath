import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, Bookmark, Bot, ExternalLink, FileText, Send, Sparkles, User, Tag, Zap, GitPullRequest, GraduationCap, Maximize2, FileCheck, Search } from 'lucide-react';
import { chatService, paperService } from '../services/api';

export default function ReaderView({ paper, isSaved = false, onToggleSave, onBack }) {
  const [paperDetails, setPaperDetails] = useState(paper);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [viewMode, setViewMode] = useState('pdf'); // 'pdf' | 'text'
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: `PaperPath AI Tutor is ready. Ask any question about "${paper.title}"!` },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "Summarize key contribution",
    "Explain methodology simply",
    "What equations were used?"
  ];

  useEffect(() => {
    const loadFullPaper = async () => {
      if (paper._id && (!paper.content && !paper.chunks?.length)) {
        setIsLoadingDetails(true);
        try {
          const fullPaper = await paperService.getById(paper._id);
          if (fullPaper) {
            setPaperDetails((prev) => ({ ...prev, ...fullPaper }));
          }
        } catch (err) {
          console.error("Could not fetch full paper details:", err);
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };
    loadFullPaper();
  }, [paper._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendQuery = async (queryText) => {
    if (!queryText.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: queryText }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const aiReply = await chatService.askQuestion({ paperId: paper._id, prompt: queryText });
      setMessages((prev) => [...prev, { role: 'ai', text: aiReply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'I could not answer that right now. Please try again in a moment.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendQuery(chatInput);
  };

  const currentDiff = paperDetails.difficultyLevel || paperDetails.difficulty || 'Intermediate';
  const authors = paperDetails.authors || 'Unknown Author';
  const category = paperDetails.category || 'General';

  // Smart PDF URL resolver
  const getPdfUrl = () => {
    if (paperDetails.pdfUrl) return paperDetails.pdfUrl;
    const titleLower = (paperDetails.title || '').toLowerCase();
    if (titleLower.includes('attention is all you need')) return 'https://arxiv.org/pdf/1706.03762.pdf';
    if (titleLower.includes('bert')) return 'https://arxiv.org/pdf/1810.04805.pdf';
    if (titleLower.includes('resnet') || titleLower.includes('deep residual')) return 'https://arxiv.org/pdf/1512.03385.pdf';
    if (titleLower.includes('gpt-3') || titleLower.includes('language models are few-shot')) return 'https://arxiv.org/pdf/2005.14165.pdf';
    return null;
  };

  const rawPdfUrl = getPdfUrl();

  // If PDF URL is external (e.g. ArXiv), route through backend PDF proxy; fallback to /render-pdf endpoint so PDF iframe ALWAYS loads!
  const getEmbedPdfUrl = () => {
    if (rawPdfUrl) {
      if (rawPdfUrl.startsWith('http://localhost:3001/uploads') || rawPdfUrl.startsWith('/uploads')) {
        return rawPdfUrl;
      }
      return `http://localhost:3001/api/papers/proxy-pdf?url=${encodeURIComponent(rawPdfUrl)}`;
    }
    if (paperDetails._id) {
      return `http://localhost:3001/api/papers/${paperDetails._id}/render-pdf`;
    }
    return null;
  };

  const embedPdfUrl = getEmbedPdfUrl();
  const googleScholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(paperDetails.title || '')}`;
  const arxivSearchUrl = `https://arxiv.org/search/?query=${encodeURIComponent(paperDetails.title || '')}&searchtype=title`;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col md:flex-row bg-[#0d1117] overflow-hidden">
      {/* 📖 LEFT COLUMN: REAL PDF VIEWER & PAPER CONTENT */}
      <div className="flex-1 md:w-2/3 border-r border-[#30363d] bg-[#0d1117] flex flex-col h-full overflow-hidden">
        
        {/* Paper Sub-Header Bar with View Mode Switcher */}
        <div className="h-12 border-b border-[#30363d] flex items-center px-4 justify-between shrink-0 bg-[#010409]">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="flex items-center text-xs font-semibold text-[#848d96] hover:text-[#58a6ff] transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1 group-hover:-translate-x-1 transition-transform" /> BACK
            </button>

            {/* View Mode Toggle Pills */}
            <div className="flex bg-[#161b22] p-0.5 rounded border border-[#30363d]">
              <button
                onClick={() => setViewMode('pdf')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center transition-colors ${
                  viewMode === 'pdf' ? 'bg-[#238636] text-white' : 'text-[#848d96] hover:text-[#f0f6fc]'
                }`}
              >
                <FileCheck className="h-3 w-3 mr-1" /> Real PDF Document
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center transition-colors ${
                  viewMode === 'text' ? 'bg-[#238636] text-white' : 'text-[#848d96] hover:text-[#f0f6fc]'
                }`}
              >
                <FileText className="h-3 w-3 mr-1" /> Parsed Summary
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Bookmark / Save Paper Button in Reader */}
            {onToggleSave && (
              <button
                onClick={onToggleSave}
                className={`flex items-center text-[11px] font-bold px-2.5 py-1 rounded border transition-colors ${
                  isSaved
                    ? 'bg-[#a371f7]/20 text-[#d2a8ff] border-[#8957e5]/40'
                    : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:border-[#8b949e]'
                }`}
                title={isSaved ? 'Remove from Saved Library' : 'Save Paper to Library'}
              >
                <Bookmark className="h-3.5 w-3.5 mr-1" fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Saved' : 'Save Paper'}
              </button>
            )}

            {/* Google Scholar Action Link */}
            <a
              href={googleScholarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-[11px] font-bold text-[#3fb950] bg-[#238636]/15 px-2.5 py-1 rounded border border-[#238636]/40 hover:bg-[#238636]/30 transition-colors"
              title="Search in Google Scholar"
            >
              <GraduationCap className="h-3.5 w-3.5 mr-1" /> Google Scholar
            </a>

            {rawPdfUrl && (
              <a
                href={rawPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[11px] font-semibold text-[#58a6ff] bg-[#21262d] px-2 py-1 rounded border border-[#30363d] hover:border-[#8b949e]"
                title="Open raw PDF in new tab"
              >
                <Maximize2 className="h-3 w-3 mr-1" /> Open PDF
              </a>
            )}
          </div>
        </div>

        {/* Real PDF Embedded Reader or Structured Academic Paper Canvas */}
        {viewMode === 'pdf' ? (
          embedPdfUrl ? (
            <div className="flex-1 bg-[#010409] p-2 flex flex-col h-full overflow-hidden">
              <iframe
                src={embedPdfUrl}
                className="w-full h-full border border-[#30363d] rounded bg-[#161b22]"
                title={`PDF Viewer - ${paperDetails.title}`}
              />
            </div>
          ) : (
            /* Rendered Academic PDF Document Page when no direct URL is stored */
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#0d1117]">
              <div className="max-w-3xl mx-auto bg-[#161b22] border border-[#30363d] rounded-xl p-8 shadow-2xl space-y-6">
                
                {/* Academic Paper Header */}
                <div className="border-b border-[#30363d] pb-6 space-y-3 text-center">
                  <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-[#3fb950] bg-[#238636]/20 border border-[#238636]/40 px-2.5 py-0.5 rounded-full">
                    ACADEMIC RESEARCH PAPER • {category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc] leading-snug">
                    {paperDetails.title}
                  </h1>
                  <p className="text-xs text-[#848d96] font-medium flex items-center justify-center space-x-1">
                    <User className="h-3.5 w-3.5 text-[#58a6ff] mr-1" />
                    <span>By {authors}</span>
                  </p>
                </div>

                {/* Direct Google Scholar & ArXiv Lookup Banner */}
                <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs space-y-0.5 text-center sm:text-left">
                    <span className="font-bold text-[#f0f6fc]">Original Published Document</span>
                    <p className="text-[#848d96]">Search published PDF copies across Google Scholar & ArXiv databases.</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={googleScholarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs rounded-md transition-colors flex items-center"
                    >
                      <GraduationCap className="h-3.5 w-3.5 mr-1" /> Google Scholar
                    </a>
                    <a
                      href={arxivSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] text-[#58a6ff] hover:text-[#79c0ff] font-bold text-xs rounded-md transition-colors flex items-center"
                    >
                      <Search className="h-3.5 w-3.5 mr-1" /> Search ArXiv
                    </a>
                  </div>
                </div>

                {/* Abstract Section */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#3fb950] uppercase tracking-wider font-mono">Abstract</h3>
                  <p className="text-xs sm:text-sm text-[#c9d1d9] leading-relaxed bg-[#0d1117] p-4 rounded-lg border border-[#30363d]">
                    {paperDetails.abstract || 'No abstract provided.'}
                  </p>
                </div>

                {/* Main Content Body */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider font-mono border-b border-[#30363d] pb-2">Full Paper Body Excerpts</h3>
                  {paperDetails.content ? (
                    <div className="space-y-4 text-xs sm:text-sm text-[#c9d1d9] leading-relaxed">
                      {paperDetails.content.split('\n\n').map((para, idx) => (
                        <p key={idx} className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d]">
                          {para}
                        </p>
                      ))}
                    </div>
                  ) : paperDetails.chunks && paperDetails.chunks.length > 0 ? (
                    <div className="space-y-3">
                      {paperDetails.chunks.map((chunk, idx) => (
                        <div key={idx} className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d]">
                          <h4 className="text-[10px] font-mono text-[#58a6ff] uppercase mb-1">Section {idx + 1}</h4>
                          <p className="text-xs text-[#c9d1d9] leading-relaxed">{chunk.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#848d96]">Use PaperPath AI Tutor on the right to ask questions!</p>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          /* Main Content Area */
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
            
            {/* Release Header */}
            <div className="space-y-3 text-center border-b border-[#30363d] pb-6">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#3fb950] bg-[#238636]/20 border border-[#238636]/40 px-2 py-0.5 rounded">
                RELEASE • {currentDiff}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc] tracking-tight leading-tight">
                {paperDetails.title}
              </h1>
              <p className="text-xs text-[#848d96] flex items-center justify-center">
                <User className="h-3.5 w-3.5 mr-1 text-[#58a6ff]" />
                {authors}
              </p>
            </div>

            {/* Abstract Box */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-md">
              <div className="bg-[#21262d] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
                <span className="text-xs font-bold text-[#f0f6fc] flex items-center">
                  <BookOpen className="h-3.5 w-3.5 mr-1.5 text-[#3fb950]" /> Paper Abstract
                </span>
                <span className="text-[10px] font-mono text-[#848d96]">PaperPath AI Assistant</span>
              </div>
              <div className="p-4 text-xs sm:text-sm text-[#c9d1d9] leading-relaxed font-normal">
                {paperDetails.abstract || 'No abstract provided for this paper.'}
              </div>
            </div>

            {/* Paper Content Sections */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-[#f0f6fc] uppercase tracking-wider border-b border-[#30363d] pb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-[#58a6ff]" /> Detailed Content Analysis
              </h2>

              {isLoadingDetails ? (
                <div className="py-8 text-center text-[#848d96] text-xs font-mono animate-pulse">
                  Retrieving full text body...
                </div>
              ) : paperDetails.content ? (
                <div className="space-y-4 text-xs sm:text-sm text-[#c9d1d9] leading-relaxed">
                  {paperDetails.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="bg-[#161b22] p-4 rounded-lg border border-[#30363d]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : paperDetails.chunks && paperDetails.chunks.length > 0 ? (
                <div className="space-y-3">
                  {paperDetails.chunks.map((chunk, index) => (
                    <div key={index} className="bg-[#161b22] p-4 rounded-lg border border-[#30363d]">
                      <h4 className="text-[10px] font-mono text-[#58a6ff] uppercase mb-1">Section {index + 1}</h4>
                      <p className="text-xs text-[#c9d1d9] leading-relaxed">{chunk.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#161b22] p-4 rounded-lg border border-[#30363d] text-xs text-[#848d96]">
                  Abstract available above. Switch to "Real PDF Document" tab to view the original PDF!
                </div>
              )}
            </div>
            <div className="h-16"></div>
          </div>
        )}
      </div>

      {/* 🤖 RIGHT COLUMN: PAPERPATH AI TUTOR ASSISTANT CHAT */}
      <div className="flex-1 md:w-1/3 flex flex-col h-full bg-[#161b22]">
        
        {/* Header Bar */}
        <div className="h-12 border-b border-[#30363d] bg-[#010409] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4 text-[#3fb950]" />
            <h2 className="font-bold text-xs text-[#f0f6fc]">PaperPath AI Tutor</h2>
          </div>
          <span className="text-[10px] font-mono text-[#3fb950] bg-[#238636]/20 px-2 py-0.5 rounded-full border border-[#238636]/40 flex items-center">
            <span className="w-1.5 h-1.5 bg-[#3fb950] rounded-full mr-1 animate-pulse"></span> Active
          </span>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[90%] rounded-lg p-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#238636] text-white'
                    : 'bg-[#0d1117] text-[#c9d1d9] border border-[#30363d]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions & Input Bar */}
        <div className="p-4 bg-[#0d1117] border-t border-[#30363d] shrink-0 space-y-3">
          <div className="flex flex-wrap gap-1">
            {quickPrompts.map((promptText, i) => (
              <button
                key={i}
                onClick={() => sendQuery(promptText)}
                disabled={isTyping}
                className="text-[10px] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] px-2 py-1 rounded transition-colors"
              >
                ⚡ {promptText}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Copilot about this paper..."
              className="w-full pl-3 pr-10 py-2 bg-[#161b22] border border-[#30363d] rounded-md text-xs text-[#f0f6fc] placeholder-[#848d96] focus:border-[#58a6ff] outline-none"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isTyping}
              className="absolute right-1.5 p-1 bg-[#238636] hover:bg-[#2ea043] text-white rounded disabled:opacity-40 transition-colors"
            >
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}





