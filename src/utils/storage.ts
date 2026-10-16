import { User, Task, JournalEntry, PomodoroSession, BreathingSession, MoodType } from '../types';

const STORAGE_KEYS = {
  USERS: 'avora_users',
  CURRENT_USER: 'avora_current_user',
  TASKS: 'avora_tasks',
  JOURNALS: 'avora_journals',
  POMODORO: 'avora_pomodoro_history',
  BREATHING: 'avora_breathing_history'
};

// Mood quotes database
export const MOOD_QUOTES: Record<MoodType, { text: string; author: string }[]> = {
  calm: [
    { text: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.", author: "Wayne Dyer" },
    { text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse" },
    { text: "Calmness is the cradle of power.", author: "Josiah Gilbert Holland" }
  ],
  energized: [
    { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Enthusiasm is the mother of effort, and without it nothing great was ever achieved.", author: "Ralph Waldo Emerson" }
  ],
  focused: [
    { text: "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
    { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
    { text: "Simplicity boils down to two steps: Identify the essential. Eliminate the rest.", author: "Leo Babauta" }
  ],
  grateful: [
    { text: "Gratitude turns what we have into enough, and more.", author: "Melody Beattie" },
    { text: "Acknowledging the good that you already have in your life is the foundation for all abundance.", author: "Eckhart Tolle" },
    { text: "When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love.", author: "Marcus Aurelius" }
  ],
  reflective: [
    { text: "The unexamined life is not worth living.", author: "Socrates" },
    { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
    { text: "Quiet the mind, and the soul will speak.", author: "Ma Jaya Sati Bhagavati" }
  ],
  overwhelmed: [
    { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
    { text: "Do not anticipate trouble, or worry about what may never happen. Keep in the sunlight.", author: "Benjamin Franklin" },
    { text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah Winfrey" }
  ],
  stressed: [
    { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
    { text: "The greatest weapon against stress is our ability to choose one thought over another.", author: "William James" },
    { text: "Tension is who you think you should be. Relaxation is who you are.", author: "Chinese Proverb" }
  ],
  content: [
    { text: "Be content with what you have; rejoice in the way things are. When you realize there is nothing lacking, the whole world belongs to you.", author: "Lao Tzu" },
    { text: "He who is contented is rich.", author: "Lao Tzu" },
    { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" }
  ]
};

export function getRandomQuoteForMood(mood: MoodType) {
  const quotes = MOOD_QUOTES[mood] || MOOD_QUOTES.calm;
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

export function initLocalStorage() {
  if (typeof window === 'undefined') return;
  // Clean up any previous demo user traces from local storage
  try {
    const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (rawUsers) {
      const usersList: User[] = JSON.parse(rawUsers);
      const filtered = usersList.filter(u => u.username.toLowerCase() !== 'demo');
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
    } else {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }

    const lastUser = localStorage.getItem('avora_last_username');
    if (lastUser && lastUser.toLowerCase() === 'demo') {
      localStorage.removeItem('avora_last_username');
    }

    const current = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (current) {
      const parsed = JSON.parse(current);
      if (parsed.username && parsed.username.toLowerCase() === 'demo') {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
  } catch {}
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function getLastUsername(): string {
  return '';
}

export function getAllUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function registerUser(user: User): { success: boolean; error?: string } {
  const users = getAllUsers();
  if (users.some(u => u.username.toLowerCase() === user.username.toLowerCase())) {
    return { success: false, error: 'That username is already taken. Try signing in with your 6-digit PIN.' };
  }
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  setCurrentUser(user);

  const starterTasks: Task[] = [
    {
      id: 'tsk_' + Date.now().toString(36) + '_1',
      userId: user.id,
      title: 'Review today s urgent deadlines and assignments',
      description: 'Check priority items that must be submitted or finished today.',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '17:00',
      quadrant: 'do-first',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'tsk_' + Date.now().toString(36) + '_2',
      userId: user.id,
      title: 'Schedule weekly study sessions & breaks',
      description: 'Block out focused study time for long-term projects and exams.',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      dueTime: '18:00',
      quadrant: 'schedule',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];
  try {
    const rawTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    const existing: Task[] = rawTasks ? JSON.parse(rawTasks) : [];
    existing.push(...starterTasks);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(existing));
  } catch {}
  return { success: true };
}

export function authenticateUser(username: string, pin: string): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers();
  const cleanUsername = username.toLowerCase().trim();
  const found = users.find(u => u.username.toLowerCase() === cleanUsername);
  if (!found) {
    return { success: false, error: 'Username not found. Check spelling or create an account.' };
  }
  if (found.pin !== pin.trim()) {
    return { success: false, error: 'Incorrect 6-digit PIN. Please try again or use Forgot PIN.' };
  }
  setCurrentUser(found);
  return { success: true, user: found };
}

export function resetUserPin(username: string, newPin: string): { success: boolean; error?: string } {
  const users = getAllUsers();
  const cleanUsername = username.toLowerCase().trim();
  const index = users.findIndex(u => u.username.toLowerCase() === cleanUsername);
  if (index === -1) {
    return { success: false, error: 'Username not found. Please check your username.' };
  }
  const user = users[index];
  user.pin = newPin.trim();
  users[index] = user;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem('avora_last_username', cleanUsername);
  return { success: true };
}

export function getTasks(userId: string): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    const all: Task[] = raw ? JSON.parse(raw) : [];
    return all.filter(t => t.userId === userId);
  } catch {
    return [];
  }
}

export function saveTask(task: Task): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    let all: Task[] = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex(t => t.id === task.id);
    if (idx >= 0) {
      all[idx] = task;
    } else {
      all.unshift(task);
    }
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(all));
  } catch (e) {
    console.error('Error saving task', e);
  }
}

export function deleteTask(taskId: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return;
    const all: Task[] = JSON.parse(raw);
    const filtered = all.filter(t => t.id !== taskId);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting task', e);
  }
}

export function getJournalEntries(userId: string): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    const all: JournalEntry[] = raw ? JSON.parse(raw) : [];
    return all.filter(j => j.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export function saveJournalEntry(entry: JournalEntry): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    let all: JournalEntry[] = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex(j => j.id === entry.id);
    if (idx >= 0) {
      all[idx] = entry;
    } else {
      all.unshift(entry);
    }
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(all));
  } catch (e) {
    console.error('Error saving journal', e);
  }
}

export function deleteJournalEntry(entryId: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    if (!raw) return;
    const all: JournalEntry[] = JSON.parse(raw);
    const filtered = all.filter(j => j.id !== entryId);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting journal entry', e);
  }
}

export function savePomodoroSession(session: PomodoroSession): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POMODORO);
    const all: PomodoroSession[] = raw ? JSON.parse(raw) : [];
    all.unshift(session);
    localStorage.setItem(STORAGE_KEYS.POMODORO, JSON.stringify(all));
  } catch (e) {
    console.error(e);
  }
}

export function getPomodoroHistory(userId: string): PomodoroSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POMODORO);
    const all: PomodoroSession[] = raw ? JSON.parse(raw) : [];
    return all.filter(p => p.userId === userId);
  } catch {
    return [];
  }
}

export function saveBreathingSession(session: BreathingSession): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BREATHING);
    const all: BreathingSession[] = raw ? JSON.parse(raw) : [];
    all.unshift(session);
    localStorage.setItem(STORAGE_KEYS.BREATHING, JSON.stringify(all));
  } catch (e) {
    console.error(e);
  }
}

export function getBreathingHistory(userId: string): BreathingSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BREATHING);
    const all: BreathingSession[] = raw ? JSON.parse(raw) : [];
    return all.filter(b => b.userId === userId);
  } catch {
    return [];
  }
}
