import { useState, useEffect } from 'react';
import { User, ActiveModule } from './types';
import { getCurrentUser, setCurrentUser, initLocalStorage } from './utils/storage';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { PomodoroModule } from './components/modules/PomodoroModule';
import { TaskMatrixModule } from './components/modules/TaskMatrixModule';
import { JournalModule } from './components/modules/JournalModule';
import { SoundscapeModule } from './components/modules/SoundscapeModule';
import { BreathingModule } from './components/modules/BreathingModule';
import { ProductivityInsights } from './components/ProductivityInsights';

const THEME_STORAGE_KEY = 'avora_theme_mode';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    initLocalStorage();
    const storedUser = getCurrentUser();
    if (storedUser) {
      setCurrentUserState(storedUser);
    }
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const handleToggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem(THEME_STORAGE_KEY, nextMode ? 'dark' : 'light');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUserState(user);
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    setActiveModule('dashboard');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Header
        currentUser={currentUser}
        activeModule={activeModule}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onNavigate={(mod) => setActiveModule(mod)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {!currentUser ? (
          /* When NOT logged in: Show the clean Login / Signup page first (no grids visible) */
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        ) : (
          /* When LOGGED IN: Access Dashboard ("Welcome to Avora Dashboard") and feature modules */
          <>
            {activeModule === 'dashboard' && (
              <Dashboard
                currentUser={currentUser}
                onSelectModule={(mod) => setActiveModule(mod)}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}
            {activeModule === 'pomodoro' && (
              <PomodoroModule
                currentUser={currentUser}
                onBackToDashboard={() => setActiveModule('dashboard')}
              />
            )}
            {activeModule === 'tasks' && (
              <TaskMatrixModule
                currentUser={currentUser}
                onBackToDashboard={() => setActiveModule('dashboard')}
              />
            )}
            {activeModule === 'journal' && (
              <JournalModule
                currentUser={currentUser}
                onBackToDashboard={() => setActiveModule('dashboard')}
              />
            )}
            {activeModule === 'sounds' && (
              <SoundscapeModule
                onBackToDashboard={() => setActiveModule('dashboard')}
              />
            )}
            {activeModule === 'breathing' && (
              <BreathingModule
                currentUser={currentUser}
                onBackToDashboard={() => setActiveModule('dashboard')}
              />
            )}
            {activeModule === 'insights' && (
              <ProductivityInsights
                currentUser={currentUser}
                onBackToDashboard={() => setActiveModule('dashboard')}
              />
            )}
          </>
        )}
      </main>

      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">
            Avora · Focus your time. Find your balance.
          </p>
          {currentUser && (
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveModule('dashboard')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveModule('tasks')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Four Quadrants
              </button>
              <button
                onClick={() => setActiveModule('insights')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Productivity Patterns
              </button>
            </div>
          )}
        </div>
      </footer>

      {/* Floating Auth Modal (if triggered via header when logged out) */}
      <AuthModal
        isOpen={isAuthModalOpen && !currentUser}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
