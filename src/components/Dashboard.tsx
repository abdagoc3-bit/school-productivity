import React from 'react';
import { User, ActiveModule } from '../types';
import { 
  PomodoroClockIcon, 
  TaskCalendarIcon, 
  JournalPenIcon, 
  RelaxingSoundIcon, 
  BreathingFaceIcon 
} from './AvoraIcons';
import { getTasks, getJournalEntries, getPomodoroHistory } from '../utils/storage';
import { ArrowRight, Activity } from 'lucide-react';

interface DashboardProps {
  currentUser: User | null;
  onSelectModule: (module: ActiveModule) => void;
  onOpenAuth: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  onSelectModule,
  onOpenAuth
}) => {
  const userId = currentUser ? currentUser.id : '';
  const tasks = getTasks(userId);
  const pendingUrgent = tasks.filter(t => !t.completed && t.quadrant === 'do-first').length;
  const journals = getJournalEntries(userId);
  const pomodoros = getPomodoroHistory(userId);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPomodoros = pomodoros.filter(p => p.completedAt.startsWith(todayStr)).length;
  const latestJournal = journals[0];

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Welcome to Avora Dashboard */}
      <div className="mb-10 pb-6 border-b border-black/6 dark:border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentDateFormatted}</span>
            <span>·</span>
            <span>Focus & Balance Sanctuary</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome to Avora Dashboard{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            A simple, calming space to help you study, organize your daily tasks, and take refreshing breaks.
          </p>
        </div>

        {currentUser && (
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name || currentUser.username}</p>
              <p className="text-[11px] text-slate-400 font-mono">@{currentUser.username}</p>
            </div>
          </div>
        )}
      </div>

      {/* Grid of the 6 clickable modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* 1ST GRID: Pomodoro Timer */}
        <div
          onClick={() => onSelectModule('pomodoro')}
          className="group cursor-pointer bg-white dark:bg-[#1e1f29] rounded-3xl border border-black/8 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#888496] dark:text-[#7d798e]">
                1st Grid · Focus
              </span>
              <span className="text-xs text-[#6e6a7c] dark:text-[#aba6bc] font-medium group-hover:text-black dark:group-hover:text-white inline-flex items-center gap-1 transition-colors">
                Open <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 p-2.5 bg-[#fbf9f4] dark:bg-[#262835] rounded-2xl border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform">
                <PomodoroClockIcon size={76} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1f1d2b] dark:text-[#ebeaf1]">
                  Pomodoro Timer
                </h2>
                <p className="text-xs text-[#6b677a] dark:text-[#9e9aa9] mt-0.5 font-medium">
                  Short (5m) · Medium (15m) · Standard (25m)
                </p>
              </div>
            </div>
            <p className="text-xs text-[#625f71] dark:text-[#a09cb0] leading-relaxed">
              Study or work in focused intervals. Take regular breaks so you don't get tired or overwhelmed.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-black/6 dark:border-white/8 flex items-center justify-between text-xs text-[#736f82] dark:text-[#8e8a9d]">
            <span>Today's completed sprints:</span>
            <span className="font-mono font-bold text-black dark:text-white">{todayPomodoros} sessions</span>
          </div>
        </div>

        {/* 2ND GRID: Task List (The Four Quadrants) */}
        <div
          onClick={() => onSelectModule('tasks')}
          className="group cursor-pointer bg-white dark:bg-[#1e1f29] rounded-3xl border border-black/8 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#888496] dark:text-[#7d798e]">
                2nd Grid · Matrix
              </span>
              <span className="text-xs text-[#6e6a7c] dark:text-[#aba6bc] font-medium group-hover:text-black dark:group-hover:text-white inline-flex items-center gap-1 transition-colors">
                Open <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 p-2 bg-[#fbf9f4] dark:bg-[#262835] rounded-2xl border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform">
                <TaskCalendarIcon size={76} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1f1d2b] dark:text-[#ebeaf1]">
                  The Four Quadrants
                </h2>
                <p className="text-xs text-[#6b677a] dark:text-[#9e9aa9] mt-0.5 font-medium">
                  Do First · Schedule · Delegate · Delete
                </p>
              </div>
            </div>
            <p className="text-xs text-[#625f71] dark:text-[#a09cb0] leading-relaxed">
              Organize your tasks based on what's urgent and what's important, with start and due dates.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-black/6 dark:border-white/8 flex items-center justify-between text-xs text-[#736f82] dark:text-[#8e8a9d]">
            <span>Active tasks:</span>
            <span className="font-mono font-bold text-black dark:text-white">
              {tasks.filter(t => !t.completed).length} pending {pendingUrgent > 0 && `(${pendingUrgent} urgent)`}
            </span>
          </div>
        </div>

        {/* 3RD GRID: Journal Entry */}
        <div
          onClick={() => onSelectModule('journal')}
          className="group cursor-pointer bg-white dark:bg-[#1e1f29] rounded-3xl border border-black/8 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#888496] dark:text-[#7d798e]">
                3rd Grid · Reflection
              </span>
              <span className="text-xs text-[#6e6a7c] dark:text-[#aba6bc] font-medium group-hover:text-black dark:group-hover:text-white inline-flex items-center gap-1 transition-colors">
                Open <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 p-2.5 bg-[#fbf9f4] dark:bg-[#262835] rounded-2xl border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform">
                <JournalPenIcon size={76} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1f1d2b] dark:text-[#ebeaf1]">
                  Journal Entry
                </h2>
                <p className="text-xs text-[#6b677a] dark:text-[#9e9aa9] mt-0.5 font-medium">
                  "How are you feeling today?"
                </p>
              </div>
            </div>
            <p className="text-xs text-[#625f71] dark:text-[#a09cb0] leading-relaxed">
              Check in with how you feel, read inspiring quotes, and list 5 things you're grateful for today.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-black/6 dark:border-white/8 flex items-center justify-between text-xs text-[#736f82] dark:text-[#8e8a9d]">
            <span>Latest entry:</span>
            <span className="font-medium text-black dark:text-white truncate max-w-[150px]">
              {latestJournal ? latestJournal.title : 'No entries yet'}
            </span>
          </div>
        </div>

        {/* 4TH GRID: Relaxing Sound */}
        <div
          onClick={() => onSelectModule('sounds')}
          className="group cursor-pointer bg-white dark:bg-[#1e1f29] rounded-3xl border border-black/8 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#888496] dark:text-[#7d798e]">
                4th Grid · Audio
              </span>
              <span className="text-xs text-[#6e6a7c] dark:text-[#aba6bc] font-medium group-hover:text-black dark:group-hover:text-white inline-flex items-center gap-1 transition-colors">
                Open <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 p-2.5 bg-[#fbf9f4] dark:bg-[#262835] rounded-2xl border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform">
                <RelaxingSoundIcon size={76} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1f1d2b] dark:text-[#ebeaf1]">
                  Relaxing Sound
                </h2>
                <p className="text-xs text-[#6b677a] dark:text-[#9e9aa9] mt-0.5 font-medium">
                  Rain, Waves, Fireplace & Tibetan Bowls
                </p>
              </div>
            </div>
            <p className="text-xs text-[#625f71] dark:text-[#a09cb0] leading-relaxed">
              Play calming background sounds like rain, campfire, or ocean waves while studying or reading.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-black/6 dark:border-white/8 flex items-center justify-between text-xs text-[#736f82] dark:text-[#8e8a9d]">
            <span>Soundscape:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Ready to play</span>
          </div>
        </div>

        {/* 5TH GRID: Breathing Exercise */}
        <div
          onClick={() => onSelectModule('breathing')}
          className="group cursor-pointer bg-white dark:bg-[#1e1f29] rounded-3xl border border-black/8 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#888496] dark:text-[#7d798e]">
                5th Grid · Somatic
              </span>
              <span className="text-xs text-[#6e6a7c] dark:text-[#aba6bc] font-medium group-hover:text-black dark:group-hover:text-white inline-flex items-center gap-1 transition-colors">
                Open <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 p-2.5 bg-[#fbf9f4] dark:bg-[#262835] rounded-2xl border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform">
                <BreathingFaceIcon size={76} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1f1d2b] dark:text-[#ebeaf1]">
                  Breathing Exercise
                </h2>
                <p className="text-xs text-[#6b677a] dark:text-[#9e9aa9] mt-0.5 font-medium">
                  Box Breathing, 4-7-8 & Coherent 5-5
                </p>
              </div>
            </div>
            <p className="text-xs text-[#625f71] dark:text-[#a09cb0] leading-relaxed">
              Follow the expanding orb to take slow, calming breaths whenever you feel stressed or tired.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-black/6 dark:border-white/8 flex items-center justify-between text-xs text-[#736f82] dark:text-[#8e8a9d]">
            <span>Breathing modes:</span>
            <span className="font-medium text-black dark:text-white">4 calming exercises</span>
          </div>
        </div>

        {/* 6TH GRID: Productivity Patterns & Analytics */}
        <div
          onClick={() => onSelectModule('insights')}
          className="group cursor-pointer bg-white dark:bg-[#1e1f29] rounded-3xl border border-black/8 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#888496] dark:text-[#7d798e]">
                Analytics · Insights
              </span>
              <span className="text-xs text-[#6e6a7c] dark:text-[#aba6bc] font-medium group-hover:text-black dark:group-hover:text-white inline-flex items-center gap-1 transition-colors">
                View <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 w-19 h-19 bg-[#faf9f4] dark:bg-[#262835] rounded-2xl border border-black/5 dark:border-white/5 flex items-center justify-center text-[#201c2b] dark:text-[#ebeaf1] group-hover:scale-105 transition-transform">
                <Activity className="w-9 h-9 stroke-1.5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1f1d2b] dark:text-[#ebeaf1]">
                  Productivity Patterns
                </h2>
                <p className="text-xs text-[#6b677a] dark:text-[#9e9aa9] mt-0.5 font-medium">
                  Quadrant distribution & mood audit
                </p>
              </div>
            </div>
            <p className="text-xs text-[#625f71] dark:text-[#a09cb0] leading-relaxed">
              Review how many tasks you finished, your completed focus sprints, and your mood reflections.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-black/6 dark:border-white/8 flex items-center justify-between text-xs text-[#736f82] dark:text-[#8e8a9d]">
            <span>Focus balance:</span>
            <span className="font-mono font-bold text-black dark:text-white">
              {tasks.length} tracked items
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
