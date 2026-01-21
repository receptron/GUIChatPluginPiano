/**
 * Piano Tool Definition (Schema)
 */

import type { ToolDefinition } from "gui-chat-protocol";

export const TOOL_NAME = "playPiano";

export const TOOL_DEFINITION: ToolDefinition = {
  type: "function",
  name: TOOL_NAME,
  description:
    "Display an interactive piano keyboard and play notes, chords, or melodies. Use this when the user wants to play music, learn piano, or hear musical examples.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["play_notes", "play_chord", "play_melody", "show_keyboard"],
        description:
          "Action to perform: play_notes (single/multiple notes), play_chord (named chord), play_melody (sequence), show_keyboard (display only)",
      },
      notes: {
        type: "array",
        items: { type: "string" },
        description:
          "Notes to play (e.g., ['C4', 'E4', 'G4']). Use scientific pitch notation.",
      },
      chord: {
        type: "string",
        description: "Chord name (e.g., 'C', 'Am', 'G7', 'Cmaj7')",
      },
      melody: {
        type: "object",
        properties: {
          notes: {
            type: "array",
            items: { type: "string" },
            description: "Sequence of notes to play",
          },
          durations: {
            type: "array",
            items: { type: "number" },
            description: "Duration of each note in milliseconds",
          },
          tempo: {
            type: "number",
            description: "Tempo in BPM (default: 120)",
          },
        },
        required: ["notes"],
      },
      title: {
        type: "string",
        description: "Optional title for the piano display",
      },
    },
    required: ["action"],
  },
};

export const SYSTEM_PROMPT = `You have access to an interactive piano (${TOOL_NAME}). Use it when:
- The user asks to play music or hear notes
- The user wants to learn chords or scales
- The user asks for musical examples

Notes use scientific pitch notation: C4 is middle C, A4 is 440Hz.
Available octaves: 3, 4, 5 (C3 to B5)

Common chords: C, Cm, C7, Cmaj7, D, Dm, E, Em, F, Fm, G, Gm, G7, A, Am, Am7, B, Bm

Examples:
- C major scale: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]
- Twinkle Twinkle: ["C4", "C4", "G4", "G4", "A4", "A4", "G4"]
`;
