import React, { useState, useEffect } from 'react';
import { User, Task, QuadrantType } from '../../types';
import { getTasks, saveTask, deleteTask } from '../../utils/storage';
import { TaskCalendarIcon } from '../AvoraIcons';
import { 
  Plus, Check, Trash2, Calendar, Clock, 
  ArrowLeft, Search, X, CheckCircle2, ArrowUpDown, 
  ChevronDown, ChevronUp, RotateCcw 
} from 'lucide-react';

interface TaskMatrixModuleProps {
  currentUser: User | null;
  onBackToDashboard: () => void;
}

export type SortOption = 'due-asc' | 'due-desc' | 'created-desc';

interface QuadrantConfig {
  id: QuadrantType;
  number: string;
  title: string;
  shortLabel: string;
  headerBg: string;
  badgeBg: string;
}

const QUADRANTS: QuadrantConfig[] = [
  {
    id: 'do-first',
    number: '1',
    title: 'Do First (Important and Urgent)',
    shortLabel: '1. Do First',
    headerBg: 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-900/40',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200'
  },
  {
    id: 'schedule',
    number: '2',
    title: 'Schedule (Important, Not Urgent)',
    shortLabel: '2. Schedule',
    headerBg: 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-900/40',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200'
  },
  {
    id: 'delegate',
    number: '3',
    title: 'Delegate (Urgent, Not Important)',
    shortLabel: '3. Delegate',
    headerBg: 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200'
  },
  {
    id: 'delete',
    number: '4',
    title: 'Don t Do / Delete (Neither Urgent nor Important)',
    shortLabel: '4. Don t Do / Delete',
    headerBg: 'bg-slate-100/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/40',
    badgeBg: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
  }
];

