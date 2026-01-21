# ピアノプラグイン開発計画書

## 概要

MulmoChat用のインタラクティブなピアノプラグインを作成します。ユーザーが鍵盤をクリックして演奏したり、AIに曲を演奏させたりできます。

---

## テンプレートからの生成コマンド

```bash
cd /Users/yasutaka/Documents/mac-workspace/mulmo

# テンプレートをコピー
cp -r GUIChatPluginTemplate GUIChatPluginPiano

# 生成されたディレクトリに移動
cd GUIChatPluginPiano

# package.json の名前と説明を変更
# "name": "@gui-chat-plugin/piano"
# "description": "Interactive piano keyboard plugin for GUIChat"

yarn install
yarn dev
```

---

## 新規プロジェクト作成に必要なファイル一覧

### テンプレートからコピーされるファイル（変更不要または軽微な変更）

```
GUIChatPluginPiano/
├── package.json              # 名前とdescriptionのみ変更
├── README.md                 # プラグイン説明に更新
├── tsconfig.json             # TypeScript 設定（変更不要）
├── tsconfig.build.json       # ビルド用 TypeScript 設定（変更不要）
├── tsconfig.react.json       # React用 TypeScript 設定（変更不要）
├── vite.config.ts            # Vite ビルド設定（変更不要）
├── eslint.config.js          # ESLint 設定（変更不要）
├── index.html                # デモ用 HTML（変更不要）
├── .gitignore                # Git 除外設定（変更不要）
├── .github/
│   └── workflows/
│       └── pull_request.yaml # CI 設定（変更不要）
├── demo/                     # Vue デモ（変更不要）
│   ├── App.vue
│   ├── useChat.ts            # モック応答を追加可能
│   └── main.ts
└── demo-react/               # React デモ（変更不要）
```

### プラグイン固有の実装が必要なファイル

```
src/
├── index.ts                  # メインエントリ（変更不要）
├── style.css                 # Tailwind CSS（変更不要）
├── shims-vue.d.ts            # Vue 型定義（変更不要）
├── core/                     # Framework-agnostic（ピアノ用に実装）
│   ├── index.ts              # Core exports
│   ├── types.ts              # ピアノ固有の型定義
│   ├── definition.ts         # ツール定義（LLM 用スキーマ）
│   ├── samples.ts            # サンプルデータ
│   ├── plugin.ts             # execute 関数
│   └── audio.ts              # Web Audio API 音声生成（新規追加）
├── vue/                      # Vue コンポーネント
│   ├── index.ts              # Vue plugin export
│   ├── View.vue              # ピアノ鍵盤 UI
│   └── Preview.vue           # サイドバープレビュー
└── react/                    # React コンポーネント（オプション）
    ├── index.ts              # React plugin export
    ├── View.tsx              # ピアノ鍵盤 UI
    └── Preview.tsx           # サイドバープレビュー
```

---

## プラグイン仕様

### ツール名

```
playPiano
```

### 機能概要

1. **鍵盤表示**: 2オクターブのピアノ鍵盤を表示
2. **インタラクティブ演奏**: クリック/タップで音を鳴らす
3. **メロディ再生**: AIが指定したノートシーケンスを自動再生
4. **コード再生**: 和音（C, Am, G7等）を再生
5. **キーボードショートカット**: PCキーボードで演奏

### パラメータ（PianoArgs）

```typescript
interface PianoArgs {
  action: "play_notes" | "play_chord" | "play_melody" | "show_keyboard";

  // play_notes: 単音または複数音を同時に鳴らす
  notes?: string[];           // 例: ["C4", "E4", "G4"]

  // play_chord: コード名で和音を鳴らす
  chord?: string;             // 例: "Cmaj", "Am", "G7"

  // play_melody: メロディを順番に再生
  melody?: {
    notes: string[];          // 例: ["C4", "D4", "E4", "F4", "G4"]
    durations?: number[];     // 各音の長さ（ms）、省略時は500ms
    tempo?: number;           // BPM、省略時は120
  };

  // オプション
  title?: string;             // 表示タイトル
}
```

