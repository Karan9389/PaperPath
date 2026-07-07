import React, { useState } from 'react';
import { Bookmark, History, Library, Loader2, Sparkles } from 'lucide-react';
import PaperCard from './PaperCard';
import UploadComponent from './UploadComponent';

export default function DashboardView({ papers, savedPapers, readHistory, isLoading, onOpenPaper, onToggleSave }) {
  const [activeTab, setActiveTab] = useState('explore');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Dashboard</h1>
          <p className="text-slate-500 mt-1">Discover research curated for your level.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'explore' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Sparkles className="h-4 w-4 mr-2" /> Explore
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'library' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Library className="h-4 w-4 mr-2" /> My Library
          </button>
        </div>
      </div>

      {/* --- UPLOAD COMPONENT INSERTED HERE --- */}
      <UploadComponent onUploadSuccess={() => window.location.reload()} />
      {/* -------------------------------------- */}

      {activeTab === 'explore' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Recommended for You</h2>
            <span className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full">Level: Beginner (Class 9-10)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <PaperCard
                key={paper._id}
                paper={paper}
                isSaved={!!savedPapers.find((savedPaper) => savedPaper._id === paper._id)}
                onOpen={() => onOpenPaper(paper)}
                onToggleSave={(e) => onToggleSave(paper._id, e)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <section>
            <div className="flex items-center mb-4 text-slate-800">
              <Bookmark className="h-5 w-5 mr-2 text-indigo-600" />
              <h2 className="text-xl font-semibold">Saved Papers</h2>
            </div>
            {savedPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPapers.map((paper) => (
                  <PaperCard
                    key={paper._id}
                    paper={paper}
                    isSaved={true}
                    onOpen={() => onOpenPaper(paper)}
                    onToggleSave={(e) => onToggleSave(paper._id, e)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-slate-500 bg-slate-50 p-8 rounded-xl border border-dashed border-slate-300 text-center">
                No saved papers yet. Explore the dashboard to find interesting topics!
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center mb-4 text-slate-800">
              <History className="h-5 w-5 mr-2 text-indigo-600" />
              <h2 className="text-xl font-semibold">Recent History</h2>
            </div>
            {readHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readHistory.map((paper) => (
                  <PaperCard
                    key={paper._id}
                    paper={paper}
                    isSaved={!!savedPapers.find((savedPaper) => savedPaper._id === paper._id)}
                    onOpen={() => onOpenPaper(paper)}
                    onToggleSave={(e) => onToggleSave(paper._id, e)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-slate-500 bg-slate-50 p-8 rounded-xl border border-dashed border-slate-300 text-center">
                You haven't read any papers yet.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}