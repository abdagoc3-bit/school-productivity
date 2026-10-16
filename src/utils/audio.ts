/**
 * Web Audio API ambient sound generator and chime synthesizer
 * Zero external audio file dependencies - 100% resilient and offline-capable.
 */
class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private soundNodes: Map<string, { gainNode: GainNode; stop: () => void }> = new Map();
  private masterGain: GainNode | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMasterVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Plays a resonant Tibetan singing bowl chime with harmonics
   */
  public playChime(freq = 432, duration = 3.5) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // Fundamental + harmonic overtones
      const harmonics = [
        { mult: 1, gain: 0.6 },
        { mult: 2.01, gain: 0.25 },
        { mult: 3.03, gain: 0.12 },
        { mult: 4.07, gain: 0.05 }
      ];

      harmonics.forEach(({ mult, gain }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * mult, now);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(gain * 0.4, now + 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(g);
        if (this.masterGain) g.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + duration + 0.1);
      });
    } catch {
      // AudioContext could be blocked if no user gesture
    }
  }

  /**
   * Helper to generate a loopable noise buffer
   */
  private createNoiseBuffer(ctx: AudioContext, seconds = 5): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pinkish noise filter
      lastOut = lastOut * 0.94 + white * 0.06;
      data[i] = lastOut * 3.5;
    }
    return buffer;
  }

  /**
   * Starts ambient sound generator
   */
  public startSound(id: string, volume = 0.5) {
    this.stopSound(id);
    const ctx = this.getContext();
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);
    if (this.masterGain) gainNode.connect(this.masterGain);

    let stopFn = () => {};

    if (id === 'rain') {
      const noiseBuffer = this.createNoiseBuffer(ctx, 4);
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'lowpass';
      bandpass.frequency.setValueAtTime(1400, ctx.currentTime);
      source.connect(bandpass);
      bandpass.connect(gainNode);
      source.start();
      stopFn = () => {
        try { source.stop(); } catch {}
      };
    } else if (id === 'waves') {
      const noiseBuffer = this.createNoiseBuffer(ctx, 6);
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(320, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      source.connect(filter);
      filter.connect(gainNode);
      source.start();
      lfo.start();
      stopFn = () => {
        try {
          source.stop();
          lfo.stop();
        } catch {}
      };
    } else if (id === 'birds') {
      const noiseBuffer = this.createNoiseBuffer(ctx, 5);
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);
      source.connect(filter);
      filter.connect(gainNode);
      source.start();

      let isRunning = true;
      const scheduleChirp = () => {
        if (!isRunning) return;
        const delay = 2500 + Math.random() * 4500;
        setTimeout(() => {
          if (!isRunning) return;
          try {
            const chirpOsc = ctx.createOscillator();
            const chirpGain = ctx.createGain();
            const now = ctx.currentTime;
            const baseFreq = 2200 + Math.random() * 800;
            chirpOsc.type = 'sine';
            chirpOsc.frequency.setValueAtTime(baseFreq, now);
            chirpOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 0.08);
            chirpOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.18);
            chirpGain.gain.setValueAtTime(0.001, now);
            chirpGain.gain.linearRampToValueAtTime(0.08, now + 0.04);
            chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            chirpOsc.connect(chirpGain);
            chirpGain.connect(gainNode);
            chirpOsc.start(now);
            chirpOsc.stop(now + 0.25);
          } catch {}
          scheduleChirp();
        }, delay);
      };
      scheduleChirp();

      stopFn = () => {
        isRunning = false;
        try { source.stop(); } catch {}
      };
    } else if (id === 'fire') {
      const noiseBuffer = this.createNoiseBuffer(ctx, 4);
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, ctx.currentTime);
      source.connect(filter);
      filter.connect(gainNode);
      source.start();

      let isRunning = true;
      const scheduleCrackle = () => {
        if (!isRunning) return;
        const delay = 120 + Math.random() * 400;
        setTimeout(() => {
          if (!isRunning) return;
          try {
            const crackleOsc = ctx.createOscillator();
            const crackleGain = ctx.createGain();
            const now = ctx.currentTime;
            crackleOsc.type = 'triangle';
            crackleOsc.frequency.setValueAtTime(120 + Math.random() * 400, now);
            crackleGain.gain.setValueAtTime(0.09, now);
            crackleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
            crackleOsc.connect(crackleGain);
            crackleGain.connect(gainNode);
            crackleOsc.start(now);
            crackleOsc.stop(now + 0.05);
          } catch {}
          scheduleCrackle();
        }, delay);
      };
      scheduleCrackle();

      stopFn = () => {
        isRunning = false;
        try { source.stop(); } catch {}
      };
    } else if (id === 'stream') {
      const noiseBuffer = this.createNoiseBuffer(ctx, 5);
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(850, ctx.currentTime);
      filter1.Q.setValueAtTime(2.0, ctx.currentTime);
      source.connect(filter1);
      filter1.connect(gainNode);
      source.start();

      stopFn = () => {
        try { source.stop(); } catch {}
      };
    } else if (id === 'bowl') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc3.type = 'sine';
      osc1.frequency.setValueAtTime(216, ctx.currentTime);
      osc2.frequency.setValueAtTime(432, ctx.currentTime);
      osc3.frequency.setValueAtTime(434, ctx.currentTime);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc1.connect(subGain);
      osc2.connect(subGain);
      osc3.connect(subGain);
      subGain.connect(gainNode);
      osc1.start();
      osc2.start();
      osc3.start();

      stopFn = () => {
        try {
          osc1.stop();
          osc2.stop();
          osc3.stop();
        } catch {}
      };
    }

    this.soundNodes.set(id, { gainNode, stop: stopFn });
  }

  public setSoundVolume(id: string, volume: number) {
    const entry = this.soundNodes.get(id);
    if (entry && this.ctx) {
      entry.gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public stopSound(id: string) {
    const entry = this.soundNodes.get(id);
    if (entry) {
      if (this.ctx) {
        entry.gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      }
      setTimeout(() => {
        entry.stop();
        entry.gainNode.disconnect();
      }, 450);
      this.soundNodes.delete(id);
    }
  }

  public stopAll() {
    this.soundNodes.forEach((_, id) => {
      this.stopSound(id);
    });
  }

  public isPlaying(id: string): boolean {
    return this.soundNodes.has(id);
  }
}

export const audioService = new AudioSynthesizer();
