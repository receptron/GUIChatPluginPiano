/**
 * Piano Sample Data
 */

import type { ToolSample } from "gui-chat-protocol";
import type { PianoArgs } from "./types";

export const SAMPLES: Array<ToolSample & { args: PianoArgs }> = [
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
  {
    name: "Mary Had a Little Lamb",
    args: {
      action: "play_melody",
      melody: {
        notes: [
          "E4", "D4", "C4", "D4", "E4", "E4", "E4",
          "D4", "D4", "D4", "E4", "G4", "G4",
          "E4", "D4", "C4", "D4", "E4", "E4", "E4", "E4",
          "D4", "D4", "E4", "D4", "C4",
        ],
        durations: [
          500, 500, 500, 500, 500, 500, 1000,
          500, 500, 1000, 500, 500, 1000,
          500, 500, 500, 500, 500, 500, 500, 500,
          500, 500, 500, 500, 1000,
        ],
      },
      title: "Mary Had a Little Lamb",
    },
  },
  {
    name: "London Bridge",
    args: {
      action: "play_melody",
      melody: {
        notes: [
          "G4", "A4", "G4", "F4", "E4", "F4", "G4",
          "D4", "E4", "F4", "E4", "F4", "G4",
          "G4", "A4", "G4", "F4", "E4", "F4", "G4",
          "D4", "G4", "E4", "C4",
        ],
        durations: [
          500, 500, 500, 500, 500, 500, 1000,
          500, 500, 1000, 500, 500, 1000,
          500, 500, 500, 500, 500, 500, 1000,
          500, 500, 500, 1000,
        ],
      },
      title: "London Bridge Is Falling Down",
    },
  },
  {
    name: "Old MacDonald",
    args: {
      action: "play_melody",
      melody: {
        notes: [
          "G4", "G4", "G4", "D4", "E4", "E4", "D4",
          "B3", "B3", "A3", "A3", "G4",
          "D4", "D4", "G4", "G4", "A4",
          "G4", "G4", "E4", "E4", "D4",
        ],
        durations: [
          500, 500, 500, 500, 500, 500, 1000,
          500, 500, 500, 500, 1000,
          500, 500, 500, 500, 1000,
          500, 500, 500, 500, 1000,
        ],
      },
      title: "Old MacDonald Had a Farm",
    },
  },
  {
    name: "Momotaro",
    args: {
      action: "play_melody",
      melody: {
        notes: [
          "G4", "E4", "E4", "F4", "D4", "D4", "E4", "C4", "C4", "D4",
          "E4", "C4", "D4", "E4", "G4", "E4", "D4", "C4",
        ],
        durations: [
          500, 500, 500, 500, 500, 500, 500, 500, 500, 1000,
          500, 500, 500, 500, 500, 500, 500, 1000,
        ],
      },
      title: "桃太郎 (Momotaro)",
    },
  },
  {
    name: "Usagi to Kame",
    args: {
      action: "play_melody",
      melody: {
        notes: [
          "C4", "D4", "E4", "C4", "E4", "F4", "G4",
          "C5", "G4", "E4", "C4", "D4", "D4", "C4",
          "G4", "G4", "A4", "G4", "F4", "E4", "D4",
          "C4", "E4", "G4", "C5", "C5", "C5",
        ],
        durations: [
          500, 500, 500, 500, 500, 500, 1000,
          500, 500, 500, 500, 500, 500, 1000,
          500, 500, 500, 500, 500, 500, 1000,
          500, 500, 500, 500, 500, 1000,
        ],
      },
      title: "うさぎとかめ (Usagi to Kame)",
    },
  },
  {
    name: "Kintaro",
    args: {
      action: "play_melody",
      melody: {
        notes: [
          "C4", "E4", "G4", "E4", "C4", "E4", "G4",
          "A4", "G4", "E4", "D4", "C4",
          "E4", "E4", "D4", "D4", "C4", "E4", "G4",
          "C5", "G4", "E4", "C4",
        ],
        durations: [
          500, 500, 500, 500, 500, 500, 1000,
          500, 500, 500, 500, 1000,
          500, 500, 500, 500, 500, 500, 1000,
          500, 500, 500, 1000,
        ],
      },
      title: "金太郎 (Kintaro)",
    },
  },
];
