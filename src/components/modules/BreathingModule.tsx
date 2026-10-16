import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { audioService } from '../../utils/audio';
import { saveBreathingSession } from '../../utils/storage';
import { BreathingFaceIcon } from '../AvoraIcons';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';

interface BreathingModuleProps {
  currentUser: User | null;
  onBackToDashboard: () => void;
}

type BreathingPatternId = 'box' | 'relax478' | 'coherent' | 'energize';

interface PatternStep {
  name: 'Inhale' | 'Hold' | 'Exhale';
  duration: number;
  instruction: string;
}

interface PatternConfig {
  id: BreathingPatternId;
  name: string;
  tagline: string;
  description: string;
  steps: PatternStep[];
}

const PATTERNS: PatternConfig[] = [
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    tagline: 'Equal ratio for composure and razor-sharp clarity',
    description: 'Stabilizes the autonomic nervous system and relieves performance pressure.',
    steps: [
      { name: 'Inhale', duration: 4, instruction: 'Inhale deeply through your nose' },
      { name: 'Hold', duration: 4, instruction: 'Hold your breath gently, lungs filled' },
      { name: 'Exhale', duration: 4, instruction: 'Exhale slowly through slightly parted lips' },
      { name: 'Hold', duration: 4, instruction: 'Rest in stillness at the bottom of the breath' }
    ]
  },
  {
    id: 'relax478',
    name: '4-7-8 Deep Relaxation',
    tagline: 'Natural sedative for somatic stress and racing thoughts',
    description: 'Developed by Dr. Andrew Weil to activate deep parasympathetic reset.',
    steps: [
      { name: 'Inhale', duration: 4, instruction: 'Inhale quietly through your nose' },
      { name: 'Hold', duration: 7, instruction: 'Hold the breath effortlessly without tension' },
      { name: 'Exhale', duration: 8, instruction: 'Exhale completely through your mouth with a soft whoosh' }
    ]
  },
  {
    id: 'coherent',
    name: 'Coherent 5-5 Resonance',
    tagline: 'Heart-rate variability coherence',
    description: 'Optimal 6-breaths-per-minute rhythm to synchronize cardiac rhythm.',
    steps: [
      { name: 'Inhale', duration: 5, instruction: 'Inhale smooth and continuous' },
      { name: 'Exhale', duration: 5, instruction: 'Exhale steady and uninterrupted' }
    ]
  },
  {
    id: 'energize',
    name: 'Awaken 4-2 Focus',
    tagline: 'Quick revitalization when feeling sluggish',
    description: 'Invigorating oxygenation rhythm to awaken mental alertness.',
    steps: [
      { name: 'Inhale', duration: 4, instruction: 'Breathe in fully with energy' },
      { name: 'Exhale', duration: 2, instruction: 'Release swiftly' }
    ]
  }
];

