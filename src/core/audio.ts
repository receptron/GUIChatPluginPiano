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
type SoundfontInstrument = {
  play: (note: string, when?: number, options?: { gain?: number; duration?: number }) => void;
};

export class PianoSynth {
  private audioContext: AudioContext | null = null;
  private instrument: SoundfontInstrument | null = null;
  private instrumentPromise: Promise<SoundfontInstrument> | null = null;
  private instrumentFailed = false;

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

      await this.ensureInstrument();

      if (this.instrument) {
        this.debug("playNote: using soundfont", { note, duration });
        this.instrument.play(note, audioContext.currentTime, {
          gain: 0.8,
          duration: duration / 1000,
        });
        return;
      }

      this.debug("playNote: using synth fallback", { note, duration });
      // Fallback while soundfont is loading or unavailable.
      this.playSynthNote(note, duration);
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
   * Resume audio context (needed after user interaction)
   */
  async resume(): Promise<void> {
    const audioContext = this.ensureAudioContext();
    if (audioContext && audioContext.state === 'suspended') {
      this.debug("resume: resuming AudioContext");
      await audioContext.resume();
    }
    void this.ensureInstrument();
  }

  private async ensureInstrument(): Promise<void> {
    const audioContext = this.ensureAudioContext();
    if (!audioContext) {
      this.debug("ensureInstrument: no AudioContext");
      return;
    }
    if (this.instrument || this.instrumentFailed) return;
    if (!this.instrumentPromise) {
      this.instrumentPromise = (async () => {
        try {
          this.debug("ensureInstrument: loading soundfont module");
          // @ts-expect-error soundfont-player has no types
          const Soundfont = (await import("soundfont-player")).default;
          this.debug("ensureInstrument: loading instrument");
          return await Soundfont.instrument(
            audioContext,
            "acoustic_grand_piano",
            { soundfont: "MusyngKite" }
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
    } catch (error) {
      console.warn("Soundfont load failed, using synth fallback.", error);
    }
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
        this.audioContext = new AudioContext();
        (globalThis as any).__pianoAudioContext = this.audioContext;
        this.debug("ensureAudioContext: created", { state: this.audioContext.state });
      } catch (error) {
        console.warn("Failed to create AudioContext.", error);
        return null;
      }
    }
    this.debug("ensureAudioContext: ready", { state: this.audioContext.state });
    return this.audioContext;
  }

  private debug(message: string, data?: unknown): void {
    if (!(globalThis as any).__pianoDebug) return;
    if (data === undefined) {
      console.log(`[PianoSynth] ${message}`);
      return;
    }
    console.log(`[PianoSynth] ${message}`, data);
  }
}
