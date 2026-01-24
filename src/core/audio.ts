/**
 * Piano Audio Engine using Web Audio API
 */

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert note name to frequency (Hz)
 * @param note - Note in scientific pitch notation (e.g., "C4", "A#4", "Bb5")
 * @returns Frequency in Hz
 */
export function noteToFrequency(note: string): number {
  const noteMap: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  };

  const match = note.match(/^([A-G]#?b?)(\d)$/);
  if (!match) throw new Error(`Invalid note: ${note}`);

  const [, noteName, octaveStr] = match;
  const octave = parseInt(octaveStr);
  const semitone = noteMap[noteName];

  if (semitone === undefined) {
    throw new Error(`Invalid note name: ${noteName}`);
  }

  // A4 = 440Hz を基準に計算
  const semitonesFromA4 = (octave - 4) * 12 + semitone - 9;
  return 440 * Math.pow(2, semitonesFromA4 / 12);
}

/**
 * Convert chord name to note array
 * @param chord - Chord name (e.g., "C", "Am", "G7")
 * @returns Array of notes in scientific pitch notation
 */
export function chordToNotes(chord: string): string[] {
  const chordMap: Record<string, string[]> = {
    'C': ['C4', 'E4', 'G4'],
    'Cm': ['C4', 'Eb4', 'G4'],
    'C7': ['C4', 'E4', 'G4', 'Bb4'],
    'Cmaj7': ['C4', 'E4', 'G4', 'B4'],
    'D': ['D4', 'F#4', 'A4'],
    'Dm': ['D4', 'F4', 'A4'],
    'E': ['E4', 'G#4', 'B4'],
    'Em': ['E4', 'G4', 'B4'],
    'F': ['F4', 'A4', 'C5'],
    'Fm': ['F4', 'Ab4', 'C5'],
    'G': ['G4', 'B4', 'D5'],
    'Gm': ['G4', 'Bb4', 'D5'],
    'G7': ['G4', 'B4', 'D5', 'F5'],
    'A': ['A4', 'C#5', 'E5'],
    'Am': ['A4', 'C5', 'E5'],
    'Am7': ['A4', 'C5', 'E5', 'G5'],
    'B': ['B4', 'D#5', 'F#5'],
    'Bm': ['B4', 'D5', 'F#5'],
  };

  const notes = chordMap[chord];
  if (!notes) {
    throw new Error(`Unknown chord: ${chord}`);
  }

  return notes;
}

/**
 * Sleep for a given duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// Piano Synthesizer
// ============================================================================

/**
 * Simple piano synthesizer using Web Audio API
 */
type SoundfontNoteNode = AudioNode & { stop: (when?: number) => void };
type SoundfontInstrument = {
  play: (
    note: string,
    when?: number,
    options?: {
      gain?: number;
      duration?: number;
      attack?: number;
      decay?: number;
      sustain?: number;
      release?: number;
      adsr?: [number, number, number, number];
      loop?: boolean;
    }
  ) => unknown;
};

type AudioContextConstructor = new () => AudioContext;
type GlobalWithPianoDebug = typeof globalThis & {
  __pianoDebug?: boolean;
  __pianoAudioContext?: AudioContext;
  __pianoDisableSoundfont?: boolean;
  AudioContext?: AudioContextConstructor;
  webkitAudioContext?: AudioContextConstructor;
};

type SoundfontModule = {
  instrument: (
    audioContext: AudioContext,
    name: string,
    options?: { soundfont?: string; format?: string }
  ) => Promise<SoundfontInstrument>;
};

const WARMUP_NOTES = [
  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
];

type SustainedNote = {
  kind: "soundfont" | "synth";
  oscillator?: OscillatorNode;
  overtone?: OscillatorNode;
  gainNode?: GainNode;
  soundfontNode?: SoundfontNoteNode;
  startTime: number;
  decayInterval: ReturnType<typeof setTimeout>;
};

export class PianoSynth {
  private audioContext: AudioContext | null = null;
  private instrument: SoundfontInstrument | null = null;
  private instrumentPromise: Promise<SoundfontInstrument> | null = null;
  private instrumentFailed = false;
  private audioUnlocked = false;
  private warmupDone = false;
  private sustainedNotes: Map<string, SustainedNote> = new Map();
  private soundfontTimeoutMs = 600;

  constructor() {}

  /**
   * Play a single note
   * @param note - Note in scientific pitch notation
   * @param duration - Duration in milliseconds (default: 500ms)
   */
  async playNote(note: string, duration: number = 500): Promise<void> {
    try {
      const audioContext = this.ensureAudioContext();
      if (!audioContext) {
        this.debug("playNote: no AudioContext available");
        return;
      }

      if (audioContext.state === "suspended") {
        await this.resume();
      }

      const instrumentReady = await this.waitForInstrumentReady(150);

      if (instrumentReady && this.instrument) {
        this.debug("playNote: using soundfont", { note, duration, t: performance.now() });
        this.instrument.play(note, 0, {
          gain: 0.8,
          duration: duration / 1000,
        });
        this.debug("playNote: soundfont dispatched", { note, t: performance.now() });
        return;
      }

      this.debug("playNote: using synth fallback", {
        note,
        duration,
        t: performance.now(),
        instrumentReady,
      });
      // Fallback while soundfont is loading or unavailable.
      this.playSynthNote(note, duration);
      this.debug("playNote: synth dispatched", { note, t: performance.now() });
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  /**
   * Play multiple notes simultaneously (chord)
   * @param notes - Array of notes in scientific pitch notation
   * @param duration - Duration in milliseconds (default: 500ms)
   */
  playChord(notes: string[], duration: number = 500): void {
    notes.forEach(note => this.playNote(note, duration));
  }

  /**
   * Play a melody (sequence of notes)
   * @param notes - Array of notes to play in sequence
   * @param durations - Duration of each note in milliseconds
   * @returns Promise that resolves when melody finishes
   */
  async playMelody(notes: string[], durations: number[]): Promise<void> {
    for (let i = 0; i < notes.length; i++) {
      const duration = durations[i] || 500;
      this.playNote(notes[i], duration);
      await sleep(duration);
    }
  }

  /**
   * Start a sustained note that continues until stopSustainedNote is called
   * @param note - Note in scientific pitch notation
   */
  async startSustainedNote(note: string): Promise<void> {
    try {
      const audioContext = this.ensureAudioContext();
      if (!audioContext) {
        this.debug("startSustainedNote: no AudioContext available");
        return;
      }

      if (audioContext.state !== "running") {
        await this.resume();
      }

      // Stop existing sustained note if any
      this.stopSustainedNote(note);

      const instrumentReady = await this.waitForInstrumentReady(this.soundfontTimeoutMs);
      if (instrumentReady && this.instrument) {
        const now = audioContext.currentTime;
        const maxDuration = 10000; // 10 seconds max
        const soundfontNode = this.instrument.play(note, 0, {
          gain: 0.85,
          attack: 0.003,
          decay: 0.35,
          sustain: 0.6,
          release: 0.2,
          duration: maxDuration / 1000,
        }) as unknown as SoundfontNoteNode | undefined;

        if (soundfontNode) {
          const autoStopTime = setTimeout(() => {
            this.stopSustainedNote(note);
          }, maxDuration);

          this.sustainedNotes.set(note, {
            kind: "soundfont",
            soundfontNode,
            startTime: now,
            decayInterval: autoStopTime,
          });

          this.debug("startSustainedNote: soundfont started", { note, t: performance.now() });
          return;
        }
      }

      const frequency = noteToFrequency(note);
      const oscillator = audioContext.createOscillator();
      const overtone = audioContext.createOscillator();
      const filter = audioContext.createBiquadFilter();
      const gainNode = audioContext.createGain();

      // Blend a soft fundamental with a slightly detuned overtone
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      overtone.type = 'triangle';
      overtone.frequency.value = frequency * 2;
      overtone.detune.value = -6;

      filter.type = 'lowpass';
      filter.frequency.value = 1800;
      filter.Q.value = 0.6;

      // Quick attack, then sustain with decay
      const now = audioContext.currentTime;
      const attackTime = 0.003;
      const initialGain = 0.7;
      const minGain = 0.1;
      const decayDuration = 3000; // 3 seconds to reach minimum
      const maxDuration = 10000; // 10 seconds max

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(initialGain, now + attackTime);

      oscillator.connect(filter);
      overtone.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(now);
      overtone.start(now);

      // Schedule exponential decay over 3 seconds
      gainNode.gain.exponentialRampToValueAtTime(minGain, now + attackTime + decayDuration / 1000);

      // Auto-stop after 10 seconds
      const autoStopTime = setTimeout(() => {
        this.stopSustainedNote(note);
      }, maxDuration);

      this.sustainedNotes.set(note, {
        kind: "synth",
        oscillator,
        overtone,
        gainNode,
        startTime: now,
        decayInterval: autoStopTime,
      });

      this.debug("startSustainedNote: started", { note, t: performance.now() });
    } catch (error) {
      console.error('Error starting sustained note:', error);
    }
  }

  /**
   * Stop a sustained note with a quick fade out
   * @param note - Note in scientific pitch notation
   */
  stopSustainedNote(note: string): void {
    const sustained = this.sustainedNotes.get(note);
    if (!sustained) return;

    const audioContext = this.ensureAudioContext();
    if (!audioContext) return;

    if (sustained.kind === "soundfont") {
      try {
        sustained.soundfontNode?.stop(audioContext.currentTime);
      } catch (error) {
        this.debug("stopSustainedNote: soundfont stop failed", error);
      }
      clearTimeout(sustained.decayInterval);
      this.sustainedNotes.delete(note);
      this.debug("stopSustainedNote: soundfont stopped", { note, t: performance.now() });
      return;
    }

    const now = audioContext.currentTime;
    const releaseTime = 0.12;

    // Fade out
    sustained.gainNode?.gain.cancelScheduledValues(now);
    sustained.gainNode?.gain.setValueAtTime(sustained.gainNode.gain.value, now);
    sustained.gainNode?.gain.exponentialRampToValueAtTime(0.001, now + releaseTime);

    // Stop oscillators
    sustained.oscillator?.stop(now + releaseTime);
    sustained.overtone?.stop(now + releaseTime);

    // Clear auto-stop timer
    clearTimeout(sustained.decayInterval);

    this.sustainedNotes.delete(note);
    this.debug("stopSustainedNote: stopped", { note, t: performance.now() });
  }

  /**
   * Stop all sustained notes
   */
  stopAllSustainedNotes(): void {
    const notes = Array.from(this.sustainedNotes.keys());
    notes.forEach(note => this.stopSustainedNote(note));
    this.debug("stopAllSustainedNotes: stopped all");
  }

  /**
   * Resume audio context (needed after user interaction)
   */
  async resume(): Promise<void> {
    const audioContext = this.ensureAudioContext();
    if (audioContext && audioContext.state !== 'running') {
      this.debug("resume: resuming AudioContext", { state: audioContext.state });
      try {
        await audioContext.resume();
      } catch (error) {
        this.debug("resume: failed", error);
      }
    }
    if (audioContext) {
      this.unlockAudioContext(audioContext);
    }
    void this.ensureInstrument();
  }

  private async ensureInstrument(): Promise<void> {
    const audioContext = this.ensureAudioContext();
    if (!audioContext) {
      this.debug("ensureInstrument: no AudioContext");
      return;
    }
    if (!this.shouldUseSoundfont()) {
      if (!this.instrumentFailed) {
        this.instrumentFailed = true;
        this.debug("ensureInstrument: soundfont disabled");
      }
      return;
    }
    if (this.instrument || this.instrumentFailed) return;
    if (!this.instrumentPromise) {
      this.instrumentPromise = (async () => {
        try {
          this.debug("ensureInstrument: loading soundfont module");
          const Soundfont = (await import("soundfont-player")).default as unknown as SoundfontModule;
          this.debug("ensureInstrument: loading instrument");
          return await Soundfont.instrument(
            audioContext,
            "acoustic_grand_piano",
            { soundfont: "MusyngKite", format: "mp3" }
          );
        } catch (error) {
          this.instrumentFailed = true;
          this.debug("ensureInstrument: failed", error);
          throw error;
        }
      })();
    }

    try {
      this.instrument = await this.instrumentPromise;
      this.debug("ensureInstrument: loaded");
      this.warmupInstrument();
    } catch (error) {
      console.warn("Soundfont load failed, using synth fallback.", error);
    }
  }

  private async waitForInstrumentReady(timeoutMs: number): Promise<boolean> {
    if (!this.shouldUseSoundfont()) {
      return false;
    }

    void this.ensureInstrument();

    if (this.instrument) {
      return true;
    }

    if (!this.instrumentPromise) {
      return false;
    }

    try {
      await Promise.race([this.instrumentPromise, sleep(timeoutMs)]);
    } catch (error) {
      this.debug("waitForInstrumentReady: failed", error);
      return false;
    }

    return this.instrument !== null;
  }

  private playSynthNote(note: string, duration: number): void {
    if (!this.audioContext) {
      this.debug("playSynthNote: no AudioContext");
      return;
    }
    const frequency = noteToFrequency(note);
    const oscillator = this.audioContext.createOscillator();
    const overtone = this.audioContext.createOscillator();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();

    // Blend a soft fundamental with a slightly detuned overtone.
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    overtone.type = 'triangle';
    overtone.frequency.value = frequency * 2;
    overtone.detune.value = -6;

    filter.type = 'lowpass';
    filter.frequency.value = 1800;
    filter.Q.value = 0.6;

    // ADSR envelope for more natural sound
    const now = this.audioContext.currentTime;
    const attackTime = 0.003;  // quick hammer attack
    const decayTime = 0.25;    // longer decay
    const sustainLevel = 0.08; // piano-like sustain
    const releaseTime = 0.12;  // short release

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.7, now + attackTime);
    gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
    const releaseStart = Math.max(now + attackTime + decayTime, now + duration / 1000 - releaseTime);
    gainNode.gain.setValueAtTime(sustainLevel, releaseStart);
    gainNode.gain.exponentialRampToValueAtTime(0.001, releaseStart + releaseTime);

    oscillator.connect(filter);
    overtone.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(now);
    overtone.start(now);
    oscillator.stop(releaseStart + releaseTime);
    overtone.stop(releaseStart + releaseTime);
  }

  private ensureAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        const globalWithPiano = globalThis as GlobalWithPianoDebug;
        const AudioContextConstructor =
          globalWithPiano.AudioContext || globalWithPiano.webkitAudioContext;
        if (!AudioContextConstructor) {
          console.warn("AudioContext is not supported in this browser.");
          return null;
        }
        this.audioContext = new AudioContextConstructor();
        globalWithPiano.__pianoAudioContext = this.audioContext;
        const createdContext = this.audioContext;
        this.debug("ensureAudioContext: created", { state: createdContext.state });
      } catch (error) {
        console.warn("Failed to create AudioContext.", error);
        return null;
      }
    }
    const readyContext = this.audioContext;
    this.debug("ensureAudioContext: ready", { state: readyContext.state });
    return readyContext;
  }

  private unlockAudioContext(audioContext: AudioContext): void {
    if (this.audioUnlocked) return;
    try {
      const buffer = audioContext.createBuffer(1, 1, audioContext.sampleRate);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      const now = audioContext.currentTime;
      source.start(now);
      source.stop(now + 0.01);
      this.audioUnlocked = true;
      this.debug("unlockAudioContext: ok");
    } catch (error) {
      this.debug("unlockAudioContext: failed", error);
    }
  }

  private warmupInstrument(): void {
    if (this.warmupDone || !this.instrument) return;
    WARMUP_NOTES.forEach((note, index) => {
      this.instrument?.play(note, index * 0.01, { gain: 0.0001, duration: 0.05 });
    });
    this.warmupDone = true;
    this.debug("warmup: scheduled", { count: WARMUP_NOTES.length });
  }

  private shouldUseSoundfont(): boolean {
    if ((globalThis as GlobalWithPianoDebug).__pianoDisableSoundfont) return false;
    return true;
  }

  private debug(message: string, data?: unknown): void {
    if (!(globalThis as GlobalWithPianoDebug).__pianoDebug) return;
    if (data === undefined) {
      console.log(`[PianoSynth] ${message}`);
      return;
    }
    console.log(`[PianoSynth] ${message}`, data);
  }
}
