/**
 * MulmoChat Piano Plugin - Vue Implementation
 *
 * Full Vue plugin with UI components.
 * Import from "@gui-chat-plugin/piano/vue"
 */

// Import styles for Vue components
import "../style.css";

import type { ToolPlugin } from "gui-chat-protocol/vue";
import type { PianoToolData, PianoJsonData, PianoArgs } from "../core/types";
import { pluginCore } from "../core/plugin";
import View from "./View.vue";
import Preview from "./Preview.vue";

// ============================================================================
// Vue Plugin (with components)
// ============================================================================

/**
 * Piano plugin instance with Vue components
 */
export const plugin: ToolPlugin<PianoToolData, PianoJsonData, PianoArgs> = {
  ...pluginCore,
  viewComponent: View,
  previewComponent: Preview,
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

// Default export for MulmoChat compatibility: { plugin }
export default { plugin };
