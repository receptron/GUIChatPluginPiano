/**
 * MulmoChat Piano Plugin Core (Framework-agnostic)
 *
 * Contains the plugin logic without UI components.
 * Can be used by any framework (Vue, React, etc.)
 */
import type { ToolPluginCore, ToolContext, ToolResult } from "gui-chat-protocol";
import type { PianoToolData, PianoJsonData, PianoArgs } from "./types";
export declare const executePiano: (_context: ToolContext, args: PianoArgs) => Promise<ToolResult<PianoToolData, PianoJsonData>>;
export declare const pluginCore: ToolPluginCore<PianoToolData, PianoJsonData, PianoArgs>;
