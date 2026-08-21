"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export type SoundCategory =
  | "cinematic"
  | "ambience"
  | "ui-navigation"
  | "ui-buttons"
  | "video"
  | "feedback"
  | "notifications"
  | "system";

export interface SoundConfig {
  category: SoundCategory;
  volume: number;
  enabled: boolean;
}

interface AudioContextState {
  context: AudioContext | null;
  masterGain: GainNode | null;
  categoryGains: Record<SoundCategory, GainNode>;
  initialized: boolean;
  suspended: boolean;
}

const DEFAULT_VOLUMES: Record<SoundCategory, number> = {
  cinematic: 0.6,
  ambience: 0.15,
  "ui-navigation": 0.3,
  "ui-buttons": 0.4,
  video: 0.5,
  feedback: 0.5,
  notifications: 0.4,
  system: 0.3,
};

const STORAGE_KEY = "tmt-sound-config";

function getStoredConfig(): Partial<Record<SoundCategory, SoundConfig>> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function createAudioContext(): AudioContextState {
  const context = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const masterGain = context.createGain();
  masterGain.gain.value = 1;
  masterGain.connect(context.destination);

  const categories: SoundCategory[] = [
    "cinematic",
    "ambience",
    "ui-navigation",
    "ui-buttons",
    "video",
    "feedback",
    "notifications",
    "system",
  ];

  const categoryGains: Record<SoundCategory, GainNode> = {} as Record<SoundCategory, GainNode>;
  const stored = getStoredConfig();

  categories.forEach((cat) => {
    const gain = context.createGain();
    const config = stored[cat];
    gain.gain.value = config?.volume ?? DEFAULT_VOLUMES[cat];
    gain.connect(masterGain);
    categoryGains[cat] = gain;
  });

  return {
    context,
    masterGain,
    categoryGains,
    initialized: true,
    suspended: context.state === "suspended",
  };
}

let audioState: AudioContextState | null = null;

function getAudioState(): AudioContextState {
  if (!audioState) {
    audioState = createAudioContext();
  }
  return audioState;
}