### 戻り値（PianoState）

```typescript
interface PianoState {
  // 現在の状態
  activeNotes: string[];      // 現在押されている鍵盤
  lastPlayed: string[];       // 最後に再生したノート

  // メロディ再生状態
  isPlaying: boolean;
  currentMelodyIndex: number;

  // 表示情報
  title?: string;
  chord?: string;

  // エラー
  error?: string;
}
```

### ToolResult 設計

```typescript
// LLM に返すデータ（jsonData）
interface PianoJsonData {
  success: boolean;
  playedNotes?: string[];
  chord?: string;
  error?: string;
}

// UI 用データ（data）
interface PianoToolData {
  state: PianoState;
  melody?: MelodyData;
}
```

---

## 技術設計

### 1. 型定義

**src/core/types.ts**

```typescript
/**
 * Piano Plugin Types
 */

/** Data type for UI (stored in result.data) */
export interface PianoToolData {
  state: PianoState;
  melody?: MelodyData;
}

/** Data type for LLM (stored in result.jsonData) */
export interface PianoJsonData {
  success: boolean;
  playedNotes?: string[];
  chord?: string;
  error?: string;
}

/** Arguments type (passed from LLM) */
export interface PianoArgs {
  action: "play_notes" | "play_chord" | "play_melody" | "show_keyboard";
  notes?: string[];
  chord?: string;
  melody?: MelodyData;
  title?: string;
}

/** Piano state */
export interface PianoState {
  activeNotes: string[];
  lastPlayed: string[];
  isPlaying: boolean;
  currentMelodyIndex: number;
  title?: string;
  chord?: string;
  error?: string;
}

/** Melody data */
export interface MelodyData {
  notes: string[];
  durations?: number[];
  tempo?: number;
}
```

### 2. 音声生成（Web Audio API）

**src/core/audio.ts**

```typescript
// シンプルなシンセサイザー
export class PianoSynth {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new AudioContext();
  }

  // 単音を鳴らす
  playNote(note: string, duration: number = 500): void {
    const frequency = noteToFrequency(note);
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';  // またはピアノ風の波形
    oscillator.frequency.value = frequency;

    // ADSR エンベロープ
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  // 和音を鳴らす
  playChord(notes: string[], duration: number = 500): void {
    notes.forEach(note => this.playNote(note, duration));
  }

  // メロディを順番に再生
  async playMelody(notes: string[], durations: number[]): Promise<void> {
    for (let i = 0; i < notes.length; i++) {
      this.playNote(notes[i], durations[i] || 500);
      await sleep(durations[i] || 500);
    }
  }
}

// ノート名から周波数への変換
function noteToFrequency(note: string): number {
  // C4 = 261.63 Hz を基準
  const noteMap: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  };

  const match = note.match(/^([A-G]#?b?)(\d)$/);
  if (!match) throw new Error(`Invalid note: ${note}`);

  const [, noteName, octaveStr] = match;
  const octave = parseInt(octaveStr);
  const semitone = noteMap[noteName];

  // A4 = 440Hz を基準に計算
  const semitonesFromA4 = (octave - 4) * 12 + semitone - 9;
  return 440 * Math.pow(2, semitonesFromA4 / 12);
}

// コード名からノート配列への変換
export function chordToNotes(chord: string): string[] {
  const chordMap: Record<string, string[]> = {
    'C': ['C4', 'E4', 'G4'],
    'Cm': ['C4', 'Eb4', 'G4'],
    'C7': ['C4', 'E4', 'G4', 'Bb4'],
    'Cmaj7': ['C4', 'E4', 'G4', 'B4'],
    'D': ['D4', 'F#4', 'A4'],
    'Dm': ['D4', 'F4', 'A4'],
    'E': ['E4', 'G#4', 'B4'],
    'Em': ['E4', 'G4', 'B4'],
    'F': ['F4', 'A4', 'C5'],
    'Fm': ['F4', 'Ab4', 'C5'],
    'G': ['G4', 'B4', 'D5'],
    'Gm': ['G4', 'Bb4', 'D5'],
    'G7': ['G4', 'B4', 'D5', 'F5'],
    'A': ['A4', 'C#5', 'E5'],
    'Am': ['A4', 'C5', 'E5'],
    'Am7': ['A4', 'C5', 'E5', 'G5'],
    'B': ['B4', 'D#5', 'F#5'],
    'Bm': ['B4', 'D5', 'F#5'],
  };

  return chordMap[chord] || [];
}
```

