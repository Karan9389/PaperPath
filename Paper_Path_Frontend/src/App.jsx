import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import ReaderView from './components/ReaderView';
import ProfileView from './components/ProfileView';
import { authService, libraryService, paperService } from './services/api';
import { ToastContainer, useToast } from './components/Toast';

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
  const { toasts, toast, removeToast } = useToast();

  // 🔄 Check stored session token on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedProfile = await authService.getProfile();
        if (storedProfile && storedProfile._id) {
          setUser(storedProfile);
          setView('dashboard');
        }
      } catch (err) {
        // Token invalid or expired
      }
    };
    restoreSession();
  }, []);

  const handleLogin = async (e, email, password) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    try {
      const loggedUser = await authService.login({ email, password });
      setUser(loggedUser);
      setView('dashboard');
      toast.success(`Welcome back, ${loggedUser.name || 'Researcher'}! 👋`);
    } catch (error) {
      const msg = error.message || 'Login failed. Please try again.';
      setAuthError(msg);
      toast.error(msg);
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
      toast.success(`Account created! A verification email has been sent to ${email} 📧`);
    } catch (error) {
      const msg = error.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentPaper(null);
    setAuthError('');
    setAuthMode('login');
    setView('login');
    toast.info('You have been logged out. See you soon! 👋');
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      const [fetchedPapers, libraryData] = await Promise.allSettled([
        paperService.list(),
        libraryService.getLibrary(),
      ]);

      const papersResult = fetchedPapers.status === 'fulfilled' ? fetchedPapers.value : [];
      const libraryResult = libraryData.status === 'fulfilled'
        ? libraryData.value
        : { savedPapers: [], readHistory: [] };

      setPapers(papersResult);
      setSavedPapers(libraryResult.savedPapers || []);
      setReadHistory(libraryResult.readHistory || []);
    } catch (error) {
      console.error('Could not load dashboard data', error);
      setPapers([]);
      setSavedPapers([]);
      setReadHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ((view === 'dashboard' || view === 'profile') && papers.length === 0) {
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

  const toggleSave = async (paper) => {
    if (!paper || !paper._id) return;
    const paperId = paper._id;

    if (savedPapers.find((sp) => sp._id === paperId)) {
      try {
        await libraryService.unsavePaper(paperId);
        setSavedPapers((prev) => prev.filter((sp) => sp._id !== paperId));
        toast.info('Paper removed from your library.');
      } catch (error) {
        console.error('Could not unsave paper', error);
        toast.error('Failed to remove paper. Please try again.');
      }
      return;
    }

    // Paper may be in papers feed, savedPapers, or readHistory — find from all
    const paperToSave = papers.find((p) => p._id === paperId)
      || readHistory.find((p) => p._id === paperId)
      || paper;

    try {
      await libraryService.savePaper(paperId);
      setSavedPapers((prev) => [...prev, paperToSave]);
      toast.success('Paper saved to your library! 📚');
    } catch (error) {
      console.error('Could not save paper', error);
      toast.error('Failed to save paper. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d13] text-[#e6edf3] font-sans selection:bg-[#238636]/30 selection:text-[#3fb950]">
      {user && view !== 'login' && <Navbar user={user} onLogout={handleLogout} setView={setView} currentView={view} />}

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
              return (
                <ReaderView
                  paper={currentPaper}
                  isSaved={!!currentPaper && !!savedPapers.find((sp) => sp._id === currentPaper._id)}
                  onToggleSave={() => currentPaper && toggleSave(currentPaper)}
                  onBack={() => setView('dashboard')}
                />
              );
            case 'profile':
              return (
                <ProfileView
                  user={user}
                  savedPapers={savedPapers}
                  readHistory={readHistory}
                  onLogout={handleLogout}
                  setView={setView}
                />
              );
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

      {/* Global toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}