import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, Bookmark, Bot, ExternalLink, FileText, Send, Sparkles, User, Tag, Zap, GitPullRequest, GraduationCap, Maximize2, FileCheck, Search } from 'lucide-react';
import { chatService, paperService } from '../services/api';
import MarkdownMessage from './MarkdownMessage';

export default function ReaderView({ paper, isSaved = false, onToggleSave, onBack }) {
  const [paperDetails, setPaperDetails] = useState(paper);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false); // tracks PDF iframe load
  const [viewMode, setViewMode] = useState('pdf'); // 'pdf' | 'text'
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hello! I am **PaperPath AI Tutor**. Ask me anything about **"${paper.title}"**!` },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "Summarize key contribution",
    "Explain methodology simply",
    "What equations were used?",
    "Key Findings & Conclusion"
  ];

  useEffect(() => {
    setIframeLoaded(false); // reset skeleton each time paper changes
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

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] bg-[#090d13] overflow-hidden">
      
      {/* 📄 LEFT COLUMN: READER VIEW */}
      <div className="flex-1 flex flex-col border-r border-[#30363d] overflow-hidden bg-[#0d1117]">
        
        {/* Reader Top Action Bar */}
        <div className="h-14 border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 truncate">
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg text-[#848d96] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors flex items-center text-xs font-semibold"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </button>
            <div className="h-4 w-[1px] bg-[#30363d]" />
            <h1 className="text-xs font-bold text-[#f0f6fc] truncate max-w-[300px] lg:max-w-[500px]">
              {paperDetails.title}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
              <button
                onClick={() => setViewMode('pdf')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center transition-all ${
                  viewMode === 'pdf' ? 'bg-[#21262d] text-[#58a6ff]' : 'text-[#848d96] hover:text-[#c9d1d9]'
                }`}
              >
                <BookOpen className="h-3 w-3 mr-1" /> PDF Reader
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center transition-all ${
                  viewMode === 'text' ? 'bg-[#21262d] text-[#58a6ff]' : 'text-[#848d96] hover:text-[#c9d1d9]'
                }`}
              >
                <FileText className="h-3 w-3 mr-1" /> Text Body
              </button>
            </div>

            <button
              onClick={onToggleSave}
              className={`p-2 rounded-lg transition-all ${
                isSaved ? 'bg-[#a371f7]/20 text-[#d2a8ff] border border-[#8957e5]/40' : 'text-[#848d96] hover:bg-[#21262d]'
              }`}
            >
              <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Reader Display Container */}
        {viewMode === 'pdf' ? (
          <div className="flex-1 bg-[#161b22] relative overflow-hidden">
            {embedPdfUrl ? (
              <>
                {/* ── PDF Skeleton — visible until iframe fires onLoad ── */}
                {!iframeLoaded && (
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    background: '#161b22',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', padding: '32px 24px', gap: '16px',
                    overflowY: 'hidden',
                  }}>
                    {/* Fake toolbar */}
                    <div style={{ width: '100%', maxWidth: '720px', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      <div className="shimmer" style={{ width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0 }} />
                      <div className="shimmer" style={{ flex: 1, height: '28px', borderRadius: '6px' }} />
                      <div className="shimmer" style={{ width: '60px', height: '28px', borderRadius: '6px', flexShrink: 0 }} />
                    </div>

                    {/* Fake PDF pages */}
                    {[1, 0.92, 0.88].map((opacity, pi) => (
                      <div key={pi} style={{
                        width: '100%', maxWidth: '680px',
                        background: 'rgba(22,27,34,0.9)',
                        border: '1px solid rgba(48,54,61,0.5)',
                        borderRadius: '8px',
                        padding: '28px 32px',
                        display: 'flex', flexDirection: 'column', gap: '10px',
                        opacity,
                      }}>
                        {/* Page header */}
                        <div className="shimmer" style={{ width: '55%', height: '18px', borderRadius: '4px' }} />
                        <div className="shimmer" style={{ width: '35%', height: '11px', borderRadius: '4px' }} />
                        <div style={{ height: '1px', background: 'rgba(48,54,61,0.6)', margin: '4px 0' }} />
                        {/* Paragraph lines */}
                        {[100,100,94,100,87,100,76].map((w, i) => (
                          <div key={i} className="shimmer" style={{ width: `${w}%`, height: '10px', borderRadius: '3px' }} />
                        ))}
                        <div style={{ height: '8px' }} />
                        {[100,100,91,100,83].map((w, i) => (
                          <div key={i} className="shimmer" style={{ width: `${w}%`, height: '10px', borderRadius: '3px' }} />
                        ))}
                        {pi === 0 && (
                          <>
                            <div style={{ height: '8px' }} />
                            {[100,96,100,78].map((w, i) => (
                              <div key={i} className="shimmer" style={{ width: `${w}%`, height: '10px', borderRadius: '3px' }} />
                            ))}
                          </>
                        )}
                      </div>
                    ))}

                    {/* Loading label */}
                    <p style={{ fontSize: '11px', color: '#545d68', fontFamily: 'monospace', marginTop: '8px' }}>
                      Loading document…
                    </p>
                  </div>
                )}

                {/* Real iframe — invisible until loaded */}
                <iframe
                  src={embedPdfUrl}
                  title={paperDetails.title}
                  className="w-full h-full border-none"
                  style={{ opacity: iframeLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
                  onLoad={() => setIframeLoaded(true)}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                <FileText className="h-12 w-12 text-[#848d96] opacity-40" />
                <p className="text-xs text-[#848d96]">Rendering document...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
            {/* Paper Header Card */}
            <div className="glass-card rounded-xl p-6 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border badge-intermediate">
                {currentDiff}
              </span>
              <h1 className="text-lg font-extrabold text-[#f0f6fc]">{paperDetails.title}</h1>
              <p className="text-xs text-[#848d96] flex items-center">
                <User className="h-3.5 w-3.5 mr-1.5 text-[#58a6ff]" /> {authors}
              </p>
              <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] space-y-1">
                <h4 className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">Abstract</h4>
                <p className="text-xs text-[#c9d1d9] leading-relaxed">{paperDetails.abstract}</p>
              </div>
            </div>

            {/* Detailed Content */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-[#f0f6fc] uppercase tracking-wider border-b border-[#30363d] pb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-[#58a6ff]" /> Paper Content & Chunks
              </h2>

              {isLoadingDetails ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
                  {[1, 0.85, 0.7].map((op, bi) => (
                    <div key={bi} style={{
                      background: '#161b22',
                      border: '1px solid rgba(48,54,61,0.6)',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex', flexDirection: 'column', gap: '8px',
                      opacity: op,
                    }}>
                      <div className="shimmer" style={{ width: '30%', height: '10px', borderRadius: '3px' }} />
                      {[100, 100, 92, 100, 84, 100, 76].map((w, i) => (
                        <div key={i} className="shimmer" style={{ width: `${w}%`, height: '9px', borderRadius: '3px' }} />
                      ))}
                    </div>
                  ))}
                </div>
              ) : paperDetails.content ? (
                <div className="space-y-3 text-xs text-[#c9d1d9] leading-relaxed">
                  {paperDetails.content.split('\n\n').map((paragraph, index) => (
                    <div key={index} className="bg-[#161b22] p-4 rounded-lg border border-[#30363d]">
                      {paragraph}
                    </div>
                  ))}
                </div>
              ) : paperDetails.chunks && paperDetails.chunks.length > 0 ? (
                <div className="space-y-3">
                  {paperDetails.chunks.map((chunk, index) => (
                    <div key={index} className="bg-[#161b22] p-4 rounded-lg border border-[#30363d]">
                      <h4 className="text-[10px] font-mono text-[#58a6ff] uppercase mb-1">Chunk Section {index + 1}</h4>
                      <p className="text-xs text-[#c9d1d9] leading-relaxed">{chunk.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#161b22] p-4 rounded-lg border border-[#30363d] text-xs text-[#848d96]">
                  Abstract loaded above. Switch to "PDF Reader" tab to view original document!
                </div>
              )}
            </div>
            <div className="h-12"></div>
          </div>
        )}
      </div>

      {/* 🤖 RIGHT COLUMN: PAPERPATH AI TUTOR CHAT DRAWER */}
      <div className="w-full md:w-96 lg:w-[420px] flex flex-col h-full bg-[#161b22] border-l border-[#30363d]/80 shrink-0">
        
        {/* AI Tutor Header */}
        <div className="h-14 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between px-4 shrink-0 shadow-sm">
          <div className="flex items-center space-x-2.5">
            <div className="p-1 rounded-lg bg-[#238636]/20 border border-[#238636]/40 glow-emerald">
              <Bot className="h-4 w-4 text-[#3fb950]" />
            </div>
            <div>
              <h2 className="font-extrabold text-xs text-[#f0f6fc]">PaperPath AI Tutor</h2>
              <p className="text-[10px] text-[#848d96]">Powered by Google Gemini API</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#3fb950] bg-[#238636]/20 px-2 py-0.5 rounded-full border border-[#238636]/40 flex items-center">
            <span className="w-1.5 h-1.5 bg-[#3fb950] rounded-full mr-1 animate-pulse"></span> Active
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d1117]/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[92%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#238636] to-[#2ea043] text-white shadow-md'
                    : 'bg-[#161b22] text-[#c9d1d9] border border-[#30363d] shadow-sm'
                }`}
              >
                {msg.role === 'user' ? (
                  msg.text
                ) : (
                  <MarkdownMessage content={msg.text} />
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3.5 flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Prompts */}
        <div className="p-4 bg-[#0d1117] border-t border-[#30363d] shrink-0 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((promptText, i) => (
              <button
                key={i}
                onClick={() => sendQuery(promptText)}
                disabled={isTyping}
                className="text-[10px] font-medium bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] px-2.5 py-1 rounded-md transition-all hover:text-[#f0f6fc]"
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
              className="w-full pl-3.5 pr-10 py-2.5 bg-[#161b22] border border-[#30363d] rounded-lg text-xs text-[#f0f6fc] placeholder-[#848d96] focus:border-[#58a6ff] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isTyping}
              className="absolute right-1.5 p-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md disabled:opacity-40 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
