import React from 'react';
import { User, ActiveModule } from '../types';
import { AvoraLogo } from './AvoraLogo';
import { LogOut, User as UserIcon, LogIn, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeModule: ActiveModule;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (module: ActiveModule) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeModule,
  isDarkMode,
  onToggleDarkMode,
  onNavigate,
  onOpenAuth,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Avora Logo */}
        <button
          onClick={() => currentUser && onNavigate('dashboard')}
          className="text-left focus-visible:outline-hidden group cursor-pointer"
          title="Avora - Focus your time. Find your balance."
        >
          <AvoraLogo size="sm" showTagline={false} className="group-hover:opacity-90 transition-opacity" />
        </button>

        {/* Zone 2: Navigation Links - ONLY VISIBLE WHEN LOGGED IN */}
        {currentUser ? (
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                activeModule === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-0.5' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('pomodoro')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                activeModule === 'pomodoro' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-0.5' : ''
              }`}
            >
              Pomodoro
            </button>
            <button
              onClick={() => onNavigate('tasks')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                activeModule === 'tasks' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-0.5' : ''
              }`}
            >
              Four Quadrants
            </button>
            <button
              onClick={() => onNavigate('journal')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                activeModule === 'journal' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-0.5' : ''
              }`}
            >
              Journal
            </button>
            <button
              onClick={() => onNavigate('sounds')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                activeModule === 'sounds' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-0.5' : ''
              }`}
            >
              Relaxing Sounds
            </button>
            <button
              onClick={() => onNavigate('breathing')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                activeModule === 'breathing' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-0.5' : ''
              }`}
            >
              Breathwork
            </button>
            <button
              onClick={() => onNavigate('insights')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                activeModule === 'insights' ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-0.5' : ''
              }`}
            >
              Patterns
            </button>
          </nav>
        ) : (
          <div className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium">
            Focus your time. Find your balance.
          </div>
        )}

        {/* Zone 3: Dark/Light Mode Button & User Actions (NO DOWNLOAD ZIP BUTTON) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/10" />
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                <UserIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-semibold text-slate-900 dark:text-white">{currentUser.name || currentUser.username}</span>
                <span className="text-slate-400">(@{currentUser.username})</span>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Join</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
