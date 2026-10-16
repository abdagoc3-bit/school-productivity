import React from 'react';
import { User } from '../types';
import { getTasks, getJournalEntries, getPomodoroHistory, getBreathingHistory } from '../utils/storage';
import { ArrowLeft, CheckCircle2, Clock, Brain, Sparkles } from 'lucide-react';

interface ProductivityInsightsProps {
  currentUser: User | null;
  onBackToDashboard: () => void;
}

export const ProductivityInsights: React.FC<ProductivityInsightsProps> = ({ currentUser, onBackToDashboard }) => {
  const userId = currentUser ? currentUser.id : '';
  const tasks = getTasks(userId);
  const journals = getJournalEntries(userId);
  const pomodoros = getPomodoroHistory(userId);
  const breathings = getBreathingHistory(userId);

  const q1 = tasks.filter(t => t.quadrant === 'do-first');
  const q2 = tasks.filter(t => t.quadrant === 'schedule');
  const q3 = tasks.filter(t => t.quadrant === 'delegate');
  const q4 = tasks.filter(t => t.quadrant === 'delete');

  const totalTasks = tasks.length || 1;
  const q1Pct = Math.round((q1.length / totalTasks) * 100);
  const q2Pct = Math.round((q2.length / totalTasks) * 100);
  const q3Pct = Math.round((q3.length / totalTasks) * 100);
  const q4Pct = Math.round((q4.length / totalTasks) * 100);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalFocusMinutes = pomodoros.reduce((acc, p) => acc + p.durationMinutes, 0);

  const moodCounts: Record<string, number> = {};
  journals.forEach(j => {
    moodCounts[j.mood] = (moodCounts[j.mood] || 0) + 1;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/6 dark:border-white/8">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#545163] dark:text-[#a09cb2] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Dashboard</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-[#737082] dark:text-[#8e8a9d]">
          <span className="font-semibold text-black dark:text-white">Analytics</span>
          <span>·</span>
          <span>Productivity & Mindfulness Patterns</span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1d2b] dark:text-[#ebeaf1] tracking-tight">
          Productivity & Focus Balance Patterns
        </h1>
        <p className="text-xs sm:text-sm text-[#666375] dark:text-[#9e9aa9] mt-1.5 max-w-xl">
          Track how your cognitive energy is distributed across urgent deadlines, strategic growth, and restorative rituals.
        </p>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-[#1e1f29] p-5 rounded-2xl border border-black/8 dark:border-white/10 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-[#7c788c] dark:text-[#8d8a9e] mb-2">
            <span className="text-xs font-medium">Task Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#1f1d2b] dark:text-[#ebeaf1]">
            {completedCount} / {tasks.length}
          </div>
          <p className="text-[11px] text-[#787588] dark:text-[#908d9e] mt-1">
            {Math.round((completedCount / (tasks.length || 1)) * 100)}% execution rate
          </p>
        </div>

        <div className="bg-white dark:bg-[#1e1f29] p-5 rounded-2xl border border-black/8 dark:border-white/10 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-[#7c788c] dark:text-[#8d8a9e] mb-2">
            <span className="text-xs font-medium">Focus Sprints</span>
            <Clock className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#1f1d2b] dark:text-[#ebeaf1]">
            {pomodoros.length} sessions
          </div>
          <p className="text-[11px] text-[#787588] dark:text-[#908d9e] mt-1">
            ~{totalFocusMinutes} total minutes in flow
          </p>
        </div>

        <div className="bg-white dark:bg-[#1e1f29] p-5 rounded-2xl border border-black/8 dark:border-white/10 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-[#7c788c] dark:text-[#8d8a9e] mb-2">
            <span className="text-xs font-medium">Mindful Reflections</span>
            <Brain className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#1f1d2b] dark:text-[#ebeaf1]">
            {journals.length} entries
          </div>
          <p className="text-[11px] text-[#787588] dark:text-[#908d9e] mt-1">
            Consistent emotional tracking
          </p>
        </div>

        <div className="bg-white dark:bg-[#1e1f29] p-5 rounded-2xl border border-black/8 dark:border-white/10 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-[#7c788c] dark:text-[#8d8a9e] mb-2">
            <span className="text-xs font-medium">Breath Sessions</span>
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#1f1d2b] dark:text-[#ebeaf1]">
            {breathings.length} cycles
          </div>
          <p className="text-[11px] text-[#787588] dark:text-[#908d9e] mt-1">
            Autonomic nervous resets
          </p>
        </div>
      </div>

      {/* Eisenhower Matrix Distribution */}
      <div className="bg-white dark:bg-[#1e1f29] p-6 sm:p-8 rounded-3xl border border-black/8 dark:border-white/10 shadow-2xs mb-8 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#1f1d2b] dark:text-[#ebeaf1]">
              Eisenhower Quadrant Distribution
            </h2>
            <p className="text-xs text-[#6e6b7d] dark:text-[#9e9aa9] mt-0.5">
              Ideal pattern: Maximize Quadrant 2 (Strategic Scheduling) to reduce last-minute Quadrant 1 crises.
            </p>
          </div>
        </div>

        <div className="h-4 w-full bg-[#f0ede6] dark:bg-[#282a38] rounded-full overflow-hidden flex mb-6">
          <div style={{ width: `${q1Pct}%` }} className="bg-rose-500" title={`Q1 Do First: ${q1Pct}%`} />
          <div style={{ width: `${q2Pct}%` }} className="bg-sky-500" title={`Q2 Schedule: ${q2Pct}%`} />
          <div style={{ width: `${q3Pct}%` }} className="bg-amber-500" title={`Q3 Delegate: ${q3Pct}%`} />
          <div style={{ width: `${q4Pct}%` }} className="bg-slate-400 dark:bg-slate-600" title={`Q4 Delete: ${q4Pct}%`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-rose-900 dark:text-rose-200">Q1. Do First</span>
              <span className="font-mono font-bold text-rose-800 dark:text-rose-300">{q1Pct}%</span>
            </div>
            <p className="text-[11px] text-rose-700 dark:text-rose-400">Urgent & Important ({q1.length} tasks)</p>
          </div>
          <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sky-900 dark:text-sky-200">Q2. Schedule</span>
              <span className="font-mono font-bold text-sky-800 dark:text-sky-300">{q2Pct}%</span>
            </div>
            <p className="text-[11px] text-sky-700 dark:text-sky-400">Strategic & High-Impact ({q2.length} tasks)</p>
          </div>
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-900 dark:text-amber-200">Q3. Delegate</span>
              <span className="font-mono font-bold text-amber-800 dark:text-amber-300">{q3Pct}%</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">Urgent, Not Important ({q3.length} tasks)</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">Q4. Delete</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-400">{q4Pct}%</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Distractions to Cut ({q4.length} tasks)</p>
          </div>
        </div>
      </div>

      {/* Mood Tracker Patterns */}
      <div className="bg-white dark:bg-[#1e1f29] p-6 sm:p-8 rounded-3xl border border-black/8 dark:border-white/10 shadow-2xs transition-colors">
        <h2 className="text-base font-bold text-[#1f1d2b] dark:text-[#ebeaf1] mb-1">
          Emotional Mood Patterns
        </h2>
        <p className="text-xs text-[#6e6b7d] dark:text-[#9e9aa9] mb-6">
          Logged sentiment frequencies from your Avora journal entries.
        </p>

        {Object.keys(moodCounts).length === 0 ? (
          <p className="text-xs text-[#8c889a] dark:text-[#787588] py-6 text-center">
            No journal entries recorded yet. Record your daily moods to unlock trends.
          </p>
        ) : (
          <div className="space-y-3">
            {Object.entries(moodCounts).map(([mood, count]) => {
              const pct = Math.round((count / (journals.length || 1)) * 100);
              return (
                <div key={mood} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold capitalize text-[#2b2839] dark:text-[#ebeaf1]">{mood}</span>
                    <span className="text-[#6d6a7b] dark:text-[#9e9aa9] font-mono">{count} entries ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-[#f0ede6] dark:bg-[#2a2c3c] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-[#201c2b] dark:bg-[#b0a4dc] rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
