/**
 * Piano Plugin Types
 *
 * Piano-specific type definitions only.
 * Common types should be imported directly from gui-chat-protocol.
 */
/** Melody data */
export interface MelodyData {
    notes: string[];
    durations?: number[];
    tempo?: number;
}
/** Piano state */
export interface PianoState {
    activeNotes: string[];
    lastPlayed: string[];
    isPlaying: boolean;
    currentMelodyIndex: number;
    title?: string;
    chord?: string;
    error?: string;
}
/** Data type for UI (stored in result.data) */
export interface PianoToolData {
    state: PianoState;
    melody?: MelodyData;
}
/** Data type for LLM (stored in result.jsonData) */
export interface PianoJsonData {
    success: boolean;
    playedNotes?: string[];
    chord?: string;
    error?: string;
}
/** Arguments type (passed from LLM) */
export interface PianoArgs {
    action: "play_notes" | "play_chord" | "play_melody" | "show_keyboard";
    notes?: string[];
    chord?: string;
    melody?: MelodyData;
    title?: string;
}
