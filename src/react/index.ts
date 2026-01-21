/**
 * MulmoChat Piano Plugin - React Implementation
 *
 * Full React plugin with UI components.
 * Import from "@gui-chat-plugin/piano/react"
 */

// Import styles for React components
import "../style.css";

import type { ToolPluginReact } from "gui-chat-protocol/react";
import type { PianoToolData, PianoJsonData, PianoArgs } from "../core/types";
import { pluginCore } from "../core/plugin";
import { View } from "./View";
import { Preview } from "./Preview";

// ============================================================================
// React Plugin (with components)
// ============================================================================

/**
 * Piano plugin instance with React components
 */
export const plugin: ToolPluginReact<PianoToolData, PianoJsonData, PianoArgs> = {
  ...pluginCore,
  ViewComponent: View,
  PreviewComponent: Preview,
};

// Piano-specific types
export type { MelodyData, PianoState, PianoToolData, PianoJsonData, PianoArgs } from "../core/types";

// Core plugin utilities
export { pluginCore, executePiano } from "../core/plugin";
export { TOOL_NAME, TOOL_DEFINITION, SYSTEM_PROMPT } from "../core/definition";
export { SAMPLES } from "../core/samples";
export { PianoSynth, noteToFrequency, chordToNotes } from "../core/audio";

// Export components for direct use
export { View, Preview };

// Default export for compatibility: { plugin }
export default { plugin };
