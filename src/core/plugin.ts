/**
 * MulmoChat Piano Plugin Core (Framework-agnostic)
 *
 * Contains the plugin logic without UI components.
 * Can be used by any framework (Vue, React, etc.)
 */

import type { ToolPluginCore, ToolContext, ToolResult } from "gui-chat-protocol";
import type { PianoToolData, PianoJsonData, PianoArgs, PianoState } from "./types";
import { TOOL_DEFINITION, SYSTEM_PROMPT, TOOL_NAME } from "./definition";
import { SAMPLES } from "./samples";
import { chordToNotes } from "./audio";

// ============================================================================
// Execute Function
// ============================================================================

export const executePiano = async (
  _context: ToolContext,
  args: PianoArgs,
): Promise<ToolResult<PianoToolData, PianoJsonData>> => {
  const { action, notes, chord, melody, title } = args;

  try {
    let playedNotes: string[] = [];
    let state: PianoState = {
      activeNotes: [],
      lastPlayed: [],
      isPlaying: false,
      currentMelodyIndex: 0,
      title,
    };

    switch (action) {
      case "play_notes":
        playedNotes = notes || [];
        state.lastPlayed = playedNotes;
        state.activeNotes = playedNotes;
        break;

      case "play_chord":
        if (chord) {
          playedNotes = chordToNotes(chord);
          state.lastPlayed = playedNotes;
          state.activeNotes = playedNotes;
          state.chord = chord;
        }
        break;

      case "play_melody":
        if (melody) {
          playedNotes = melody.notes;
          state.isPlaying = true;
        }
        break;

      case "show_keyboard":
        // 鍵盤表示のみ
        break;
    }

    return {
      toolName: TOOL_NAME,
      data: { state, melody },
      jsonData: { success: true, playedNotes, chord },
      message: `Played: ${playedNotes.join(", ") || "keyboard shown"}`,
      title: title || chord || "Piano",
      instructions:
        action === "play_melody"
          ? "The melody is now playing. Ask the user if they enjoyed it."
          : "The piano is ready. Ask the user what they would like to play next.",
    };
  } catch (error) {
    return {
      message: `Error: ${error}`,
      jsonData: { success: false, error: String(error) },
      instructions: "Acknowledge the error and suggest trying again with different notes or chords.",
    };
  }
};

// ============================================================================
// Core Plugin (without UI components)
// ============================================================================

export const pluginCore: ToolPluginCore<PianoToolData, PianoJsonData, PianoArgs> = {
  toolDefinition: TOOL_DEFINITION,
  execute: executePiano,
  generatingMessage: "Preparing piano...",
  isEnabled: () => true, // 外部 API 不要
  systemPrompt: SYSTEM_PROMPT,
  samples: SAMPLES,
};
