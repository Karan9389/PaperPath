import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, BrainCircuit, Send } from 'lucide-react';
import { chatService } from '../services/api';

export default function ReaderView({ paper, onBack }) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm your AI tutor. I can help explain any confusing parts of "${paper.title}". What would you like to know?` },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userQuery = chatInput;
    setMessages((prev) => [...prev, { role: 'user', text: userQuery }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const aiReply = await chatService.askQuestion({ paperId: paper._id, prompt: userQuery });
      setMessages((prev) => [...prev, { role: 'ai', text: aiReply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'I could not answer that right now. Please try again in a moment.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50 animate-in fade-in duration-500">
      <div className="flex-1 md:w-2/3 border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden">
        <div className="h-14 border-b border-slate-200 flex items-center px-4 justify-between shrink-0 bg-slate-50/50">
          <button
            onClick={onBack}
            className="flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </button>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md border bg-indigo-50 text-indigo-700 border-indigo-200">
            {paper.difficultyLevel} Level
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 prose prose-slate max-w-none">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{paper.title}</h1>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-indigo-600" /> Abstract
            </h3>
            <p className="text-slate-700 leading-relaxed m-0">{paper.abstract}</p>
          </div>

          <h2>1. Introduction</h2>
          <p>
            This is a simulated view of the research paper text. In the full application, this area would render the chunks of text extracted from the PDF using pdf-parse or PyMuPDF.
          </p>
          <p>
            When a user encounters a dense academic sentence, they can copy it into the AI chat on the right and ask for a simple explanation.
          </p>
          <h2>2. Methodology</h2>
          <p>
            The RAG pipeline ensures that the AI tutor on the right side of the screen always has the full context of this exact document before it answers.
          </p>
          <div className="h-32"></div>
        </div>
      </div>

      <div className="flex-1 md:w-1/3 flex flex-col h-full bg-slate-50">
        <div className="h-14 border-b border-slate-200 bg-white flex items-center px-4 shadow-sm shrink-0">
          <BrainCircuit className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="font-bold text-slate-800">AI Explainer</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask for an explanation..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isTyping}
              className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-2 text-center text-xs text-slate-400">
            Pro tip: Ask "Explain this like I'm in Class 10"
          </div>
        </div>
      </div>
    </div>
  );
}
