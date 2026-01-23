# Piano Plugin 機能追加計画

## 概要

2つの機能を追加します：

1. **曲選択ボタン** - ボタンを押すと曲が再生される
2. **サステイン＆ディケイ** - キーを押している間音が鳴り続け、徐々に音量が小さくなる

---

## Feature 1: 曲選択ボタン

### 追加する曲

| 曲名 | 説明 |
|------|------|
| Twinkle, Twinkle, Little Star | 既存 (samples.ts) |
| Mary Had a Little Lamb | 新規追加 |
| London Bridge Is Falling Down | 新規追加 |
| Old MacDonald Had a Farm | 新規追加 |
| 桃太郎 (Momotaro) | 新規追加 |
| うさぎとかめ (Usagi to Kame) | 新規追加 |
| 金太郎 (Kintaro) | 新規追加 |

### 変更ファイル

1. **[samples.ts](src/core/samples.ts)** - 6曲の定義を追加
2. **[View.tsx](src/react/View.tsx)** - 曲選択UIを追加
3. **[View.vue](src/vue/View.vue)** - 曲選択UIを追加

### 実装内容

#### samples.ts に曲データ追加

```typescript
// Mary Had a Little Lamb
{
  name: "Mary Had a Little Lamb",
  args: {
    action: "play_melody",
    melody: {
      notes: ["E4", "D4", "C4", "D4", "E4", "E4", "E4", "D4", "D4", "D4", "E4", "G4", "G4", ...],
      durations: [500, 500, 500, 500, 500, 500, 1000, ...],
    },
    title: "Mary Had a Little Lamb",
  },
},
// 他5曲も同様に追加
```

#### View.tsx / View.vue に曲選択UI追加 (キーボードの下に配置)

```tsx
{/* Song Selection - キーボードの下、Instructions の上 */}
<div className="mb-6">
  <h3 className="text-white text-lg font-semibold mb-3 text-center">
    Select a Song
  </h3>
  <div className="flex flex-wrap justify-center gap-2">
    {songSamples.map((sample) => (
      <button onClick={() => playSampleMelody(sample)} ...>
        {sample.name}
      </button>
    ))}
  </div>
</div>
```

---

## Feature 2: サステイン＆ディケイ

### 現在の動作
- `playNote(note, duration)` は固定時間で音を再生
- キーを離しても音は止まらず、固定時間再生される

### 新しい動作
- キーを押すと音が開始し、押している間持続
- 徐々に音量が減衰 (3秒で最小音量へ)
- キーを離すと音がフェードアウトして停止
- 最大10秒で自動的に音がフェードアウト

### 変更ファイル

1. **[audio.ts](src/core/audio.ts)** - サステイン機能を追加

### audio.ts に追加するメソッド

```typescript
// PianoSynth クラスに追加
private sustainedNotes: Map<string, {...}> = new Map();

async startSustainedNote(note: string): Promise<void> {
  // 持続する音を開始
  // 徐々に音量が減衰するADSRエンベロープを使用
}

stopSustainedNote(note: string): void {
  // 音を停止（短いリリースタイム付き）
}

stopAllSustainedNotes(): void {
  // 全ての持続音を停止
}
```

### View の変更

```typescript
// playNote を変更
const playNote = async (note: string) => {
  synthRef.current.startSustainedNote(note);  // playNote から変更
  setActiveNotes((prev) => new Set(prev).add(note));
};

// releaseNote を変更
const releaseNote = (note: string) => {
  synthRef.current.stopSustainedNote(note);   // 追加
  setActiveNotes(...);
};
```

---

## 技術的決定

### Synth vs Soundfont
- **サステイン音にはSynthを使用**
  - Soundfontは事前録音されたサンプルで、リアルタイムの音量制御ができない
  - Synthなら GainNode を直接操作可能

### 減衰カーブ
- **指数関数的減衰** (`exponentialRampToValueAtTime`)
  - リニアよりも自然なピアノの響き
  - Web Audio API がスムーズな補間を処理

---

## 実装順序

| Phase | 内容 | ファイル |
|-------|------|----------|
| 1 | 曲データ追加 | [samples.ts](src/core/samples.ts) |
| 2 | 曲選択UI (React) | [View.tsx](src/react/View.tsx) |
| 3 | 曲選択UI (Vue) | [View.vue](src/vue/View.vue) |
| 4 | サステイン機能 | [audio.ts](src/core/audio.ts) |
| 5 | サステインUI統合 | View.tsx, View.vue |

---

## 検証方法

1. **曲選択機能**
   - 各曲ボタンをクリックして曲が正しく再生されることを確認
   - 再生中はボタンが無効になることを確認

2. **サステイン機能**
   - キーボードのキーを押し続けて音が持続することを確認
   - 音が徐々に小さくなることを確認
   - キーを離すと音が止まることを確認
   - 複数キーの同時押しが動作することを確認

3. **ビルド確認**
   ```bash
   npm run build
   npm run typecheck
   ```
