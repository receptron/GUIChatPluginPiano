/**
 * MulmoChat Piano Plugin - React Implementation
 *
 * Full React plugin with UI components.
 * Import from "@gui-chat-plugin/piano/react"
 */
import "../style.css";
import type { ToolPluginReact } from "gui-chat-protocol/react";
import type { PianoToolData, PianoJsonData, PianoArgs } from "../core/types";
import { View } from "./View";
import { Preview } from "./Preview";
/**
 * Piano plugin instance with React components
 */
export declare const plugin: ToolPluginReact<PianoToolData, PianoJsonData, PianoArgs>;
export type { MelodyData, PianoState, PianoToolData, PianoJsonData, PianoArgs } from "../core/types";
export { pluginCore, executePiano } from "../core/plugin";
export { TOOL_NAME, TOOL_DEFINITION, SYSTEM_PROMPT } from "../core/definition";
export { SAMPLES } from "../core/samples";
export { PianoSynth, noteToFrequency, chordToNotes } from "../core/audio";
export { View, Preview };
declare const _default: {
    plugin: ToolPluginReact<PianoToolData, PianoJsonData, PianoArgs, import("gui-chat-protocol/react").InputHandler, Record<string, unknown>>;
};
export default _default;
