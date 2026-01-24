/**
 * MulmoChat Piano Plugin - Vue Implementation
 *
 * Full Vue plugin with UI components.
 * Import from "@gui-chat-plugin/piano/vue"
 */
import "../style.css";
import type { ToolPlugin } from "gui-chat-protocol/vue";
import type { PianoToolData, PianoJsonData, PianoArgs } from "../core/types";
import View from "./View.vue";
import Preview from "./Preview.vue";
/**
 * Piano plugin instance with Vue components
 */
export declare const plugin: ToolPlugin<PianoToolData, PianoJsonData, PianoArgs>;
export type { MelodyData, PianoState, PianoToolData, PianoJsonData, PianoArgs } from "../core/types";
export { pluginCore, executePiano } from "../core/plugin";
export { TOOL_NAME, TOOL_DEFINITION, SYSTEM_PROMPT } from "../core/definition";
export { SAMPLES } from "../core/samples";
export { PianoSynth, noteToFrequency, chordToNotes } from "../core/audio";
export { View, Preview };
declare const _default: {
    plugin: ToolPlugin<PianoToolData, PianoJsonData, PianoArgs, import("gui-chat-protocol/vue").InputHandler, Record<string, unknown>>;
};
export default _default;
