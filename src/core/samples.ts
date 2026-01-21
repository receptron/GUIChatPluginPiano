/**
 * Piano Sample Data
 */

import type { ToolSample } from "gui-chat-protocol";

export const SAMPLES: ToolSample[] = [
  {
    name: "Show Keyboard",
    args: {
      action: "show_keyboard",
      title: "Piano",
    },
  },
  {
    name: "Play C Major Chord",
    args: {
      action: "play_chord",
      chord: "C",
      title: "C Major",
    },
  },
  {
    name: "Play Am Chord",
    args: {
      action: "play_chord",
      chord: "Am",
      title: "A Minor",
    },
  },
  {
    name: "Play Single Note (C4)",
    args: {
      action: "play_notes",
      notes: ["C4"],
      title: "Middle C",
    },
  },
  {
    name: "Play C Major Scale",
    args: {
      action: "play_melody",
      melody: {
        notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
        durations: [400, 400, 400, 400, 400, 400, 400, 800],
        tempo: 120,
      },
      title: "C Major Scale",
    },
  },
  {
    name: "Twinkle Twinkle",
    args: {
      action: "play_melody",
      melody: {
        notes: [
          "C4", "C4", "G4", "G4", "A4", "A4", "G4",
          "F4", "F4", "E4", "E4", "D4", "D4", "C4",
        ],
        durations: [
          500, 500, 500, 500, 500, 500, 1000,
          500, 500, 500, 500, 500, 500, 1000,
        ],
      },
      title: "Twinkle Twinkle Little Star",
    },
  },
];