export function useSound() {
  const [muted, setMuted] = useState(false);
  const [reducedAudio, setReducedAudio] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    const storedMuted = localStorage.getItem("tmt-sound-muted") === "true";
    const storedReduced = localStorage.getItem("tmt-sound-reduced") === "true";
    setMuted(storedMuted);
    setReducedAudio(storedReduced);

    const state = getAudioState();
    if (storedMuted) state.masterGain!.gain.value = 0;
    if (storedReduced) {
      Object.values(state.categoryGains).forEach((gain) => {
        gain.gain.value *= 0.2;
      });
    }

    initializedRef.current = true;
  }, []);

  const resumeContext = useCallback(async () => {
    const state = getAudioState();
    if (state.context?.state === "suspended") {
      await state.context.resume();
      state.suspended = false;
    }
  }, []);

  const playTone = useCallback(
    (
      frequency: number | number[],
      duration: number,
      type: OscillatorType = "sine",
      category: SoundCategory = "ui-buttons",
      options: {
        attack?: number;
        decay?: number;
        sustain?: number;
        release?: number;
        detune?: number;
        filterFreq?: number;
        filterQ?: number;
      } = {}
    ) => {
      const state = getAudioState();
      if (!state.context || state.context.state !== "running") return;

      const freqs = Array.isArray(frequency) ? frequency : [frequency];
      const now = state.context.currentTime;
      const gain = state.categoryGains[category];
      const masterGain = state.masterGain!;

      if (muted || gain.gain.value === 0) return;

      freqs.forEach((freq, i) => {
        const osc = state.context!.createOscillator();
        const oscGain = state.context!.createGain();
        const filter = state.context!.createBiquadFilter();

        osc.type = type;
        osc.frequency.value = freq;
        if (options.detune) osc.detune.value = options.detune;

        filter.type = "lowpass";
        filter.frequency.value = options.filterFreq || 2000;
        filter.Q.value = options.filterQ || 1;

        const attack = options.attack || 0.01;
        const decay = options.decay || 0.1;
        const sustain = options.sustain ?? 0.3;
        const release = options.release || duration * 0.5;

        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(1, now + attack);
        oscGain.gain.linearRampToValueAtTime(sustain, now + attack + decay);
        oscGain.gain.setValueAtTime(sustain, now + duration - release);
        oscGain.gain.linearRampToValueAtTime(0, now + duration);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(gain);

        osc.start(now);
        osc.stop(now + duration);
      });
    },
    [muted]
  );

  const playNoise = useCallback(
    (
      duration: number,
      category: SoundCategory = "ui-buttons",
      options: {
        attack?: number;
        decay?: number;
        filterFreq?: number;
        filterType?: BiquadFilterType;
      } = {}
    ) => {
      const state = getAudioState();
      if (!state.context || state.context.state !== "running") return;

      const now = state.context.currentTime;
      const gain = state.categoryGains[category];

      if (muted || gain.gain.value === 0) return;

      const bufferSize = state.context.sampleRate * duration;
      const buffer = state.context.createBuffer(1, bufferSize, state.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = state.context.createBufferSource();
      const sourceGain = state.context.createGain();
      const filter = state.context.createBiquadFilter();

      source.buffer = buffer;
      filter.type = options.filterType || "bandpass";
      filter.frequency.value = options.filterFreq || 1000;
      filter.Q.value = 2;

      const attack = options.attack || 0.005;
      const decay = options.decay || 0.05;

      sourceGain.gain.setValueAtTime(0, now);
      sourceGain.gain.linearRampToValueAtTime(1, now + attack);
      sourceGain.gain.exponentialRampToValueAtTime(0.01, now + attack + decay);

      source.connect(filter);
      filter.connect(sourceGain);
      sourceGain.connect(gain);

      source.start(now);
      source.stop(now + duration);
    },
    [muted]
  );

  const playChord = useCallback(
    (
      frequencies: number[],
      duration: number,
      category: SoundCategory = "cinematic",
      options: {
        attack?: number;
        release?: number;
        type?: OscillatorType;
      } = {}
    ) => {
      const state = getAudioState();
      if (!state.context || state.context.state !== "running") return;

      const now = state.context.currentTime;
      const gain = state.categoryGains[category];

      if (muted || gain.gain.value === 0) return;

      frequencies.forEach((freq) => {
        const osc = state.context!.createOscillator();
        const oscGain = state.context!.createGain();

        osc.type = options.type || "sine";
        osc.frequency.value = freq;

        const attack = options.attack || 0.1;
        const release = options.release || duration * 0.5;

        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(0.5 / frequencies.length, now + attack);
        oscGain.gain.setValueAtTime(0.5 / frequencies.length, now + duration - release);
        oscGain.gain.linearRampToValueAtTime(0, now + duration);

        osc.connect(oscGain);
        oscGain.connect(gain);

        osc.start(now);
        osc.stop(now + duration);
      });
    },
    [muted]
  );

  const setCategoryVolume = useCallback(
    (category: SoundCategory, volume: number) => {
      const state = getAudioState();
      const gain = state.categoryGains[category];
      const clamped = Math.max(0, Math.min(1, volume));
      gain.gain.value = clamped;

      const stored = getStoredConfig();
      stored[category] = { ...stored[category], category, volume: clamped, enabled: clamped > 0 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    },
    []
  );

  const getCategoryVolume = useCallback((category: SoundCategory): number => {
    const state = getAudioState();
    return state.categoryGains[category].gain.value;
  }, []);

  const toggleMute = useCallback(() => {
    const state = getAudioState();
    const newMuted = !muted;
    setMuted(newMuted);
    state.masterGain!.gain.value = newMuted ? 0 : 1;
    localStorage.setItem("tmt-sound-muted", String(newMuted));
  }, [muted]);

  const toggleReducedAudio = useCallback(() => {
    const state = getAudioState();
    const newReduced = !reducedAudio;
    setReducedAudio(newReduced);

    Object.entries(state.categoryGains).forEach(([cat, gain]) => {
      const defaultVol = DEFAULT_VOLUMES[cat as SoundCategory];
      gain.gain.value = newReduced ? defaultVol * 0.2 : defaultVol;
    });

    localStorage.setItem("tmt-sound-reduced", String(newReduced));
  }, [reducedAudio]);

  const playIntroSequence = useCallback(async () => {
    await resumeContext();

    playChord([65.41, 98.0, 130.81], 2, "cinematic", { attack: 0.5, release: 1, type: "sine" });
    await sleep(500);
    playTone(440, 0.5, "sine", "cinematic", { attack: 0.1, release: 0.3, filterFreq: 800 });
    await sleep(300);
    playTone(554.37, 0.5, "sine", "cinematic", { attack: 0.1, release: 0.3, filterFreq: 800 });
    await sleep(300);
    playTone(659.25, 0.5, "sine", "cinematic", { attack: 0.1, release: 0.3, filterFreq: 800 });
    await sleep(400);
    playChord([130.81, 164.81, 196.0, 261.63], 3, "cinematic", { attack: 0.3, release: 1.5, type: "triangle" });
  }, [playChord, playTone, resumeContext]);

  const playImpact = useCallback(() => {
    playTone([40, 60, 80], 1.5, "sine", "cinematic", { attack: 0.01, decay: 0.3, sustain: 0.1, release: 1, filterFreq: 120 });
    playNoise(0.3, "cinematic", { attack: 0.001, decay: 0.1, filterFreq: 200, filterType: "highpass" });
  }, [playTone, playNoise]);

  const playWhoosh = useCallback(() => {
    const state = getAudioState();
    if (!state.context || state.context.state !== "running") return;

    const now = state.context.currentTime;
    const gain = state.categoryGains["cinematic"];
    if (muted || gain.gain.value === 0) return;

    const osc = state.context.createOscillator();
    const oscGain = state.context.createGain();
    const filter = state.context.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.8);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.8);

    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(gain);

    osc.start(now);
    osc.stop(now + 0.8);
  }, [muted]);

  const playUINav = useCallback(() => {
    playTone(880, 0.1, "sine", "ui-navigation", { attack: 0.005, release: 0.08, filterFreq: 2000 });
  }, [playTone]);

  const playUIHover = useCallback(() => {
    playTone(1200, 0.05, "sine", "ui-buttons", { attack: 0.002, release: 0.03, filterFreq: 3000 });
  }, [playTone]);

  const playUIClick = useCallback(() => {
    playTone([600, 400], 0.15, "sine", "ui-buttons", { attack: 0.005, decay: 0.05, release: 0.1 });
  }, [playTone]);

  const playUISuccess = useCallback(() => {
    playChord([523.25, 659.25, 783.99], 0.8, "feedback", { attack: 0.05, release: 0.4, type: "triangle" });
  }, [playChord]);

  const playUIError = useCallback(() => {
    playTone([200, 150], 0.3, "sawtooth", "feedback", { attack: 0.01, release: 0.2 });
  }, [playTone]);

  const playNotification = useCallback(() => {
    playChord([880, 1108.73], 0.5, "notifications", { attack: 0.02, release: 0.3, type: "sine" });
  }, [playChord]);

  const playAmbience = useCallback(
    (enabled: boolean) => {
      const state = getAudioState();
      if (!state.context) return;

      const gain = state.categoryGains["ambience"];
      if (enabled) {
        const osc1 = state.context.createOscillator();
        const osc2 = state.context.createOscillator();
        const oscGain = state.context.createGain();
        const filter = state.context.createBiquadFilter();

        osc1.type = "sine";
        osc1.frequency.value = 32.7;
        osc2.type = "sine";
        osc2.frequency.value = 49.0;

        filter.type = "lowpass";
        filter.frequency.value = 80;

        oscGain.gain.value = 0.1;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(gain);

        osc1.start();
        osc2.start();

        (gain as GainNode & { _ambienceOscs?: OscillatorNode[] })._ambienceOscs = [osc1, osc2];
      } else {
        const oscs = (gain as GainNode & { _ambienceOscs?: OscillatorNode[] })._ambienceOscs;
        oscs?.forEach((o) => o.stop());
      }
    },
    []
  );

  return {
    playTone,
    playNoise,
    playChord,
    playIntroSequence,
    playImpact,
    playWhoosh,
    playUINav,
    playUIHover,
    playUIClick,
    playUISuccess,
    playUIError,
    playNotification,
    playAmbience,
    setCategoryVolume,
    getCategoryVolume,
    toggleMute,
    toggleReducedAudio,
    resumeContext,
    muted,
    reducedAudio,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}