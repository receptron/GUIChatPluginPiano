/**
 * Piano Preview Component (React)
 */

import type { PreviewComponentProps } from "gui-chat-protocol";
import type { PianoToolData, PianoJsonData } from "../core/types";

type PreviewProps = PreviewComponentProps<PianoToolData, PianoJsonData>;

export function Preview({ result }: PreviewProps) {
  const pianoData = result.data as PianoToolData | null;

  if (!pianoData) {
    return null;
  }

  return (
    <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
      <div className="flex flex-col gap-2">
        {/* Piano Icon */}
        <div className="text-3xl text-center">🎹</div>

        {/* Title */}
        <div className="text-sm font-semibold text-gray-800 text-center truncate">
          {pianoData.state.title || "Piano"}
        </div>

        {/* Chord Display */}
        {pianoData.state.chord && (
          <div className="text-center">
            <span className="inline-block bg-purple-600 text-white text-xs font-bold py-1 px-3 rounded-full">
              {pianoData.state.chord}
            </span>
          </div>
        )}

        {/* Notes Count (for melody) */}
        {pianoData.melody && (
          <div className="text-xs text-center text-gray-600">
            {pianoData.melody.notes.length} notes
          </div>
        )}

        {/* Last Played Notes */}
        {!pianoData.melody && pianoData.state.lastPlayed.length > 0 && (
          <div className="text-xs text-center text-gray-600">
            {pianoData.state.lastPlayed.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}

export default Preview;
