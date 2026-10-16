import React, { useState, useEffect, useRef } from 'react';
import { User, PomodoroSession } from '../../types';
import { audioService } from '../../utils/audio';
import { savePomodoroSession, getPomodoroHistory } from '../../utils/storage';
import { PomodoroClockIcon } from '../AvoraIcons';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, ArrowLeft } from 'lucide-react';

interface PomodoroModuleProps {
  currentUser: User | null;
  onBackToDashboard: () => void;
}

type PresetType = 'short' | 'medium' | 'standard' | 'custom';

const PRESET_MINUTES: Record<PresetType, number> = {
  short: 5,
  medium: 15,
  standard: 25,
  custom: 30
};

export const PomodoroModule: React.FC<PomodoroModuleProps> = ({ currentUser, onBackToDashboard }) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetType>('standard');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentUser) {
      const history = getPomodoroHistory(currentUser.id);
      const todayStr = new Date().toISOString().split('T')[0];
      const todaySessions = history.filter(s => s.completedAt.startsWith(todayStr));
      setCompletedCount(todaySessions.length);
    }
  }, [currentUser]);

  const handleSelectPreset = (preset: PresetType) => {
    setIsRunning(false);
    setSelectedPreset(preset);
    const mins = preset === 'custom' ? customMinutes : PRESET_MINUTES[preset];
    setTotalSeconds(mins * 60);
    setTimeLeft(mins * 60);
  };

  const handleComplete = () => {
    if (soundEnabled) {
      audioService.playChime(528, 4.5);
    }
    if (currentUser) {
      const session: PomodoroSession = {
        id: 'pomo_' + Date.now(),
        userId: currentUser.id,
        durationMinutes: Math.round(totalSeconds / 60),
        completedAt: new Date().toISOString(),
        type: selectedPreset
      };
      savePomodoroSession(session);
      setCompletedCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, totalSeconds, selectedPreset]);

  const handleTogglePlay = () => {
    if (!isRunning && timeLeft === 0) {
      setTimeLeft(totalSeconds);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const mins = selectedPreset === 'custom' ? customMinutes : PRESET_MINUTES[selectedPreset];
    setTimeLeft(mins * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;
  const strokeDashoffset = 754 * (1 - progressRatio);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Breadcrumb & Return to Dashboard */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/6 dark:border-white/8">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#545163] dark:text-[#a09cb2] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Dashboard</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-[#737082] dark:text-[#8e8a9d]">
          <span className="font-semibold text-black dark:text-white">1st Grid</span>
          <span>·</span>
          <span>Pomodoro Timer</span>
        </div>
      </div>

      {/* Main Focus Container */}
      <div className="bg-white dark:bg-[#1e1f29] rounded-3xl border border-black/8 dark:border-white/10 p-8 sm:p-12 shadow-2xs text-center relative overflow-hidden transition-colors">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-3 transform hover:scale-105 transition-transform">
            <PomodoroClockIcon size={90} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1d2b] dark:text-[#ebeaf1] tracking-tight">
            Pomodoro Focus Sanctuary
          </h1>
          <p className="text-xs sm:text-sm text-[#666375] dark:text-[#9e9aa9] mt-1.5 max-w-md">
            Structure your attention in rhythmic intervals. Balance sustained deep work with refreshing optical recovery.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="inline-flex p-1.5 bg-[#f5f4ef] dark:bg-[#272836] rounded-2xl mb-10 max-w-md mx-auto w-full">
          <button
            onClick={() => handleSelectPreset('short')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedPreset === 'short'
                ? 'bg-white dark:bg-[#1e1f29] text-black dark:text-white shadow-2xs font-semibold'
                : 'text-[#6c687b] dark:text-[#aba8ba] hover:text-black dark:hover:text-white'
            }`}
          >
            Short (5m)
          </button>
          <button
            onClick={() => handleSelectPreset('medium')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedPreset === 'medium'
                ? 'bg-white dark:bg-[#1e1f29] text-black dark:text-white shadow-2xs font-semibold'
                : 'text-[#6c687b] dark:text-[#aba8ba] hover:text-black dark:hover:text-white'
            }`}
          >
            Medium (15m)
          </button>
          <button
            onClick={() => handleSelectPreset('standard')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedPreset === 'standard'
                ? 'bg-white dark:bg-[#1e1f29] text-black dark:text-white shadow-2xs font-semibold'
                : 'text-[#6c687b] dark:text-[#aba8ba] hover:text-black dark:hover:text-white'
            }`}
          >
            Standard (25m)
          </button>
          <button
            onClick={() => handleSelectPreset('custom')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedPreset === 'custom'
                ? 'bg-white dark:bg-[#1e1f29] text-black dark:text-white shadow-2xs font-semibold'
                : 'text-[#6c687b] dark:text-[#aba8ba] hover:text-black dark:hover:text-white'
            }`}
          >
            Custom
          </button>
        </div>

        {selectedPreset === 'custom' && (
          <div className="mb-8 max-w-xs mx-auto flex items-center gap-3">
            <span className="text-xs text-[#716e80] dark:text-[#9e9aa9]">Duration:</span>
            <input
              type="range"
              min={1}
              max={60}
              value={customMinutes}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setCustomMinutes(val);
                setTotalSeconds(val * 60);
                setTimeLeft(val * 60);
                setIsRunning(false);
              }}
              className="flex-1 accent-[#201c2b] dark:accent-[#b0a4dc] cursor-pointer"
            />
            <span className="text-xs font-mono font-bold w-12 text-right">{customMinutes}m</span>
          </div>
        )}

        {/* Circular Progress Ring with Digital Readout */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto mb-10 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
            <circle
              cx="130"
              cy="130"
              r="120"
              className="stroke-[#f0efe9] dark:stroke-[#2b2c3d]"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="130"
              cy="130"
              r="120"
              className="stroke-[#201c2b] dark:stroke-[#b0a4dc] transition-all duration-300"
              strokeWidth="8"
              strokeDasharray="754"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-bold tracking-tight text-[#1e1c29] dark:text-[#ebeaf1] font-mono tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-[#7c798d] dark:text-[#938fa4] mt-2">
              {isRunning ? 'Flow in Progress' : timeLeft === 0 ? 'Session Complete' : 'Ready to Focus'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handleReset}
            className="p-3 text-[#5d596d] dark:text-[#aba8ba] hover:text-black dark:hover:text-white hover:bg-[#f5f4ef] dark:hover:bg-[#272836] rounded-full border border-black/10 dark:border-white/10 transition-colors cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleTogglePlay}
            className="px-8 py-3.5 bg-[#201c2b] dark:bg-[#b0a4dc] text-white dark:text-[#15161c] hover:opacity-90 rounded-full font-semibold text-sm transition-all shadow-md flex items-center gap-2.5 active:scale-95 cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{timeLeft === 0 ? 'Restart' : 'Start Focus'}</span>
              </>
            )}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-full border border-black/10 dark:border-white/10 transition-colors cursor-pointer ${
              soundEnabled ? 'text-black dark:text-white bg-[#f5f4ef] dark:bg-[#272836]' : 'text-[#a29fae] dark:text-[#787588]'
            }`}
            title={soundEnabled ? 'Sound alerts on' : 'Sound alerts muted'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Pomodoro Statistics */}
        <div className="pt-6 border-t border-black/6 dark:border-white/8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5f5b6e] dark:text-[#9e9aa9]">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Today's Completed Pomodoros:</span>
            <strong className="text-black dark:text-white font-mono font-bold text-sm">{completedCount}</strong>
          </div>
          <span>·</span>
          <div>
            <span>Estimated Focus Time:</span>
            <strong className="text-black dark:text-white font-mono font-bold ml-1 text-sm">
              {completedCount * 25} mins
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
