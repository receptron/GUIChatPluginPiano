<template>
  <div class="size-full min-h-[600px] overflow-x-auto overflow-y-auto p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Debug: Show loading state -->
    <div v-if="!pianoData" class="text-white text-center mt-10">
      <p>Loading piano...</p>
      <p class="text-sm text-gray-400 mt-2">Waiting for data</p>
      <div class="mt-4 text-xs text-left max-w-2xl mx-auto bg-gray-800 p-4 rounded">
        <p class="mb-2">Debug Info:</p>
        <p>selectedResult: {{ selectedResult ? 'exists' : 'null' }}</p>
        <p>toolName: {{ selectedResult?.toolName }}</p>
        <p>has data: {{ selectedResult?.data ? 'yes' : 'no' }}</p>
        <pre class="mt-2 text-xs overflow-auto">{{ JSON.stringify(selectedResult, null, 2) }}</pre>
      </div>
    </div>

    <div v-else class="w-full mx-auto min-h-[500px] flex flex-col justify-center">
      <!-- Title -->
      <h2 v-if="pianoData.state.title" class="text-white text-3xl font-bold mb-8 text-center">
        {{ pianoData.state.title }}
      </h2>

      <!-- Chord Display -->
      <div
        v-if="pianoData.state.chord"
        class="text-center mb-6 text-2xl font-semibold text-purple-300"
      >
        {{ pianoData.state.chord }}
      </div>

      <!-- Piano Keyboard -->
      <div class="flex justify-center mb-8">
        <div class="relative inline-block">
          <!-- White Keys -->
          <div class="flex">
            <div
              v-for="key in whiteKeys"
              :key="key.note"
              :class="[
                'relative w-12 h-40 bg-white border-2 border-gray-300 rounded-b-lg cursor-pointer',
                'hover:bg-gray-100 active:bg-gray-200 transition-colors duration-75',
                'flex items-end justify-center pb-3',
                { 'bg-blue-200 border-blue-400': isNoteActive(key.note) }
              ]"
              @mousedown="playNote(key.note)"
              @mouseup="releaseNote(key.note)"
              @mouseleave="releaseNote(key.note)"
            >
              <span class="text-xs text-gray-500 font-semibold select-none">{{ key.label }}</span>
            </div>
          </div>

          <!-- Black Keys (absolute positioning) -->
          <div
            v-for="key in blackKeys"
            :key="key.note"
            :class="[
              'absolute w-8 h-24 bg-gray-900 border-2 border-gray-700 rounded-b-md cursor-pointer z-10',
              'hover:bg-gray-800 active:bg-gray-700 transition-colors duration-75',
              { 'bg-blue-600 border-blue-500': isNoteActive(key.note) }
            ]"
            :style="{ left: key.position + 'px' }"
            @mousedown="playNote(key.note)"
            @mouseup="releaseNote(key.note)"
            @mouseleave="releaseNote(key.note)"
          />
        </div>
      </div>

      <!-- Melody Controls -->
      <div v-if="hasMelody" class="flex justify-center gap-4 mb-6">
        <button
          @click="playMelodySequence"
          :disabled="isPlayingMelody"
          :class="[
            'py-3 px-6 rounded-lg font-semibold text-lg transition-colors',
            isPlayingMelody
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          ]"
        >
          {{ isPlayingMelody ? 'Playing...' : 'Play Melody' }}
        </button>
      </div>

      <!-- Instructions -->
      <div class="text-center text-gray-300 text-sm">
        <p>Click keys to play notes</p>
        <p class="mt-1 text-gray-400">
          Keyboard: A-K keys play C4-C5
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { ToolResult } from "gui-chat-protocol";
import type { PianoToolData } from "../core/types";
import { PianoSynth } from "../core/audio";
import { TOOL_NAME } from "../core/definition";

const props = defineProps<{
  selectedResult: ToolResult;
  sendTextMessage?: (text: string) => void;
}>();

const synth = ref<PianoSynth | null>(null);
const activeNotes = ref<Set<string>>(new Set());
const isPlayingMelody = ref(false);
const pianoData = ref<PianoToolData | null>(null);

onMounted(() => {
  synth.value = new PianoSynth();
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});

// Watch for result changes
watch(
  () => props.selectedResult,
  (newResult) => {
    console.log('Piano View - selectedResult changed:', newResult);
    console.log('Piano View - toolName:', newResult?.toolName);
    console.log('Piano View - data:', newResult?.data);

    if (newResult?.toolName === TOOL_NAME && newResult.data) {
      pianoData.value = newResult.data as PianoToolData;
      console.log('Piano View - pianoData set:', pianoData.value);

      // Auto-play based on action
      if (pianoData.value.state.lastPlayed.length > 0) {
        pianoData.value.state.lastPlayed.forEach((note) => {
          playNote(note);
          setTimeout(() => releaseNote(note), 500);
        });
      }

      // Auto-play melody if isPlaying is true
      if (pianoData.value.state.isPlaying && pianoData.value.melody) {
        playMelodySequence();
      }
    } else {
      console.log('Piano View - No valid data, clearing pianoData');
      pianoData.value = null;
    }
  },
  { immediate: true, deep: true }
);

// Piano keyboard layout (2 octaves: C3-B5)
const whiteKeys = computed(() => [
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
]);

const blackKeys = computed(() => {
  const keyWidth = 48; // width of white key in pixels
  const blackKeyWidth = 32;
  const positions = [
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
  return positions;
});

// PC Keyboard mapping
const keyMap: Record<string, string> = {
  "a": "C4", "w": "C#4", "s": "D4", "e": "D#4", "d": "E4",
  "f": "F4", "t": "F#4", "g": "G4", "y": "G#4", "h": "A4",
  "u": "A#4", "j": "B4", "k": "C5",
};

const hasMelody = computed(() => {
  return pianoData.value?.melody && pianoData.value.melody.notes.length > 0;
});

function isNoteActive(note: string): boolean {
  return activeNotes.value.has(note);
}

async function playNote(note: string): Promise<void> {
  if (synth.value) {
    await synth.value.resume();
    synth.value.playNote(note);
    activeNotes.value.add(note);
  }
}

function releaseNote(note: string): void {
  activeNotes.value.delete(note);
}

async function playMelodySequence(): Promise<void> {
  if (!pianoData.value?.melody || isPlayingMelody.value) return;

  isPlayingMelody.value = true;
  const melody = pianoData.value.melody;
  const durations = melody.durations || melody.notes.map(() => 500);

  try {
    if (synth.value) {
      await synth.value.resume();
      await synth.value.playMelody(melody.notes, durations);
    }
  } finally {
    isPlayingMelody.value = false;
  }
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.repeat) return;
  const key = event.key.toLowerCase();
  const note = keyMap[key];
  if (note) {
    playNote(note);
  }
}

function handleKeyUp(event: KeyboardEvent): void {
  const key = event.key.toLowerCase();
  const note = keyMap[key];
  if (note) {
    releaseNote(note);
  }
}
</script>

<style scoped>
/* Piano keyboard styles are now inline using Tailwind classes */
</style>
