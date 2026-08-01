import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, Bookmark, Bot, ExternalLink, FileText, Send, Sparkles, User, Tag, Zap, GitPullRequest, GraduationCap, Maximize2, FileCheck, Search } from 'lucide-react';
import { chatService, paperService } from '../services/api';
import MarkdownMessage from './MarkdownMessage';

export default function ReaderView({ paper, isSaved = false, onToggleSave, onBack }) {
  const [paperDetails, setPaperDetails] = useState(paper);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('pdf');
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
    setIframeLoaded(false);
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

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] bg-[var(--bg-base)] overflow-hidden font-sans">
      
      {/* 📄 LEFT COLUMN: READER VIEW */}
      <div className="flex-1 flex flex-col border-r border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-base)]">
        
        {/* Reader Top Action Bar (iOS Toolbar Style) */}
        <div className="h-[60px] border-b border-[var(--border-subtle)] bg-[var(--bg-overlay)] backdrop-blur-xl px-4 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center space-x-3 truncate flex-1 pr-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full text-[var(--accent-blue)] hover:bg-[var(--bg-raised)] transition-colors flex items-center text-[15px] font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-1" /> Back
            </button>
            <div className="h-5 w-[1px] bg-[var(--border-muted)]" />
            <h1 className="text-sm font-bold text-white truncate">
              {paperDetails.title}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle (iOS Segmented Control) */}
            <div className="flex items-center bg-[var(--bg-surface)] p-1 rounded-full border border-[var(--border-subtle)] shadow-sm">
              <button
                onClick={() => setViewMode('pdf')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center transition-all ${
                  viewMode === 'pdf' ? 'bg-[#3a3a3c] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 mr-1.5" /> PDF
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center transition-all ${
                  viewMode === 'text' ? 'bg-[#3a3a3c] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" /> Text
              </button>
            </div>

            <button
              onClick={onToggleSave}
              className={`p-2 rounded-full transition-all ${
                isSaved ? 'text-[var(--accent-purple)] bg-[rgba(191,90,242,0.15)]' : 'text-[var(--accent-blue)] hover:bg-[var(--bg-raised)]'
              }`}
            >
              <Bookmark className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Reader Display Container */}
        {viewMode === 'pdf' ? (
          <div className="flex-1 bg-[var(--bg-surface)] relative overflow-hidden">
            {embedPdfUrl ? (
              <>
                {!iframeLoaded && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center p-8 gap-4 bg-[var(--bg-surface)]">
                     <div className="shimmer w-full max-w-3xl h-12 rounded-xl mb-4" />
                     <div className="shimmer w-full max-w-3xl h-96 rounded-2xl opacity-70" />
                     <div className="shimmer w-full max-w-3xl h-48 rounded-2xl opacity-40" />
                  </div>
                )}
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
                <FileText className="h-16 w-16 text-[var(--text-muted)]" />
                <p className="text-sm text-[var(--text-secondary)] font-medium">Rendering document...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl mx-auto w-full">
            {/* Paper Header Card */}
            <div className="glass-card rounded-[24px] p-8 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[rgba(10,132,255,0.15)] text-[var(--accent-blue-bright)]">
                {currentDiff}
              </span>
              <h1 className="text-2xl font-bold text-white">{paperDetails.title}</h1>
              <p className="text-sm text-[var(--text-secondary)] flex items-center font-medium">
                <User className="h-4 w-4 mr-2 text-[var(--accent-blue)]" /> {authors}
              </p>
              <div className="bg-[var(--bg-base)] p-5 rounded-2xl border border-[var(--border-subtle)] space-y-2 mt-4">
                <h4 className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider">Abstract</h4>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{paperDetails.abstract}</p>
              </div>
            </div>

            {/* Detailed Content */}
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-white flex items-center border-b border-[var(--border-subtle)] pb-3">
                <FileText className="h-5 w-5 mr-2 text-[var(--accent-blue)]" /> Document Content
              </h2>

              {isLoadingDetails ? (
                <div className="space-y-4">
                  {[1, 0.85, 0.7].map((op, bi) => (
                    <div key={bi} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-3" style={{opacity: op}}>
                      <div className="shimmer w-1/3 h-3 rounded-md" />
                      <div className="shimmer w-full h-2 rounded-sm" />
                      <div className="shimmer w-11/12 h-2 rounded-sm" />
                      <div className="shimmer w-full h-2 rounded-sm" />
                    </div>
                  ))}
                </div>
              ) : paperDetails.content ? (
                <div className="space-y-4 text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  {paperDetails.content.split('\n\n').map((paragraph, index) => (
                    <div key={index} className="bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-subtle)]">
                      {paragraph}
                    </div>
                  ))}
                </div>
              ) : paperDetails.chunks && paperDetails.chunks.length > 0 ? (
                <div className="space-y-4">
                  {paperDetails.chunks.map((chunk, index) => (
                    <div key={index} className="bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-subtle)]">
                      <h4 className="text-[11px] font-bold text-[var(--accent-blue)] uppercase mb-2">Section {index + 1}</h4>
                      <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{chunk.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] text-center">
                  Full text not available. Use the PDF reader to view the original document.
                </div>
              )}
            </div>
            <div className="h-16"></div>
          </div>
        )}
      </div>

      {/* 🤖 RIGHT COLUMN: AI TUTOR CHAT (iMessage Style) */}
      <div className="w-full md:w-[400px] flex flex-col h-full bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] shrink-0 z-20 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)]">
        
        {/* AI Tutor Header */}
        <div className="h-[60px] border-b border-[var(--border-subtle)] bg-[var(--bg-overlay)] backdrop-blur-xl flex items-center justify-between px-5 shrink-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-[rgba(48,209,88,0.15)]">
              <Bot className="h-5 w-5 text-[var(--accent-green)]" />
            </div>
            <div>
              <h2 className="font-bold text-[15px] text-white tracking-tight">AI Tutor</h2>
              <p className="text-[11px] text-[var(--text-secondary)] font-medium">Powered by Gemini</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[var(--bg-base)]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-[rgba(48,209,88,0.15)] flex items-center justify-center mr-2 shrink-0 mt-auto mb-1">
                  <Bot className="h-3 w-3 text-[var(--accent-green)]" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-[20px] px-4 py-2.5 text-[14px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[var(--accent-blue)] text-white rounded-br-[4px]'
                    : 'bg-[#262629] text-white rounded-bl-[4px] border border-[var(--border-subtle)]'
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
              <div className="w-6 h-6 rounded-full bg-[rgba(48,209,88,0.15)] flex items-center justify-center mr-2 shrink-0">
                <Bot className="h-3 w-3 text-[var(--accent-green)]" />
              </div>
              <div className="bg-[#262629] border border-[var(--border-subtle)] rounded-[20px] rounded-bl-[4px] px-4 py-3 flex items-center space-x-1.5 h-[40px]">
                <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Prompts */}
        <div className="p-4 bg-[var(--bg-overlay)] backdrop-blur-xl border-t border-[var(--border-subtle)] shrink-0 z-10">
          {/* Suggestion Chips */}
          <div className="flex overflow-x-auto gap-2 mb-3 pb-1 scrollbar-hide">
            {quickPrompts.map((promptText, i) => (
              <button
                key={i}
                onClick={() => sendQuery(promptText)}
                disabled={isTyping}
                className="whitespace-nowrap text-[12px] font-medium bg-[var(--bg-raised)] hover:bg-[#3a3a3c] text-[var(--text-secondary)] hover:text-white px-3 py-1.5 rounded-full transition-colors flex items-center"
              >
                <Sparkles className="h-3 w-3 mr-1.5 text-[var(--accent-blue)]" />
                {promptText}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Message AI Tutor..."
              className="w-full pl-4 pr-12 py-3 bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-full text-sm text-white placeholder-[var(--text-secondary)] focus:border-[var(--accent-blue)] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isTyping}
              className="absolute right-1.5 p-2 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-bright)] text-white rounded-full disabled:opacity-30 disabled:bg-[var(--bg-surface)] transition-all flex items-center justify-center"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
