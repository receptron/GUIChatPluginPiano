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
export class PianoSynth {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new AudioContext();
  }

  /**
   * Play a single note
   * @param note - Note in scientific pitch notation
   * @param duration - Duration in milliseconds (default: 500ms)
   */
  playNote(note: string, duration: number = 500): void {
    try {
      const frequency = noteToFrequency(note);
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Use a more piano-like waveform (triangle is softer than sine)
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;

      // ADSR envelope for more natural sound
      const now = this.audioContext.currentTime;
      const attackTime = 0.01;  // 10ms attack
      const decayTime = 0.1;    // 100ms decay
      const sustainLevel = 0.3; // 30% sustain level
      const releaseTime = 0.1;  // 100ms release

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.5, now + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      gainNode.gain.setValueAtTime(sustainLevel, now + duration / 1000 - releaseTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + duration / 1000);
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
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}