### 3. ツール定義

**src/core/definition.ts**

```typescript
import type { ToolDefinition } from "gui-chat-protocol";

export const TOOL_NAME = "playPiano";

export const TOOL_DEFINITION: ToolDefinition = {
  type: "function",
  name: TOOL_NAME,
  description: "Display an interactive piano keyboard and play notes, chords, or melodies. Use this when the user wants to play music, learn piano, or hear musical examples.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["play_notes", "play_chord", "play_melody", "show_keyboard"],
        description: "Action to perform: play_notes (single/multiple notes), play_chord (named chord), play_melody (sequence), show_keyboard (display only)",
      },
      notes: {
        type: "array",
        items: { type: "string" },
        description: "Notes to play (e.g., ['C4', 'E4', 'G4']). Use scientific pitch notation.",
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
```

### 4. サンプルデータ

**src/core/samples.ts**

```typescript
import type { ToolSample } from "gui-chat-protocol";
import type { PianoArgs } from "./types";

export const samples: ToolSample<PianoArgs>[] = [
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
        notes: ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"],
        durations: [500, 500, 500, 500, 500, 500, 1000, 500, 500, 500, 500, 500, 500, 1000],
      },
      title: "Twinkle Twinkle Little Star",
    },
  },
];
```

### 5. プラグインコア

**src/core/plugin.ts**

```typescript
import type { ToolPluginCore, ToolContext, ToolResult } from "gui-chat-protocol";
import type { PianoToolData, PianoJsonData, PianoArgs, PianoState } from "./types";
import { TOOL_DEFINITION, TOOL_NAME, SYSTEM_PROMPT } from "./definition";
import { samples } from "./samples";
import { chordToNotes } from "./audio";

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
      data: { state, melody },
      jsonData: { success: true, playedNotes, chord },
      message: `Played: ${playedNotes.join(", ") || "keyboard shown"}`,
      title: title || chord || "Piano",
      instructions: action === "play_melody"
        ? "The melody is now playing. Ask the user if they enjoyed it."
        : "The piano is ready. Ask the user what they would like to play next.",
    };
  } catch (error) {
    return {
      message: `Error: ${error}`,
      jsonData: { success: false, error: String(error) },
    };
  }
};

export const pluginCore: ToolPluginCore<PianoToolData, PianoJsonData, PianoArgs> = {
  toolDefinition: TOOL_DEFINITION,
  execute: executePiano,
  generatingMessage: "Preparing piano...",
  isEnabled: () => true,  // 外部 API 不要
  systemPrompt: SYSTEM_PROMPT,
  samples,
};
```

### 6. Vue コンポーネント

**src/vue/View.vue（概要）**

