/**
 * MulmoChat Plugin Core Exports
 *
 * Framework-agnostic types and plugin logic.
 * Import from "@gui-chat-plugin/piano/core"
 */

// Piano-specific types
export type { MelodyData, PianoState, PianoToolData, PianoJsonData, PianoArgs } from "./types";

// Core plugin
export { pluginCore, executePiano } from "./plugin";
export { TOOL_NAME, TOOL_DEFINITION, SYSTEM_PROMPT } from "./definition";
export { SAMPLES } from "./samples";

// Audio utilities
export { PianoSynth, noteToFrequency, chordToNotes } from "./audio";
