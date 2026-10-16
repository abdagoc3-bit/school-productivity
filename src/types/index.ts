export type QuadrantType = 'do-first' | 'schedule' | 'delegate' | 'delete';

export interface User {
  id: string;
  username: string;
  pin: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  dueDate: string;   // YYYY-MM-DD
  dueTime: string;   // HH:mm
  quadrant: QuadrantType;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export type MoodType = 
  | 'calm'
  | 'energized'
  | 'focused'
  | 'grateful'
  | 'reflective'
  | 'overwhelmed'
  | 'stressed'
  | 'content';

export interface Quote {
  text: string;
  author: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string; // ISO
  mood: MoodType;
  quote: Quote;
  title: string;
  content: string;
  tags: string[];
  gratitudeList?: string[]; // 5 things I'm grateful for
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  userId: string;
  durationMinutes: number;
  completedAt: string;
  type: 'short' | 'medium' | 'standard' | 'custom';
}

export interface BreathingSession {
  id: string;
  userId: string;
  durationSeconds: number;
  pattern: string;
  cycles: number;
  completedAt: string;
}

export type ActiveModule = 
  | 'dashboard' 
  | 'pomodoro' 
  | 'tasks' 
  | 'journal' 
  | 'sounds' 
  | 'breathing'
  | 'insights';

export type ThemeMode = 'light' | 'dark';
