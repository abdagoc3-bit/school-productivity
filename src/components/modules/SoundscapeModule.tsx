import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../utils/audio';
import { RelaxingSoundIcon } from '../AvoraIcons';
import { 
  ArrowLeft, Volume2, VolumeX, Play, Square, 
  CloudRain, Waves, Flame, Sparkles, Trees, Droplet, Clock 
} from 'lucide-react';

interface SoundscapeModuleProps {
  onBackToDashboard: () => void;
}

interface SoundTrack {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
}

const TRACKS: SoundTrack[] = [
  { id: 'rain', name: 'Gentle Rainfall', category: 'Water', icon: <CloudRain className="w-5 h-5 text-sky-600 dark:text-sky-400" />, description: 'Soft steady droplets hitting the roof' },
  { id: 'waves', name: 'Ocean Shore', category: 'Water', icon: <Waves className="w-5 h-5 text-teal-600 dark:text-teal-400" />, description: 'Rhythmic swells and calm ocean ebb' },
  { id: 'fire', name: 'Campfire Hearth', category: 'Elements', icon: <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />, description: 'Warm timber crackle and ambient embers' },
  { id: 'birds', name: 'Forest Birds', category: 'Nature', icon: <Trees className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />, description: 'Gentle canopy wind and soft birdsong' },
  { id: 'stream', name: 'Mountain Stream', category: 'Water', icon: <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400" />, description: 'Crisp glacial brook murmuring over stones' },
  { id: 'bowl', name: 'Tibetan Singing Bowl', category: 'Zen', icon: <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />, description: 'Calming, gentle meditative tone' }
];

export const SoundscapeModule: React.FC<SoundscapeModuleProps> = ({ onBackToDashboard }) => {
  const [activeTracks, setActiveTracks] = useState<Record<string, boolean>>({
    rain: false,
    waves: false,
    fire: false,
    birds: false,
    stream: false,
    bowl: false
  });

  const [volumes, setVolumes] = useState<Record<string, number>>({
    rain: 0.6,
    waves: 0.5,
    fire: 0.5,
    birds: 0.4,
    stream: 0.5,
    bowl: 0.4
  });

  const [masterVolume, setMasterVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const anyPlaying = Object.values(activeTracks).some(Boolean);

  const handleToggleTrack = (id: string) => {
    const nextState = !activeTracks[id];
    setActiveTracks(prev => ({ ...prev, [id]: nextState }));
    if (nextState) {
      audioService.startSound(id, isMuted ? 0 : volumes[id]);
    } else {
      audioService.stopSound(id);
    }
  };

  const handleVolumeChange = (id: string, vol: number) => {
    setVolumes(prev => ({ ...prev, [id]: vol }));
    if (activeTracks[id] && !isMuted) {
      audioService.setSoundVolume(id, vol);
    }
  };

  const handleMasterVolumeChange = (vol: number) => {
    setMasterVolume(vol);
    audioService.setMasterVolume(isMuted ? 0 : vol);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioService.setMasterVolume(nextMute ? 0 : masterVolume);
  };

  const handleStopAll = () => {
    audioService.stopAll();
    setActiveTracks({
      rain: false,
      waves: false,
      fire: false,
      birds: false,
      stream: false,
      bowl: false
    });
    setTimerRemaining(null);
  };

  const applyPreset = (presetName: string) => {
    handleStopAll();
    setTimeout(() => {
      if (presetName === 'deep-focus') {
        setActiveTracks(p => ({ ...p, rain: true, fire: true }));
        setVolumes(p => ({ ...p, rain: 0.5, fire: 0.4 }));
        audioService.startSound('rain', 0.5);
        audioService.startSound('fire', 0.4);
      } else if (presetName === 'coastal-calm') {
        setActiveTracks(p => ({ ...p, waves: true, bowl: true }));
        setVolumes(p => ({ ...p, waves: 0.6, bowl: 0.35 }));
        audioService.startSound('waves', 0.6);
        audioService.startSound('bowl', 0.35);
      } else if (presetName === 'forest-zen') {
        setActiveTracks(p => ({ ...p, birds: true, stream: true }));
        setVolumes(p => ({ ...p, birds: 0.5, stream: 0.45 }));
        audioService.startSound('birds', 0.5);
        audioService.startSound('stream', 0.45);
      }
    }, 100);
  };

  useEffect(() => {
    if (timerMinutes && timerMinutes > 0 && anyPlaying) {
      setTimerRemaining(timerMinutes * 60);
    } else {
      setTimerRemaining(null);
    }
  }, [timerMinutes, anyPlaying]);

  useEffect(() => {
    if (timerRemaining !== null && timerRemaining > 0 && anyPlaying) {
      countdownRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev && prev <= 1) {
            clearInterval(countdownRef.current!);
            handleStopAll();
            audioService.playChime(432, 3);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    } else if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [timerRemaining, anyPlaying]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
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
          <span className="font-semibold text-black dark:text-white">4th Grid</span>
          <span>·</span>
          <span>Relaxing Soundscapes</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white dark:bg-[#1e1f29] p-6 sm:p-8 rounded-3xl border border-black/8 dark:border-white/10 shadow-2xs mb-8 transition-colors">
        <div className="shrink-0 p-2 bg-[#faf9f6] dark:bg-[#262835] rounded-2xl border border-black/5 dark:border-white/5">
          <RelaxingSoundIcon size={80} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1d2b] dark:text-[#ebeaf1] tracking-tight">
            Relaxing Sound Sanctuary
          </h1>
          <p className="text-xs sm:text-sm text-[#666375] dark:text-[#9e9aa9] mt-1.5 max-w-xl">
            Play and mix peaceful sounds like rain, ocean waves, and campfires to help you relax, focus, or study.
          </p>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs font-semibold text-[#545163] dark:text-[#aba8ba] mr-2">Quick Presets:</span>
        <button
          onClick={() => applyPreset('deep-focus')}
          className="px-3.5 py-1.5 text-xs font-medium bg-white dark:bg-[#252633] hover:bg-[#f5f4ef] dark:hover:bg-[#2c2d3d] text-black dark:text-white border border-black/10 dark:border-white/10 rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          🌧️ Rain & Campfire
        </button>
        <button
          onClick={() => applyPreset('coastal-calm')}
          className="px-3.5 py-1.5 text-xs font-medium bg-white dark:bg-[#252633] hover:bg-[#f5f4ef] dark:hover:bg-[#2c2d3d] text-black dark:text-white border border-black/10 dark:border-white/10 rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          🌊 Ocean & Singing Bowl
        </button>
        <button
          onClick={() => applyPreset('forest-zen')}
          className="px-3.5 py-1.5 text-xs font-medium bg-white dark:bg-[#252633] hover:bg-[#f5f4ef] dark:hover:bg-[#2c2d3d] text-black dark:text-white border border-black/10 dark:border-white/10 rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          🌲 Forest Canopy & Stream
        </button>
        {anyPlaying && (
          <button
            onClick={handleStopAll}
            className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 rounded-xl transition-all cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Silence All</span>
          </button>
        )}
      </div>

      {/* Sound Tracks Mixer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {TRACKS.map(track => {
          const isActive = activeTracks[track.id];
          const volume = volumes[track.id];
          return (
            <div
              key={track.id}
              className={`p-5 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#232432] border-[#201c2b] dark:border-[#b0a4dc] ring-2 ring-black/5 dark:ring-white/10 shadow-xs'
                  : 'bg-white/80 dark:bg-[#1e1f29] border-black/8 dark:border-white/10 hover:bg-white dark:hover:bg-[#232432]'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#faf9f6] dark:bg-[#282937] rounded-xl border border-black/5 dark:border-white/5">
                    {track.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1f1d2b] dark:text-[#ebeaf1]">
                      {track.name}
                    </h3>
                    <p className="text-[11px] text-[#716e80] dark:text-[#9e9aa9]">
                      {track.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleTrack(track.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#201c2b] dark:bg-[#b0a4dc] text-white dark:text-[#15161c] shadow-xs'
                      : 'bg-[#edebe4] dark:bg-[#2c2d3d] text-[#636072] dark:text-[#a09cb2] hover:bg-[#dedad0] dark:hover:bg-[#343647]'
                  }`}
                  title={isActive ? 'Pause sound' : 'Play sound'}
                >
                  {isActive ? (
                    <Square className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 pt-2">
                <Volume2 className={`w-3.5 h-3.5 ${isActive ? 'text-black dark:text-white' : 'text-[#a29fae] dark:text-[#787588]'}`} />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={volume}
                  onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                  disabled={!isActive}
                  className="flex-1 accent-[#201c2b] dark:accent-[#b0a4dc] disabled:opacity-30 cursor-pointer"
                />
                <span className="text-[11px] font-mono font-medium text-[#737082] dark:text-[#908d9e] w-8 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Master Bar & Sleep Timer */}
      <div className="bg-white dark:bg-[#1e1f29] rounded-2xl border border-black/8 dark:border-white/10 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleToggleMute}
            className={`p-2.5 rounded-xl border border-black/10 dark:border-white/10 transition-colors cursor-pointer ${
              isMuted ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300' : 'bg-[#faf9f6] dark:bg-[#252633] text-black dark:text-white'
            }`}
            title={isMuted ? "Unmute master" : "Mute master"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#4e4b5d] dark:text-[#aba8ba]">Master:</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={masterVolume}
              onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
              className="w-24 sm:w-32 accent-[#201c2b] dark:accent-[#b0a4dc] cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Clock className="w-4 h-4 text-[#757283] dark:text-[#908d9e]" />
          <span className="text-xs font-medium text-[#656274] dark:text-[#aba8ba]">Timer:</span>
          <div className="flex items-center gap-1.5">
            {[15, 30, 60].map(mins => (
              <button
                key={mins}
                onClick={() => setTimerMinutes(timerMinutes === mins ? null : mins)}
                className={`px-2.5 py-1 text-xs rounded-lg border font-mono transition-colors cursor-pointer ${
                  timerMinutes === mins
                    ? 'bg-[#201c2b] dark:bg-[#b0a4dc] text-white dark:text-[#15161c] border-[#201c2b] dark:border-[#b0a4dc]'
                    : 'bg-[#faf9f6] dark:bg-[#252633] text-[#555263] dark:text-[#aba8ba] border-black/10 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-[#2c2d3d]'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
          {timerRemaining !== null && (
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
              {Math.floor(timerRemaining / 60)}:{String(timerRemaining % 60).padStart(2, '0')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