```vue
<template>
  <div class="piano-container w-full h-full flex flex-col items-center p-4">
    <!-- タイトル -->
    <h2 v-if="title" class="text-xl font-bold mb-4">{{ title }}</h2>

    <!-- コード表示 -->
    <div v-if="currentChord" class="text-lg mb-2">{{ currentChord }}</div>

    <!-- ピアノ鍵盤 -->
    <div class="piano-keyboard flex relative">
      <!-- 白鍵 -->
      <div
        v-for="key in whiteKeys"
        :key="key.note"
        :class="['white-key', { active: isNoteActive(key.note) }]"
        @mousedown="playNote(key.note)"
        @mouseup="releaseNote(key.note)"
      >
        <span class="key-label">{{ key.label }}</span>
      </div>

      <!-- 黒鍵（絶対位置） -->
      <div
        v-for="key in blackKeys"
        :key="key.note"
        :class="['black-key', { active: isNoteActive(key.note) }]"
        :style="{ left: key.position + 'px' }"
        @mousedown="playNote(key.note)"
        @mouseup="releaseNote(key.note)"
      />
    </div>

    <!-- 再生コントロール -->
    <div v-if="hasMelody" class="mt-4">
      <button @click="playMelody" :disabled="isPlaying">
        {{ isPlaying ? "Playing..." : "Play Melody" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { ToolResult } from "gui-chat-protocol/vue";
import type { PianoToolData } from "../core/types";
import { PianoSynth } from "../core/audio";

const props = defineProps<{
  selectedResult: ToolResult<PianoToolData>;
  sendTextMessage?: (text: string) => void;
}>();

const synth = ref<PianoSynth | null>(null);
const activeNotes = ref<Set<string>>(new Set());
const isPlaying = ref(false);

onMounted(() => {
  synth.value = new PianoSynth();
  // キーボードイベント登録
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});

// 鍵盤定義（2オクターブ）
const whiteKeys = computed(() => [
  { note: "C4", label: "C" },
  { note: "D4", label: "D" },
  // ... 省略
]);

const blackKeys = computed(() => [
  { note: "C#4", position: 30 },
  { note: "D#4", position: 80 },
  // ... 省略
]);

// PC キーボードマッピング
const keyMap: Record<string, string> = {
  "a": "C4", "w": "C#4", "s": "D4", "e": "D#4", "d": "E4",
  "f": "F4", "t": "F#4", "g": "G4", "y": "G#4", "h": "A4",
  "u": "A#4", "j": "B4", "k": "C5",
};

const playNote = (note: string) => {
  synth.value?.playNote(note);
  activeNotes.value.add(note);
};

const releaseNote = (note: string) => {
  activeNotes.value.delete(note);
};

// 初期再生（props 変更時）
watch(
  () => props.selectedResult,
  (result) => {
    if (result?.data?.state?.lastPlayed) {
      result.data.state.lastPlayed.forEach((note) => {
        playNote(note);
        setTimeout(() => releaseNote(note), 500);
      });
    }
    if (result?.data?.melody && result?.data?.state?.isPlaying) {
      playMelody();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.white-key {
  @apply w-12 h-40 bg-white border border-gray-300 rounded-b-md cursor-pointer;
  @apply hover:bg-gray-100 active:bg-gray-200;
}
.white-key.active {
  @apply bg-blue-200;
}
.black-key {
  @apply absolute w-8 h-24 bg-gray-800 rounded-b-md cursor-pointer z-10;
  @apply hover:bg-gray-700 active:bg-gray-600;
}
.black-key.active {
  @apply bg-blue-600;
}
.key-label {
  @apply absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500;
}
</style>
```

**src/vue/Preview.vue（概要）**

```vue
<template>
  <div class="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
    <div class="text-2xl text-center mb-1">🎹</div>
    <div class="text-sm font-medium text-center text-gray-700 truncate">
      {{ result.title || "Piano" }}
    </div>
    <div v-if="result.data?.state?.chord" class="text-xs text-center text-gray-500">
      {{ result.data.state.chord }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ToolResult } from "gui-chat-protocol/vue";
import type { PianoToolData } from "../core/types";

defineProps<{
  result: ToolResult<PianoToolData>;
}>();
</script>
```

---

## 開発手順

### Step 1: テンプレートからプロジェクト生成

```bash
cd /Users/yasutaka/Documents/mac-workspace/mulmo

# テンプレートをコピー
cp -r GUIChatPluginTemplate GUIChatPluginPiano

# 生成されたディレクトリに移動
cd GUIChatPluginPiano

# 不要なファイル/フォルダを削除（オプション）
rm -rf scripts/  # create-plugin.sh は不要
```

### Step 2: package.json の更新

`package.json` を開いて以下を変更:

```diff
- "name": "@gui-chat-plugin/template",
+ "name": "@gui-chat-plugin/piano",
- "description": "GUIChat Plugin Template with Chat Integration Demo",
+ "description": "Interactive piano keyboard plugin for GUIChat",
```

### Step 3: テンプレートファイルをピアノ用にコピー・リネーム

