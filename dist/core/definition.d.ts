/**
 * Piano Tool Definition (Schema)
 */
import type { ToolDefinition } from "gui-chat-protocol";
export declare const TOOL_NAME = "playPiano";
export declare const TOOL_DEFINITION: ToolDefinition;
export declare const SYSTEM_PROMPT = "You have access to an interactive piano (playPiano). Use it when:\n- The user asks to play music or hear notes\n- The user wants to learn chords or scales\n- The user asks for musical examples\n\nNotes use scientific pitch notation: C4 is middle C, A4 is 440Hz.\nAvailable octaves: 3, 4, 5 (C3 to B5)\n\nCommon chords: C, Cm, C7, Cmaj7, D, Dm, E, Em, F, Fm, G, Gm, G7, A, Am, Am7, B, Bm\n\nExamples:\n- C major scale: [\"C4\", \"D4\", \"E4\", \"F4\", \"G4\", \"A4\", \"B4\", \"C5\"]\n- Twinkle Twinkle: [\"C4\", \"C4\", \"G4\", \"G4\", \"A4\", \"A4\", \"G4\"]\n";
