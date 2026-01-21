/**
 * Piano View Component (React)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { ViewComponentProps } from "gui-chat-protocol";
import type { PianoToolData, PianoJsonData } from "../core/types";
import { PianoSynth } from "../core/audio";
import { TOOL_NAME } from "../core/definition";

type ViewProps = ViewComponentProps<PianoToolData, PianoJsonData>;

export function View({ selectedResult }: ViewProps) {
  const [pianoData, setPianoData] = useState<PianoToolData | null>(null);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const synthRef = useRef<PianoSynth | null>(null);

  useEffect(() => {
    synthRef.current = new PianoSynth();

    return () => {
      synthRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (selectedResult?.toolName === TOOL_NAME && selectedResult.data) {
      const data = selectedResult.data as PianoToolData;
      setPianoData(data);

      // Auto-play based on action
      if (data.state.lastPlayed.length > 0) {
        data.state.lastPlayed.forEach((note) => {
          playNote(note);
          setTimeout(() => releaseNote(note), 500);
        });
      }

      // Auto-play melody if isPlaying is true
      if (data.state.isPlaying && data.melody) {
        playMelodySequence(data);
      }
    }
  }, [selectedResult]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      const note = keyMap[key];
      if (note) {
        playNote(note);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const note = keyMap[key];
      if (note) {
        releaseNote(note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const playNote = async (note: string) => {
    if (synthRef.current) {
      await synthRef.current.resume();
      synthRef.current.playNote(note);
      setActiveNotes((prev) => new Set(prev).add(note));
    }
  };

  const releaseNote = (note: string) => {
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  };

  const playMelodySequence = useCallback(async (data: PianoToolData) => {
    if (!data.melody || isPlayingMelody) return;

    setIsPlayingMelody(true);
    const melody = data.melody;
    const durations = melody.durations || melody.notes.map(() => 500);

    try {
      if (synthRef.current) {
        await synthRef.current.resume();
        await synthRef.current.playMelody(melody.notes, durations);
      }
    } finally {
      setIsPlayingMelody(false);
    }
  }, [isPlayingMelody]);

  const isNoteActive = (note: string) => activeNotes.has(note);

  const hasMelody = pianoData?.melody && pianoData.melody.notes.length > 0;

  if (!pianoData) {
    return null;
  }

  return (
    <div className="w-full min-h-[600px] overflow-x-auto overflow-y-auto p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-lg">
      <div className="w-full mx-auto min-h-[500px] flex flex-col justify-center">
        {/* Title */}
        {pianoData.state.title && (
          <h2 className="text-white text-3xl font-bold mb-8 text-center">
            {pianoData.state.title}
          </h2>
        )}

        {/* Chord Display */}
        {pianoData.state.chord && (
          <div className="text-center mb-6 text-2xl font-semibold text-purple-300">
            {pianoData.state.chord}
          </div>
        )}

        {/* Piano Keyboard */}
        <div className="flex justify-center mb-8">
          <div className="relative inline-block">
            {/* White Keys */}
            <div className="flex">
              {whiteKeys.map((key) => (
                <div
                  key={key.note}
                  className={`relative w-12 h-40 bg-white border-2 border-gray-300 rounded-b-lg cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors duration-75 flex items-end justify-center pb-3 ${
                    isNoteActive(key.note) ? "!bg-blue-200 !border-blue-400" : ""
                  }`}
                  onMouseDown={() => playNote(key.note)}
                  onMouseUp={() => releaseNote(key.note)}
                  onMouseLeave={() => releaseNote(key.note)}
                >
                  <span className="text-xs text-gray-500 font-semibold select-none">
                    {key.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Black Keys (absolute positioning) */}
            {blackKeys.map((key) => (
              <div
                key={key.note}
                className={`absolute w-8 h-24 bg-gray-900 border-2 border-gray-700 rounded-b-md cursor-pointer z-10 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-75 ${
                  isNoteActive(key.note) ? "!bg-blue-600 !border-blue-500" : ""
                }`}
                style={{ left: `${key.position}px` }}
                onMouseDown={() => playNote(key.note)}
                onMouseUp={() => releaseNote(key.note)}
                onMouseLeave={() => releaseNote(key.note)}
              />
            ))}
          </div>
        </div>

        {/* Melody Controls */}
        {hasMelody && (
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => playMelodySequence(pianoData)}
              disabled={isPlayingMelody}
              className={`py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
                isPlayingMelody
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {isPlayingMelody ? "Playing..." : "Play Melody"}
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-gray-300 text-sm">
          <p>Click keys to play notes</p>
          <p className="mt-1 text-gray-400">Keyboard: A-K keys play C4-C5</p>
        </div>
      </div>
    </div>
  );
}

export default View;

// Piano keyboard layout (2 octaves: C3-B5)
const whiteKeys = [
  { note: "C3", label: "C" },
  { note: "D3", label: "D" },
  { note: "E3", label: "E" },
  { note: "F3", label: "F" },
  { note: "G3", label: "G" },
  { note: "A3", label: "A" },
  { note: "B3", label: "B" },
  { note: "C4", label: "C" },
  { note: "D4", label: "D" },
  { note: "E4", label: "E" },
  { note: "F4", label: "F" },
  { note: "G4", label: "G" },
  { note: "A4", label: "A" },
  { note: "B4", label: "B" },
  { note: "C5", label: "C" },
  { note: "D5", label: "D" },
  { note: "E5", label: "E" },
  { note: "F5", label: "F" },
  { note: "G5", label: "G" },
  { note: "A5", label: "A" },
  { note: "B5", label: "B" },
];

const keyWidth = 48;
const blackKeyWidth = 32;
const blackKeys = [
  { note: "C#3", position: keyWidth - blackKeyWidth / 2 },
  { note: "D#3", position: keyWidth * 2 - blackKeyWidth / 2 },
  { note: "F#3", position: keyWidth * 4 - blackKeyWidth / 2 },
  { note: "G#3", position: keyWidth * 5 - blackKeyWidth / 2 },
  { note: "A#3", position: keyWidth * 6 - blackKeyWidth / 2 },
  { note: "C#4", position: keyWidth * 8 - blackKeyWidth / 2 },
  { note: "D#4", position: keyWidth * 9 - blackKeyWidth / 2 },
  { note: "F#4", position: keyWidth * 11 - blackKeyWidth / 2 },
  { note: "G#4", position: keyWidth * 12 - blackKeyWidth / 2 },
  { note: "A#4", position: keyWidth * 13 - blackKeyWidth / 2 },
  { note: "C#5", position: keyWidth * 15 - blackKeyWidth / 2 },
  { note: "D#5", position: keyWidth * 16 - blackKeyWidth / 2 },
  { note: "F#5", position: keyWidth * 18 - blackKeyWidth / 2 },
  { note: "G#5", position: keyWidth * 19 - blackKeyWidth / 2 },
  { note: "A#5", position: keyWidth * 20 - blackKeyWidth / 2 },
];

const keyMap: Record<string, string> = {
  "a": "C4", "w": "C#4", "s": "D4", "e": "D#4", "d": "E4",
  "f": "F4", "t": "F#4", "g": "G4", "y": "G#4", "h": "A4",
  "u": "A#4", "j": "B4", "k": "C5",
};
