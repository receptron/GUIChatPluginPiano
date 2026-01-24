/**
 * Piano View Component (React)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { ViewComponentProps } from "gui-chat-protocol";
import type { PianoToolData, PianoJsonData } from "../core/types";
import { PianoSynth } from "../core/audio";
import { TOOL_NAME } from "../core/definition";
import { SAMPLES } from "../core/samples";

type ViewProps = ViewComponentProps<PianoToolData, PianoJsonData>;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const playNote = useCallback(async (note: string) => {
    setActiveNotes((prev) => {
      const nextNotes = new Set(prev);
      nextNotes.add(note);
      return nextNotes;
    });
    if (synthRef.current) {
      await synthRef.current.resume();
      synthRef.current.startSustainedNote(note);
    }
  }, []);

  const releaseNote = useCallback((note: string) => {
    if (synthRef.current) {
      synthRef.current.stopSustainedNote(note);
    }
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, []);

  const playMelodyWithHighlights = useCallback(async (notes: string[], durations: number[]) => {
    if (!synthRef.current) return;
    await synthRef.current.resume();

    for (let i = 0; i < notes.length; i += 1) {
      const note = notes[i];
      const duration = durations[i] || 500;
      synthRef.current.playNote(note, duration);
      setActiveNotes((prev) => {
        const nextNotes = new Set(prev);
        nextNotes.add(note);
        return nextNotes;
      });
      setTimeout(() => {
        setActiveNotes((prev) => {
          const nextNotes = new Set(prev);
          nextNotes.delete(note);
          return nextNotes;
        });
      }, duration);
      await sleep(duration);
    }
  }, []);

  const playMelodySequence = useCallback(async (data: PianoToolData) => {
    if (!data.melody || isPlayingMelody) return;

    setIsPlayingMelody(true);
    const melody = data.melody;
    const durations = melody.durations || melody.notes.map(() => 500);

    try {
      await playMelodyWithHighlights(melody.notes, durations);
    } finally {
      setIsPlayingMelody(false);
    }
  }, [isPlayingMelody, playMelodyWithHighlights]);

  const playSampleMelody = useCallback(async (sample: typeof SAMPLES[number]) => {
    if (isPlayingMelody) return;
    if (sample.args.action !== "play_melody" || !sample.args.melody) return;

    const melody = sample.args.melody;
    if (!melody.notes || melody.notes.length === 0) return;

    setIsPlayingMelody(true);
    const durations = melody.durations || melody.notes.map(() => 500);

    try {
      await playMelodyWithHighlights(melody.notes, durations);
    } finally {
      setIsPlayingMelody(false);
    }
  }, [isPlayingMelody, playMelodyWithHighlights]);

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
  }, [selectedResult, playNote, releaseNote, playMelodySequence]);

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
  }, [playNote, releaseNote]);

  const isNoteActive = (note: string) => activeNotes.has(note);

  const hasMelody = pianoData?.melody && pianoData.melody.notes.length > 0;

  // Filter samples to get only song samples
  const songSamples = SAMPLES.filter(
    (sample) =>
      sample.args.action === "play_melody" &&
      sample.args.melody &&
      sample.args.melody.notes &&
      sample.name !== "Play C Major Scale"
  );

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
                className={`absolute top-0 w-7 h-24 bg-gray-900 border-2 border-gray-700 rounded-b-md cursor-pointer z-10 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-75 ${
                  isNoteActive(key.note) ? "!bg-blue-600 !border-blue-500" : ""
                }`}
                style={{ left: `${key.position}px` }}
                onMouseDown={() => playNote(key.note)}
                onMouseUp={() => releaseNote(key.note)}
                onMouseLeave={() => releaseNote(key.note)}
              >
                {keyLabelMap[key.note] && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-100 font-semibold select-none">
                    {keyLabelMap[key.note]}
                  </span>
                )}
              </div>
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

        {/* Song Selection */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-semibold mb-3 text-center">
            Select a Song
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {songSamples.map((sample) => (
              <button
                key={sample.name}
                onClick={() => playSampleMelody(sample)}
                disabled={isPlayingMelody}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  isPlayingMelody
                    ? "bg-gray-600 cursor-not-allowed text-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {sample.args.title || sample.name}
              </button>
            ))}
          </div>
        </div>

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

const keyLabelMap: Record<string, string> = {
  "C4": "A",
  "C#4": "W",
  "D4": "S",
  "D#4": "E",
  "E4": "D",
  "F4": "F",
  "F#4": "T",
  "G4": "G",
  "G#4": "Y",
  "A4": "H",
  "A#4": "U",
  "B4": "J",
  "C5": "K",
};

// Piano keyboard layout (2 octaves: C3-B5)
const whiteKeys = [
  { note: "C3", label: "" },
  { note: "D3", label: "" },
  { note: "E3", label: "" },
  { note: "F3", label: "" },
  { note: "G3", label: "" },
  { note: "A3", label: "" },
  { note: "B3", label: "" },
  { note: "C4", label: keyLabelMap["C4"] },
  { note: "D4", label: keyLabelMap["D4"] },
  { note: "E4", label: keyLabelMap["E4"] },
  { note: "F4", label: keyLabelMap["F4"] },
  { note: "G4", label: keyLabelMap["G4"] },
  { note: "A4", label: keyLabelMap["A4"] },
  { note: "B4", label: keyLabelMap["B4"] },
  { note: "C5", label: keyLabelMap["C5"] },
  { note: "D5", label: "" },
  { note: "E5", label: "" },
  { note: "F5", label: "" },
  { note: "G5", label: "" },
  { note: "A5", label: "" },
  { note: "B5", label: "" },
];

const keyWidth = 48;
const blackKeyWidth = 28; // narrower black keys
// Center black keys on white-key boundaries.
const blackKeys = [
  // Octave 3: C3=0, D3=1, E3=2, F3=3, G3=4, A3=5, B3=6
  { note: "C#3", position: keyWidth * 1 - blackKeyWidth / 2 },
  { note: "D#3", position: keyWidth * 2 - blackKeyWidth / 2 },
  { note: "F#3", position: keyWidth * 4 - blackKeyWidth / 2 },
  { note: "G#3", position: keyWidth * 5 - blackKeyWidth / 2 },
  { note: "A#3", position: keyWidth * 6 - blackKeyWidth / 2 },
  // Octave 4: C4=7, D4=8, E4=9, F4=10, G4=11, A4=12, B4=13
  { note: "C#4", position: keyWidth * 8 - blackKeyWidth / 2 },
  { note: "D#4", position: keyWidth * 9 - blackKeyWidth / 2 },
  { note: "F#4", position: keyWidth * 11 - blackKeyWidth / 2 },
  { note: "G#4", position: keyWidth * 12 - blackKeyWidth / 2 },
  { note: "A#4", position: keyWidth * 13 - blackKeyWidth / 2 },
  // Octave 5: C5=14, D5=15, E5=16, F5=17, G5=18, A5=19, B5=20
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
