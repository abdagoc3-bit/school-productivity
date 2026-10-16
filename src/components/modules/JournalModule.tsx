import React, { useState, useEffect } from 'react';
import { User, JournalEntry, MoodType, Quote } from '../../types';
import { getJournalEntries, saveJournalEntry, deleteJournalEntry, getRandomQuoteForMood } from '../../utils/storage';
import { JournalPenIcon } from '../AvoraIcons';
import { 
  ArrowLeft, Trash2, Quote as QuoteIcon, Heart, Smile, Sun, Compass, 
  Anchor, CloudRain, Zap, Sparkles, Check 
} from 'lucide-react';

interface JournalModuleProps {
  currentUser: User | null;
  onBackToDashboard: () => void;
}

interface MoodOption {
  type: MoodType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const MOODS: MoodOption[] = [
  { type: 'calm', label: 'Calm', icon: <Anchor className="w-3.5 h-3.5" />, color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  { type: 'energized', label: 'Energized', icon: <Zap className="w-3.5 h-3.5" />, color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  { type: 'focused', label: 'Focused', icon: <Compass className="w-3.5 h-3.5" />, color: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
  { type: 'grateful', label: 'Grateful', icon: <Heart className="w-3.5 h-3.5" />, color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
  { type: 'reflective', label: 'Reflective', icon: <Sun className="w-3.5 h-3.5" />, color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
  { type: 'overwhelmed', label: 'Overwhelmed', icon: <CloudRain className="w-3.5 h-3.5" />, color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  { type: 'stressed', label: 'Stressed', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
  { type: 'content', label: 'Content', icon: <Smile className="w-3.5 h-3.5" />, color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800' }
];

const GRATITUDE_PLACEHOLDERS = [
  'e.g. A warm morning cup of tea',
  'e.g. The soft sunlight filtering through the window',
  'e.g. A kind and encouraging word from someone today',
  'e.g. Finishing a difficult focus block with patience',
  'e.g. Having this peaceful sanctuary to unwind and breathe'
];

export const JournalModule: React.FC<JournalModuleProps> = ({ currentUser, onBackToDashboard }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [activeQuote, setActiveQuote] = useState<Quote>(getRandomQuoteForMood('calm'));

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Reflection', 'Mindfulness']);
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(['', '', '', '', '']);
  const [savedAlert, setSavedAlert] = useState(false);

  const refreshEntries = () => {
    if (currentUser) {
      const list = getJournalEntries(currentUser.id);
      setEntries(list);
    }
  };

  useEffect(() => {
    refreshEntries();
  }, [currentUser]);

  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
    setActiveQuote(getRandomQuoteForMood(mood));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;

    const filteredGratitude = gratitudeItems.map(g => g.trim()).filter(Boolean);

    const newEntry: JournalEntry = {
      id: 'jrn_' + Date.now().toString(36),
      userId: currentUser.id,
      date: new Date().toISOString(),
      mood: selectedMood,
      quote: activeQuote,
      title: title.trim() || `Reflection on feeling ${selectedMood}`,
      content: content.trim(),
      tags: tags.length ? tags : ['Mindfulness'],
      gratitudeList: filteredGratitude,
      createdAt: new Date().toISOString()
    };
    saveJournalEntry(newEntry);
    refreshEntries();

    setTitle('');
    setContent('');
    setGratitudeItems(['', '', '', '', '']);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    refreshEntries();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Dashboard</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-white">3rd Grid</span>
          <span>·</span>
          <span>Journal Entry & Gratitude</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs mb-8 transition-colors">
        <div className="shrink-0 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <JournalPenIcon size={72} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            How are you feeling today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-xl">
            Check in with your emotions, receive wisdom for your current state, and pause to capture the 5 things you are grateful for today.
          </p>
        </div>
      </div>

      {/* Mood Selector Buttons */}
      <div className="mb-8">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
          1. Select your current mood:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {MOODS.map(m => {
            const isSelected = selectedMood === m.type;
            return (
              <button
                key={m.type}
                type="button"
                onClick={() => handleSelectMood(m.type)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-indigo-600 dark:border-indigo-400 bg-white dark:bg-slate-800 ring-2 ring-indigo-500/20 shadow-xs font-bold text-slate-900 dark:text-white' 
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className={`p-1.5 rounded-lg border ${m.color}`}>
                  {m.icon}
                </div>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Inspiring Quote based on mood selected */}
      <div className="p-6 bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 shadow-2xs mb-8 relative transition-colors">
        <QuoteIcon className="w-6 h-6 text-slate-400 dark:text-slate-500 mb-2" />
        <p className="text-sm sm:text-base font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
          "{activeQuote.text}"
        </p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 text-right">
          — {activeQuote.author}
        </p>
      </div>

      {/* Journal Entry Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xs mb-10 transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Capture Today's Reflection & Gratitude
        </h2>

        {savedAlert && (
          <div className="p-3 mb-4 text-xs font-medium text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Journal entry and 5 gratitudes preserved to your personal sanctuary.</span>
          </div>
        )}

        <form onSubmit={handleSaveEntry} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title / Core Thought
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Peaceful morning reflection"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Entry *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write freely. What made you feel this way? What thoughts are on your mind today?"
              rows={4}
              className="w-full px-3.5 py-3 text-xs leading-relaxed bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tags (Press enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                  <span>#{t}</span>
                  <button type="button" onClick={() => handleRemoveTag(t)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag (e.g. Deep Work, Growth, Calm) and hit enter..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* 5 Things I'm Grateful For Section */}
          <div className="pt-5 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                5 Things I'm Grateful For
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3.5">
              Just to be reminded of every beautiful thing, even the smallest one.
            </p>

            <div className="space-y-2.5">
              {[0, 1, 2, 3, 4].map(idx => (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900/50">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={gratitudeItems[idx]}
                    onChange={(e) => {
                      const updated = [...gratitudeItems];
                      updated[idx] = e.target.value;
                      setGratitudeItems(updated);
                    }}
                    placeholder={GRATITUDE_PLACEHOLDERS[idx]}
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Save Journal Entry
            </button>
          </div>
        </form>
      </div>

      {/* Past Journal Entries History */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Past Reflections & Mood History ({entries.length})
        </h2>

        {entries.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            No reflections recorded yet. Write your first thought and 5 gratitudes above!
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => {
              const moodOpt = MOODS.find(m => m.type === entry.mood) || MOODS[0];
              const dateObj = new Date(entry.date);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const formattedTime = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={entry.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border font-medium ${moodOpt.color}`}>
                        {moodOpt.icon}
                        <span>Feeling {moodOpt.label}</span>
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                        {formattedDate} · {formattedTime}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {entry.title}
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed mb-4">
                    {entry.content}
                  </p>

                  {entry.quote && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-750 text-[11px] text-slate-600 dark:text-slate-300 italic mb-3">
                      "{entry.quote.text}" — <span className="not-italic font-medium">{entry.quote.author}</span>
                    </div>
                  )}

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {entry.tags.map(t => (
                        <span key={t} className="text-[11px] text-slate-500 dark:text-slate-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {entry.gratitudeList && entry.gratitudeList.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>5 Things I was grateful for:</span>
                      </div>
                      <ul className="space-y-1.5 pl-1">
                        {entry.gratitudeList.map((item, i) => (
                          <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <span className="text-rose-500 font-bold shrink-0 text-[11px]">{i + 1}.</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