export const BreathingModule: React.FC<BreathingModuleProps> = ({ currentUser, onBackToDashboard }) => {
  const [selectedPatternId, setSelectedPatternId] = useState<BreathingPatternId>('box');
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundCues, setSoundCues] = useState(true);

  const pattern = PATTERNS.find(p => p.id === selectedPatternId) || PATTERNS[0];
  const currentStep = pattern.steps[currentStepIndex];

  useEffect(() => {
    setCurrentStepIndex(0);
    setStepSecondsLeft(pattern.steps[0].duration);
    setIsActive(false);
  }, [selectedPatternId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setStepSecondsLeft(prev => {
          if (prev <= 1) {
            const nextIdx = (currentStepIndex + 1) % pattern.steps.length;
            if (nextIdx === 0) {
              setCompletedCycles(c => c + 1);
              if (currentUser) {
                saveBreathingSession({
                  id: 'brth_' + Date.now(),
                  userId: currentUser.id,
                  pattern: pattern.name,
                  durationSeconds: pattern.steps.reduce((acc, s) => acc + s.duration, 0),
                  cycles: 1,
                  completedAt: new Date().toISOString()
                });
              }
            }
            setCurrentStepIndex(nextIdx);
            const nextStepDuration = pattern.steps[nextIdx].duration;
            if (soundCues) {
              const freq = pattern.steps[nextIdx].name === 'Inhale' ? 440 : pattern.steps[nextIdx].name === 'Exhale' ? 330 : 380;
              audioService.playChime(freq, 2.0);
            }
            return nextStepDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentStepIndex, pattern, soundCues, currentUser]);

  const handleToggleActive = () => {
    if (!isActive && soundCues) {
      audioService.playChime(432, 2.5);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setStepSecondsLeft(pattern.steps[0].duration);
  };

  let orbScale = 1.0;
  if (currentStep.name === 'Inhale') {
    const elapsed = currentStep.duration - stepSecondsLeft;
    orbScale = 1.0 + (elapsed / currentStep.duration) * 0.45;
  } else if (currentStep.name === 'Hold') {
    orbScale = currentStepIndex === 1 ? 1.45 : 1.0;
  } else if (currentStep.name === 'Exhale') {
    const elapsed = currentStep.duration - stepSecondsLeft;
    orbScale = 1.45 - (elapsed / currentStep.duration) * 0.45;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
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
          <span className="font-semibold text-black dark:text-white">5th Grid</span>
          <span>·</span>
          <span>Breathing Exercise</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white dark:bg-[#1e1f29] rounded-3xl border border-black/8 dark:border-white/10 p-8 sm:p-12 shadow-2xs text-center relative overflow-hidden transition-colors">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4 transform hover:scale-105 transition-transform">
            <BreathingFaceIcon size={84} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1d2b] dark:text-[#ebeaf1] tracking-tight">
            Guided Breathwork Sanctuary
          </h1>
          <p className="text-xs sm:text-sm text-[#666375] dark:text-[#9e9aa9] mt-1.5 max-w-md">
            Follow the gentle expanding circle to take slow, calming breaths whenever you need a quick break.
          </p>
        </div>

        {/* Pattern Selector */}
        <div className="inline-flex p-1.5 bg-[#f5f4ef] dark:bg-[#272836] rounded-2xl mb-10 max-w-lg mx-auto w-full flex-wrap">
          {PATTERNS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPatternId(p.id)}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedPatternId === p.id
                  ? 'bg-white dark:bg-[#1e1f29] text-black dark:text-white shadow-2xs font-semibold'
                  : 'text-[#696576] dark:text-[#aba8ba] hover:text-black dark:hover:text-white'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <p className="text-xs font-semibold text-[#373444] dark:text-[#d3d0df]">
            {pattern.name} — <span className="font-normal text-[#6b6879] dark:text-[#9e9aa9]">{pattern.tagline}</span>
          </p>
        </div>

        {/* Visual Pulsing Orb */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto mb-10 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-[#f2efe6] dark:bg-[#252737] border border-black/5 dark:border-white/5 transition-transform duration-1000 ease-in-out"
            style={{ transform: `scale(${orbScale * 0.95})` }}
          />
          <div
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-linear-to-tr from-[#201c2b] to-[#453d5a] dark:from-[#353047] dark:to-[#615480] shadow-xl flex flex-col items-center justify-center text-white p-6 transition-transform duration-1000 ease-in-out"
            style={{ transform: `scale(${orbScale})` }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {isActive ? currentStep.name : 'Ready'}
            </span>
            <span className="text-5xl font-mono font-bold mt-1 tabular-nums">
              {isActive ? stepSecondsLeft : pattern.steps[0].duration}s
            </span>
          </div>
        </div>

        <div className="min-h-12 mb-8 flex items-center justify-center">
          <p className="text-sm font-medium text-[#2d2a3a] dark:text-[#ebeaf1] px-4 py-2 bg-[#f8f7f2] dark:bg-[#262835] rounded-xl border border-black/5 dark:border-white/5 inline-block">
            {isActive ? currentStep.instruction : 'Click "Begin Breathwork" to sync your breath'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handleReset}
            className="p-3 text-[#5d596d] dark:text-[#aba8ba] hover:text-black dark:hover:text-white hover:bg-[#f5f4ef] dark:hover:bg-[#272836] rounded-full border border-black/10 dark:border-white/10 transition-colors cursor-pointer"
            title="Reset exercise"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleToggleActive}
            className="px-8 py-3.5 bg-[#201c2b] dark:bg-[#b0a4dc] text-white dark:text-[#15161c] hover:opacity-90 rounded-full font-semibold text-sm transition-all shadow-md flex items-center gap-2.5 active:scale-95 cursor-pointer"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Breathwork</span>
              </>
            )}
          </button>
          <button
            onClick={() => setSoundCues(!soundCues)}
            className={`p-3 rounded-full border border-black/10 dark:border-white/10 transition-colors cursor-pointer ${
              soundCues ? 'text-black dark:text-white bg-[#f5f4ef] dark:bg-[#272836]' : 'text-[#a29fae] dark:text-[#787588]'
            }`}
            title={soundCues ? 'Sound cues enabled' : 'Sound cues muted'}
          >
            {soundCues ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        <div className="pt-6 border-t border-black/6 dark:border-white/8 flex items-center justify-center gap-4 text-xs text-[#5e5b6e] dark:text-[#9e9aa9]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Completed Breath Cycles:</span>
            <strong className="text-black dark:text-white font-mono font-bold text-sm">{completedCycles}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
