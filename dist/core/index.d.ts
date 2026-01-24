/**
 * MulmoChat Plugin Core Exports
 *
 * Framework-agnostic types and plugin logic.
 * Import from "@gui-chat-plugin/piano/core"
 */
export type { MelodyData, PianoState, PianoToolData, PianoJsonData, PianoArgs } from "./types";
export { pluginCore, executePiano } from "./plugin";
export { TOOL_NAME, TOOL_DEFINITION, SYSTEM_PROMPT } from "./definition";
export { SAMPLES } from "./samples";
export { PianoSynth, noteToFrequency, chordToNotes } from "./audio";
