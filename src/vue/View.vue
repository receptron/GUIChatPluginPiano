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
              { '!bg-blue-200 !border-blue-400': isNoteActive(key.note) }
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
              'absolute top-0 w-7 h-24 bg-gray-900 border-2 border-gray-700 rounded-b-md cursor-pointer z-10',
              'hover:bg-gray-800 active:bg-gray-700 transition-colors duration-75',
              { '!bg-blue-600 !border-blue-500': isNoteActive(key.note) }
            ]"
            :style="{ left: key.position + 'px' }"
            @mousedown="playNote(key.note)"
            @mouseup="releaseNote(key.note)"
            @mouseleave="releaseNote(key.note)"
          >
            <span
              v-if="key.label"
              class="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-100 font-semibold select-none"
            >
              {{ key.label }}
            </span>
          </div>
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

      <!-- Song Selection -->
      <div class="mb-6">
        <h3 class="text-white text-lg font-semibold mb-3 text-center">
          Select a Song
        </h3>
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="sample in songSamples"
            :key="sample.name"
            @click="playSampleMelody(sample)"
            :disabled="isPlayingMelody"
            :class="[
              'py-2 px-4 rounded-lg font-medium text-sm transition-colors',
              isPlayingMelody
                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            ]"
          >
            {{ sample.args.title || sample.name }}
          </button>
        </div>
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
import { SAMPLES } from "../core/samples";

const props = defineProps<{
  selectedResult: ToolResult;
  sendTextMessage?: (text: string) => void;
}>();

const synth = ref<PianoSynth | null>(null);
const activeNotes = ref<Set<string>>(new Set());
const isPlayingMelody = ref(false);
const pianoData = ref<PianoToolData | null>(null);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
const whiteKeys = computed(() => [
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
]);

const blackKeys = computed(() => {
  const keyWidth = 48; // width of white key in pixels
  const blackKeyWidth = 28; // narrower black keys
  // Center black keys on white-key boundaries.
  const positions = [
    // Octave 3: C3=0, D3=1, E3=2, F3=3, G3=4, A3=5, B3=6
    { note: "C#3", position: keyWidth * 1 - blackKeyWidth / 2, label: "" },
    { note: "D#3", position: keyWidth * 2 - blackKeyWidth / 2, label: "" },
    { note: "F#3", position: keyWidth * 4 - blackKeyWidth / 2, label: "" },
    { note: "G#3", position: keyWidth * 5 - blackKeyWidth / 2, label: "" },
    { note: "A#3", position: keyWidth * 6 - blackKeyWidth / 2, label: "" },
    // Octave 4: C4=7, D4=8, E4=9, F4=10, G4=11, A4=12, B4=13
    { note: "C#4", position: keyWidth * 8 - blackKeyWidth / 2, label: keyLabelMap["C#4"] },
    { note: "D#4", position: keyWidth * 9 - blackKeyWidth / 2, label: keyLabelMap["D#4"] },
    { note: "F#4", position: keyWidth * 11 - blackKeyWidth / 2, label: keyLabelMap["F#4"] },
    { note: "G#4", position: keyWidth * 12 - blackKeyWidth / 2, label: keyLabelMap["G#4"] },
    { note: "A#4", position: keyWidth * 13 - blackKeyWidth / 2, label: keyLabelMap["A#4"] },
    // Octave 5: C5=14, D5=15, E5=16, F5=17, G5=18, A5=19, B5=20
    { note: "C#5", position: keyWidth * 15 - blackKeyWidth / 2, label: "" },
    { note: "D#5", position: keyWidth * 16 - blackKeyWidth / 2, label: "" },
    { note: "F#5", position: keyWidth * 18 - blackKeyWidth / 2, label: "" },
    { note: "G#5", position: keyWidth * 19 - blackKeyWidth / 2, label: "" },
    { note: "A#5", position: keyWidth * 20 - blackKeyWidth / 2, label: "" },
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

// Filter samples to get only song samples
const songSamples = computed(() =>
  SAMPLES.filter(
    (sample) =>
      sample.args.action === "play_melody" &&
      sample.args.melody &&
      sample.args.melody.notes &&
      sample.name !== "Play C Major Scale"
  )
);

function isNoteActive(note: string): boolean {
  return activeNotes.value.has(note);
}

async function playNote(note: string): Promise<void> {
  const nextNotes = new Set(activeNotes.value);
  nextNotes.add(note);
  activeNotes.value = nextNotes;
  if (synth.value) {
    await synth.value.resume();
    synth.value.startSustainedNote(note);
  }
}

function releaseNote(note: string): void {
  if (synth.value) {
    synth.value.stopSustainedNote(note);
  }
  const nextNotes = new Set(activeNotes.value);
  nextNotes.delete(note);
  activeNotes.value = nextNotes;
}

async function playMelodySequence(): Promise<void> {
  if (!pianoData.value?.melody || isPlayingMelody.value) return;

  isPlayingMelody.value = true;
  const melody = pianoData.value.melody;
  const durations = melody.durations || melody.notes.map(() => 500);

  try {
    await playMelodyWithHighlights(melody.notes, durations);
  } finally {
    isPlayingMelody.value = false;
  }
}

async function playSampleMelody(sample: typeof SAMPLES[number]): Promise<void> {
  if (isPlayingMelody.value) return;
  if (sample.args.action !== "play_melody" || !sample.args.melody) return;

  const melody = sample.args.melody;
  if (!melody.notes || melody.notes.length === 0) return;

  isPlayingMelody.value = true;
  const durations = melody.durations || melody.notes.map(() => 500);

  try {
    await playMelodyWithHighlights(melody.notes, durations);
  } finally {
    isPlayingMelody.value = false;
  }
}

async function playMelodyWithHighlights(notes: string[], durations: number[]): Promise<void> {
  if (!synth.value) return;
  await synth.value.resume();

  for (let i = 0; i < notes.length; i += 1) {
    const note = notes[i];
    const duration = durations[i] || 500;
    synth.value.playNote(note, duration);
    const nextNotes = new Set(activeNotes.value);
    nextNotes.add(note);
    activeNotes.value = nextNotes;
    setTimeout(() => {
      const releaseNotes = new Set(activeNotes.value);
      releaseNotes.delete(note);
      activeNotes.value = releaseNotes;
    }, duration);
    await sleep(duration);
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
