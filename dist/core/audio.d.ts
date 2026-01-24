/**
 * Piano Audio Engine using Web Audio API
 */
/**
 * Convert note name to frequency (Hz)
 * @param note - Note in scientific pitch notation (e.g., "C4", "A#4", "Bb5")
 * @returns Frequency in Hz
 */
export declare function noteToFrequency(note: string): number;
/**
 * Convert chord name to note array
 * @param chord - Chord name (e.g., "C", "Am", "G7")
 * @returns Array of notes in scientific pitch notation
 */
export declare function chordToNotes(chord: string): string[];
export declare class PianoSynth {
    private audioContext;
    private instrument;
    private instrumentPromise;
    private instrumentFailed;
    private audioUnlocked;
    private warmupDone;
    private sustainedNotes;
    private soundfontTimeoutMs;
    constructor();
    /**
     * Play a single note
     * @param note - Note in scientific pitch notation
     * @param duration - Duration in milliseconds (default: 500ms)
     */
    playNote(note: string, duration?: number): Promise<void>;
    /**
     * Play multiple notes simultaneously (chord)
     * @param notes - Array of notes in scientific pitch notation
     * @param duration - Duration in milliseconds (default: 500ms)
     */
    playChord(notes: string[], duration?: number): void;
    /**
     * Play a melody (sequence of notes)
     * @param notes - Array of notes to play in sequence
     * @param durations - Duration of each note in milliseconds
     * @returns Promise that resolves when melody finishes
     */
    playMelody(notes: string[], durations: number[]): Promise<void>;
    /**
     * Start a sustained note that continues until stopSustainedNote is called
     * @param note - Note in scientific pitch notation
     */
    startSustainedNote(note: string): Promise<void>;
    /**
     * Stop a sustained note with a quick fade out
     * @param note - Note in scientific pitch notation
     */
    stopSustainedNote(note: string): void;
    /**
     * Stop all sustained notes
     */
    stopAllSustainedNotes(): void;
    /**
     * Resume audio context (needed after user interaction)
     */
    resume(): Promise<void>;
    private ensureInstrument;
    private waitForInstrumentReady;
    private playSynthNote;
    private ensureAudioContext;
    private unlockAudioContext;
    private warmupInstrument;
    private shouldUseSoundfont;
    private debug;
}
