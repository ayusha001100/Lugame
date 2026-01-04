import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

// Sound effect URLs (using Web Audio API with generated sounds)
const SOUNDS = {
  click: 'click',
  success: 'success',
  failure: 'failure',
  levelUp: 'levelUp',
  xp: 'xp',
  transition: 'transition',
} as const;

type SoundType = keyof typeof SOUNDS;

export const useAudio = () => {
  const { audio, toggleMusic, toggleSfx, setAudio } = useGameStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      musicGainRef.current = audioContextRef.current.createGain();
      musicGainRef.current.connect(audioContextRef.current.destination);
      musicGainRef.current.gain.value = audio.volume * 0.3;
    }
    return audioContextRef.current;
  }, [audio.volume]);

  // Generate ambient music using Web Audio API
  const startAmbientMusic = useCallback(() => {
    const ctx = initAudioContext();
    if (oscillatorRef.current) return;

    // Create a calm ambient drone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.value = 110; // A2
    osc2.type = 'sine';
    osc2.frequency.value = 165; // E3

    filter.type = 'lowpass';
    filter.frequency.value = 400;

    gain1.gain.value = 0.15 * audio.volume;
    gain2.gain.value = 0.1 * audio.volume;

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(filter);
    gain2.connect(filter);
    filter.connect(ctx.destination);

    // Add gentle modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 5;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    osc1.start();
    osc2.start();
    lfo.start();

    oscillatorRef.current = osc1;
  }, [audio.volume, initAudioContext]);

  const stopAmbientMusic = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
  }, []);

  // Play sound effects
  const playSfx = useCallback((type: SoundType) => {
    if (!audio.isSfxEnabled) return;

    const ctx = initAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.2 * audio.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'success':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now); // C5
        osc.frequency.setValueAtTime(659, now + 0.1); // E5
        osc.frequency.setValueAtTime(784, now + 0.2); // G5
        gain.gain.setValueAtTime(0.3 * audio.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'failure':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.15 * audio.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'levelUp':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
        gain.gain.setValueAtTime(0.25 * audio.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;

      case 'xp':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.1);
        gain.gain.setValueAtTime(0.15 * audio.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;

      case 'transition':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0.1 * audio.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
    }
  }, [audio.isSfxEnabled, audio.volume, initAudioContext]);

  // Manage ambient music
  useEffect(() => {
    if (audio.isMusicPlaying) {
      startAmbientMusic();
    } else {
      stopAmbientMusic();
    }

    return () => stopAmbientMusic();
  }, [audio.isMusicPlaying, startAmbientMusic, stopAmbientMusic]);

  return {
    isMusicPlaying: audio.isMusicPlaying,
    isSfxEnabled: audio.isSfxEnabled,
    volume: audio.volume,
    toggleMusic,
    toggleSfx,
    setVolume: (volume: number) => setAudio({ volume }),
    playSfx,
  };
};