テンプレートには既存のサンプルコード（Quiz）が含まれているため、ピアノ用に書き換えます。

**コピーする必要はありません** - 以下のファイルを直接編集します:

```
src/core/
├── types.ts        # QuizToolData → PianoToolData に書き換え
├── definition.ts   # quiz → playPiano に書き換え
├── samples.ts      # Quiz サンプル → Piano サンプルに書き換え
└── plugin.ts       # executeQuiz → executePiano に書き換え

src/vue/
├── View.vue        # Quiz UI → Piano 鍵盤 UI に書き換え
└── Preview.vue     # Quiz プレビュー → Piano プレビューに書き換え
```

**新規作成が必要なファイル:**

```bash
# Web Audio API 音声生成ファイルを新規作成
touch src/core/audio.ts
```

### Step 4: プラグイン固有のコード実装

テンプレートの `src/core/` と `src/vue/` をピアノ用にカスタマイズ:

**Core 実装（Framework-agnostic）:**

1. `src/core/types.ts` - ピアノ固有の型定義（PianoToolData, PianoArgs等）
2. `src/core/definition.ts` - ツール定義（LLM 用スキーマ）
3. `src/core/samples.ts` - サンプルデータ
4. `src/core/plugin.ts` - execute 関数
5. `src/core/audio.ts` - Web Audio API 音声生成（**新規追加**）
6. `src/core/index.ts` - Core exports を更新

**Vue 実装:**

7. `src/vue/View.vue` - ピアノ鍵盤 UI
8. `src/vue/Preview.vue` - サイドバープレビュー
9. `src/vue/index.ts` - Vue plugin export を更新

**React 実装（オプション）:**

10. `src/react/View.tsx` - ピアノ鍵盤 UI
11. `src/react/Preview.tsx` - サイドバープレビュー

### Step 5: ビルドと検証

```bash
yarn install
yarn typecheck
yarn lint
yarn dev  # http://localhost:5173 で確認
```

デモページで:
- **Chat Panel**: 「ピアノを表示して」などと入力してテスト
- **Mock Mode**: APIキーなしでテスト可能（"piano" キーワードでモック応答）
- **Quick Samples**: サンプルボタンで直接実行

### Step 6: MulmoChat に統合

```bash
cd /Users/yasutaka/Documents/mac-workspace/mulmo/MulmoChat

# package.json に追加
# "@gui-chat-plugin/piano": "file:../GUIChatPluginPiano"

# src/tools/index.ts に追加
# import PianoPlugin from "@gui-chat-plugin/piano/vue";
# pluginList に PianoPlugin を追加

# src/main.ts に追加
# import "@gui-chat-plugin/piano/style.css";

yarn install
yarn typecheck
yarn lint
yarn dev
```

### Step 7: モック応答の追加（オプション）

テンプレートの `demo/useChat.ts` にピアノ用のモック応答を追加:

```typescript
const MOCK_RESPONSES: Record<string, ...> = {
  piano: {
    toolCall: {
      name: "playPiano",
      args: { action: "show_keyboard", title: "Piano" },
    },
  },
};
```

---

## テストプロンプト例

MulmoChat で以下のように話しかけてテスト：

1. 「ピアノを表示して」
2. 「Cメジャーコードを弾いて」
3. 「きらきら星を弾いて」
4. 「ドレミファソラシドを弾いて」
5. 「Amコードを聞かせて」

---

## 拡張可能な機能（将来）

1. **サンプリング音源**: より本物らしいピアノ音
2. **録音機能**: ユーザーの演奏を記録
3. **楽譜表示**: 五線譜との連携（Music プラグインと統合）
4. **オクターブ切り替え**: 表示範囲の変更
5. **ペダル対応**: サステインペダル
6. **MIDI 入力**: 外部 MIDI キーボード対応

---

## 参考資料

- [プラグイン開発ガイド](./plugin-development-guide.ja.md)
- [TicTacToe プラグイン](https://github.com/receptron/GUIChatPluginTicTacToe)
- [Music プラグイン](https://github.com/receptron/GUIChatPluginMusic)
- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
