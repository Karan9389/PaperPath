import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import ReaderView from './components/ReaderView';
// Removed MOCK_PAPERS from the import!
import { authService, libraryService, paperService } from './services/api';

export default function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);
  const [papers, setPapers] = useState([]);
  const [savedPapers, setSavedPapers] = useState([]);
  const [readHistory, setReadHistory] = useState([]);
  const [currentPaper, setCurrentPaper] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');

  const handleLogin = async (e, email, password) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    try {
      const loggedUser = await authService.login({ email, password });
      setUser(loggedUser);
      setView('dashboard');
    } catch (error) {
      setAuthError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e, name, email, password) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    try {
      const createdUser = await authService.register({ name, email, password });
      setUser(createdUser);
      setView('dashboard');
    } catch (error) {
      setAuthError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPaper(null);
    setAuthError('');
    setAuthMode('login');
    setView('login');
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      const [fetchedPapers, libraryData] = await Promise.allSettled([
        paperService.list(),
        libraryService.getLibrary(),
      ]);

      // Changed fallback from MOCK_PAPERS to an empty array []
      const papersResult = fetchedPapers.status === 'fulfilled' ? fetchedPapers.value : [];
      const libraryResult = libraryData.status === 'fulfilled'
        ? libraryData.value
        : { savedPapers: [], readHistory: [] };

      setPapers(papersResult);
      setSavedPapers(libraryResult.savedPapers || []);
      setReadHistory(libraryResult.readHistory || []);
    } catch (error) {
      console.error('Could not load dashboard data', error);
      // Changed fallback from MOCK_PAPERS to an empty array []
      setPapers([]);
      setSavedPapers([]);
      setReadHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'dashboard' && papers.length === 0) {
      fetchDashboardData();
    }
  }, [view]);

  const openPaper = async (paper) => {
    setCurrentPaper(paper);

    try {
      await libraryService.trackPaper(paper._id);
    } catch (error) {
      console.error('Could not track paper', error);
    }

    if (!readHistory.find((item) => item._id === paper._id)) {
      setReadHistory([paper, ...readHistory]);
    }

    setView('reader');
  };

  const toggleSave = async (paperId, e) => {
    e.stopPropagation();

    if (savedPapers.find((paper) => paper._id === paperId)) {
      try {
        await libraryService.unsavePaper(paperId);
        setSavedPapers(savedPapers.filter((paper) => paper._id !== paperId));
      } catch (error) {
        console.error('Could not unsave paper', error);
      }
      return;
    }

    const paperToSave = papers.find((paper) => paper._id === paperId);
    if (!paperToSave) return;

    try {
      await libraryService.savePaper(paperId);
      setSavedPapers([...savedPapers, paperToSave]);
    } catch (error) {
      console.error('Could not save paper', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {user && view !== 'login' && <Navbar user={user} onLogout={handleLogout} setView={setView} />}

      <main className="max-w-7xl mx-auto">
        {(() => {
          switch (view) {
            case 'login':
              return (
                <LoginView
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                  isLoading={isLoading}
                  authMode={authMode}
                  setAuthMode={setAuthMode}
                  authError={authError}
                />
              );
            case 'dashboard':
              return (
                <DashboardView
                  papers={papers}
                  savedPapers={savedPapers}
                  readHistory={readHistory}
                  isLoading={isLoading}
                  onOpenPaper={openPaper}
                  onToggleSave={toggleSave}
                />
              );
            case 'reader':
              return <ReaderView paper={currentPaper} onBack={() => setView('dashboard')} />;
            default:
              return (
                <LoginView
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                  isLoading={isLoading}
                  authMode={authMode}
                  setAuthMode={setAuthMode}
                  authError={authError}
                />
              );
          }
        })()}
      </main>
    </div>
  );
}