export const TaskMatrixModule: React.FC<TaskMatrixModuleProps> = ({ currentUser, onBackToDashboard }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQuadrantFilter, setSelectedQuadrantFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeSort, setActiveSort] = useState<SortOption>('due-asc');
  const [completedSort, setCompletedSort] = useState<SortOption>('due-asc');
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState('09:00');
  const [dueDate, setDueDate] = useState(today);
  const [dueTime, setDueTime] = useState('17:00');
  const [quadrant, setQuadrant] = useState<QuadrantType>('do-first');

  const refreshTasks = () => {
    if (currentUser) {
      const userTasks = getTasks(currentUser.id);
      setTasks(userTasks);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, [currentUser]);

  const sortTasks = (taskList: Task[], sortOption: SortOption): Task[] => {
    return [...taskList].sort((a, b) => {
      if (sortOption === 'due-asc' || sortOption === 'due-desc') {
        const timeA = new Date(`${a.dueDate}T${a.dueTime || '00:00'}`).getTime();
        const timeB = new Date(`${b.dueDate}T${b.dueTime || '00:00'}`).getTime();
        if (isNaN(timeA) || isNaN(timeB) || timeA === timeB) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return sortOption === 'due-asc' ? timeA - timeB : timeB - timeA;
      }
      if (sortOption === 'created-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  };

  const formatDueDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `${formatted}${timeStr ? ` at ${timeStr}` : ''}`;
      }
      return `${dateStr} ${timeStr || ''}`;
    } catch {
      return `${dateStr} ${timeStr || ''}`;
    }
  };

  const getQuadrantInfo = (qId: QuadrantType) => {
    return QUADRANTS.find(q => q.id === qId) || QUADRANTS[0];
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;
    const newTask: Task = {
      id: 'tsk_' + Date.now().toString(36),
      userId: currentUser.id,
      title: title.trim(),
      description: description.trim(),
      startDate,
      startTime,
      dueDate,
      dueTime,
      quadrant,
      completed: false,
      createdAt: new Date().toISOString()
    };
    saveTask(newTask);
    refreshTasks();
    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleToggleComplete = (task: Task) => {
    const updated: Task = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined
    };
    saveTask(updated);
    refreshTasks();
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    refreshTasks();
  };

  const handleClearAllCompleted = () => {
    const toClear = tasks.filter(t => t.completed);
    if (toClear.length === 0) return;
    toClear.forEach(t => deleteTask(t.id));
    refreshTasks();
  };

  const matchesSearch = (t: Task) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
  };

  const allActiveTasks = tasks.filter(t => !t.completed && matchesSearch(t));
  const allCompletedTasks = tasks.filter(t => t.completed && matchesSearch(t));

  const activeTasksToDisplay = selectedQuadrantFilter === 'all'
    ? allActiveTasks
    : allActiveTasks.filter(t => t.quadrant === selectedQuadrantFilter);

  const completedTasksToDisplay = sortTasks(
    selectedQuadrantFilter === 'all'
      ? allCompletedTasks
      : allCompletedTasks.filter(t => t.quadrant === selectedQuadrantFilter),
    completedSort
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-black/6 dark:border-white/8">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#545163] dark:text-[#a09cb2] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Dashboard</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-[#737082] dark:text-[#8e8a9d]">
          <span className="font-semibold text-black dark:text-white">2nd Grid</span>
          <span>·</span>
          <span>Task List (The Four Quadrants)</span>
        </div>
      </div>

      {/* Module Title & Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white dark:bg-[#1e1f29] p-6 sm:p-8 rounded-3xl border border-black/8 dark:border-white/10 shadow-2xs transition-colors">
        <div className="flex items-center gap-5">
          <div className="shrink-0 p-2 bg-[#faf9f6] dark:bg-[#262835] rounded-2xl border border-black/5 dark:border-white/5">
            <TaskCalendarIcon size={64} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1d2b] dark:text-[#ebeaf1] tracking-tight">
              The Four Quadrants Task Matrix
            </h1>
            <p className="text-xs sm:text-sm text-[#666375] dark:text-[#9e9aa9] mt-1 max-w-xl">
              Eisenhower's decision principle: distinguish what is urgent from what is truly important. Schedule intentionally.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#201c2b] dark:bg-[#b0a4dc] text-white dark:text-[#15161c] text-xs font-semibold rounded-xl shadow-xs hover:opacity-90 transition-all whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </div>
      </div>

      {/* Filter, Sort, and Search Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1 p-1 bg-[#edebe4] dark:bg-[#272836] rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedQuadrantFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              selectedQuadrantFilter === 'all'
                ? 'bg-white dark:bg-[#1e1f29] text-black dark:text-white shadow-2xs font-semibold'
                : 'text-[#656272] dark:text-[#aba8ba] hover:text-black dark:hover:text-white'
            }`}
          >
            All Active ({allActiveTasks.length})
          </button>
          {QUADRANTS.map(q => {
            const count = allActiveTasks.filter(t => t.quadrant === q.id).length;
            return (
              <button
                key={q.id}
                onClick={() => setSelectedQuadrantFilter(q.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedQuadrantFilter === q.id
                    ? 'bg-white dark:bg-[#1e1f29] text-black dark:text-white shadow-2xs font-semibold'
                    : 'text-[#656272] dark:text-[#aba8ba] hover:text-black dark:hover:text-white'
                }`}
              >
                {q.shortLabel} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#1e1f29] border border-black/10 dark:border-white/10 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-[11px] font-semibold text-[#6e6a7d] dark:text-[#9e9aa9] whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as SortOption)}
              className="text-xs bg-transparent text-black dark:text-white focus:outline-hidden font-medium cursor-pointer"
              title="Sort active tasks"
            >
              <option value="due-asc" className="bg-white dark:bg-[#1e1f29]">Due Date (Earliest First)</option>
              <option value="due-desc" className="bg-white dark:bg-[#1e1f29]">Due Date (Latest First)</option>
              <option value="created-desc" className="bg-white dark:bg-[#1e1f29]">Recently Added</option>
            </select>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8c899c] dark:text-[#787588]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#1e1f29] border border-black/10 dark:border-white/10 rounded-xl focus:outline-hidden focus:border-black dark:focus:border-white text-black dark:text-white shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* 2x2 Matrix Display Grid */}
      <div className={`grid gap-6 mb-10 ${selectedQuadrantFilter === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {QUADRANTS.filter(q => selectedQuadrantFilter === 'all' || selectedQuadrantFilter === q.id).map(quad => {
          const quadActiveTasks = sortTasks(
            activeTasksToDisplay.filter(t => t.quadrant === quad.id),
            activeSort
          );
          return (
            <div
              key={quad.id}
              className="bg-white dark:bg-[#1e1f29] rounded-2xl border border-black/8 dark:border-white/10 overflow-hidden shadow-2xs flex flex-col transition-all hover:border-black/20 dark:hover:border-white/20"
            >
              <div className={`p-4 sm:p-5 border-b ${quad.headerBg}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {quad.number}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {quad.title}
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                    {quadActiveTasks.length} {quadActiveTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 divide-y divide-black/6 dark:divide-white/6 space-y-3">
                {quadActiveTasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#8e8a9d] dark:text-[#787588]">
                    No active tasks in this quadrant.
                  </div>
                ) : (
                  quadActiveTasks.map(task => (
                    <div
                      key={task.id}
                      className="pt-3 first:pt-0 flex items-start justify-between gap-3 group transition-opacity"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className="mt-0.5 w-4.5 h-4.5 rounded-md border border-black/25 dark:border-white/25 hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 bg-white dark:bg-[#252633] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                          title="Mark task complete"
                        >
                          <Check className="w-3 h-3 text-transparent group-hover:text-emerald-600 dark:group-hover:text-emerald-400 stroke-3 transition-colors" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#1e1c29] dark:text-[#ebeaf1] break-words">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-[11px] text-[#636072] dark:text-[#aba8ba] mt-0.5 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-[#787588] dark:text-[#908d9e]">
                            <span className="inline-flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3 opacity-60" />
                              <span>{task.startDate}</span>
                              <span className="opacity-60 font-sans">at</span>
                              <span>{task.startTime}</span>
                            </span>
                            <span className="opacity-50">·</span>
                            <span className="inline-flex items-center gap-1 font-mono text-[#b91c1c] dark:text-[#f87171] font-medium">
                              <Clock className="w-3 h-3 opacity-80" />
                              <span>Due {task.dueDate} {task.dueTime}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-[#9d9aa9] hover:text-rose-600 transition-opacity cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPLETED TASKS SECTION */}
      <div 
        id="completed-tasks-section"
        className="bg-white dark:bg-[#1e1f29] rounded-3xl border border-black/8 dark:border-white/10 shadow-2xs p-6 sm:p-8 transition-colors mb-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-black/6 dark:border-white/8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Completed Tasks
                </h2>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60">
                  {completedTasksToDisplay.length} completed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Archive of accomplished tasks, sorted by date of due. Click checkmark anytime to restore to active.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Sort due:</span>
              <select
                value={completedSort}
                onChange={(e) => setCompletedSort(e.target.value as SortOption)}
                className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-hidden cursor-pointer"
                title="Sort completed tasks by date of due"
              >
                <option value="due-asc" className="bg-white dark:bg-slate-800">Due Date (Earliest First)</option>
                <option value="due-desc" className="bg-white dark:bg-slate-800">Due Date (Latest First)</option>
                <option value="created-desc" className="bg-white dark:bg-slate-800">Recently Added</option>
              </select>
            </div>

            {completedTasksToDisplay.length > 0 && (
              <button
                onClick={handleClearAllCompleted}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Remove all completed tasks"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isCompletedExpanded ? "Collapse completed tasks" : "Expand completed tasks"}
            >
              {isCompletedExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isCompletedExpanded && (
          <div className="pt-5">
            {completedTasksToDisplay.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600 stroke-1" />
                <p className="font-semibold text-slate-600 dark:text-slate-300">No completed tasks yet</p>
                <p className="mt-1">Check off items in the Four Quadrants above to view them here, organized and sorted by date of due.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
                {completedTasksToDisplay.map(task => {
                  const qInfo = getQuadrantInfo(task.quadrant);
                  return (
                    <div
                      key={task.id}
                      className="pt-3 first:pt-0 flex items-start justify-between gap-3 group transition-all hover:bg-slate-50/60 dark:hover:bg-slate-800/40 p-2.5 rounded-xl"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className="mt-0.5 w-5 h-5 rounded-md bg-emerald-600 dark:bg-emerald-500 border border-emerald-600 dark:border-emerald-500 text-white flex items-center justify-center shrink-0 hover:bg-emerald-700 transition-colors cursor-pointer"
                          title="Click to restore to active tasks"
                        >
                          <Check className="w-3.5 h-3.5 stroke-3" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 line-through break-words">
                              {task.title}
                            </p>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${qInfo.badgeBg} border-black/5 dark:border-white/5`}>
                              {qInfo.shortLabel}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-1.5 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1 font-mono font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              <Calendar className="w-3 h-3 text-indigo-500" />
                              <span>Due: {formatDueDateTime(task.dueDate, task.dueTime)}</span>
                            </span>
                            {task.completedAt && (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                                <span>Completed: {new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </span>
                            )}
                            <button
                              onClick={() => handleToggleComplete(task)}
                              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Restore</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 transition-opacity cursor-pointer"
                        title="Delete completed task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#faf9f6] dark:bg-[#1e1f29] rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl p-6 sm:p-7 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#8b879a] hover:text-black dark:hover:text-white p-1.5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#1f1d2b] dark:text-[#ebeaf1]">
                Add Task with Start & Due Schedule
              </h2>
              <p className="text-xs text-[#6e6b7d] dark:text-[#9e9aa9] mt-0.5">
                Assign to one of the Four Quadrants to align your daily focus.
              </p>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#423f50] dark:text-[#aba8ba] mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Conduct system review"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#252633] border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#423f50] dark:text-[#aba8ba] mb-1">
                  Description / Notes (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context or immediate steps..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#252633] border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-hidden"
                />
              </div>
              {/* Start Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#423f50] dark:text-[#aba8ba] mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#252633] border border-black/15 dark:border-white/15 rounded-xl font-mono text-black dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#423f50] dark:text-[#aba8ba] mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#252633] border border-black/15 dark:border-white/15 rounded-xl font-mono text-black dark:text-white"
                    required
                  />
                </div>
              </div>
              {/* Due Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#423f50] dark:text-[#aba8ba] mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#252633] border border-black/15 dark:border-white/15 rounded-xl font-mono text-black dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#423f50] dark:text-[#aba8ba] mb-1">
                    Due Time *
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#252633] border border-black/15 dark:border-white/15 rounded-xl font-mono text-black dark:text-white"
                    required
                  />
                </div>
              </div>
              {/* Quadrant Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#423f50] dark:text-[#aba8ba] mb-1.5">
                  Select Quadrant *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUADRANTS.map(q => (
                    <button
                      type="button"
                      key={q.id}
                      onClick={() => setQuadrant(q.id)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        quadrant === q.id 
                          ? 'border-[#201c2b] dark:border-[#b0a4dc] bg-white dark:bg-[#262835] ring-2 ring-black/10 dark:ring-white/10 shadow-xs' 
                          : 'border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#20212d] hover:bg-white dark:hover:bg-[#262835]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1f1d2b] dark:text-[#ebeaf1]">
                          {q.number}. {q.title}
                        </span>
                        {quadrant === q.id && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#656273] dark:text-[#9e9aa9] hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#201c2b] dark:bg-[#b0a4dc] dark:text-[#15161c] hover:opacity-90 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
