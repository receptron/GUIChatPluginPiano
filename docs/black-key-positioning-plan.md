# ピアノ黒鍵位置修正プラン

## 問題
黒鍵が正しい位置に表示されていない。白鍵の上に重なって表示される必要がある。

## 現在の問題点

### 位置計算の誤り
```typescript
// 現在（誤り）
{ note: "C#3", position: keyWidth * 1 - blackKeyWidth / 2 }
// keyWidth=48, blackKeyWidth=32 の場合
// position = 48 - 16 = 32px
```

これは C の途中に配置されてしまう。

## 正しい配置

ピアノの黒鍵は2つの白鍵の**境界線**に中心が来るように配置する：

```
白鍵: [  C  ][  D  ][  E  ][  F  ][  G  ][  A  ][  B  ]
位置:  0    48    96   144   192   240   288   336
黒鍵:    [C#]  [D#]        [F#]  [G#]  [A#]
中心:     48    96         192   240   288
```

### 正しい計算式

黒鍵の `left` プロパティは黒鍵の**左端**の位置を指定する。
黒鍵を境界線に中央揃えするには：

```typescript
// C# は C(0番目) と D(1番目) の境界 (48px の位置) に中心
position = keyWidth * 1 - blackKeyWidth / 2 = 48 - 16 = 32px ✓

// D# は D(1番目) と E(2番目) の境界 (96px の位置) に中心
position = keyWidth * 2 - blackKeyWidth / 2 = 96 - 16 = 80px ✓

// F# は F(3番目) と G(4番目) の境界 (192px の位置) に中心
position = keyWidth * 4 - blackKeyWidth / 2 = 192 - 16 = 176px ✓
```

**実は現在のコードは数学的には正しい！**

## 真の問題

スクリーンショットを見ると、黒鍵が白鍵の**下に隠れている**可能性がある。

### 確認事項

1. `z-index` の問題
   - 黒鍵に `z-10` が設定されている ✓
   - 白鍵は z-index 指定なし（デフォルト = z-0） ✓
   - これは正しいはず

2. 親要素の構造
   - 黒鍵は `position: absolute` で配置
   - 親要素は `position: relative` である必要がある

## 修正方針

### オプション A: より明確な黒鍵配置（推奨）

白鍵の幅と黒鍵の配置を見直して、よりピアノらしい見た目にする：

```typescript
const keyWidth = 48;
const blackKeyWidth = 28; // 少し細く
const blackKeys = [
  // C と D の間（C の右3/4あたり）
  { note: "C#3", position: keyWidth * 1 - blackKeyWidth * 0.6 },
  { note: "D#3", position: keyWidth * 2 - blackKeyWidth * 0.6 },
  // E と F の間にはなし
  { note: "F#3", position: keyWidth * 4 - blackKeyWidth * 0.6 },
  { note: "G#3", position: keyWidth * 5 - blackKeyWidth * 0.55 },
  { note: "A#3", position: keyWidth * 6 - blackKeyWidth * 0.5 },
  // 以下同様...
];
```

### オプション B: CSS で top を明示的に指定

黒鍵が白鍵の上に確実に配置されるよう、top を明示：

```vue
<div
  v-for="key in blackKeys"
  :key="key.note"
  :class="[
    'absolute top-0 w-8 h-24 bg-gray-900 ...',
  ]"
  :style="{ left: key.position + 'px' }"
/>
```

## 修正案

1. **位置計算の修正**
   - 黒鍵の位置を白鍵の境界線に基づいて計算する必要があります。
   - 例えば、C#3の位置は次のように計算します：
   ```typescript
   // 修正後
   { note: "C#3", position: keyWidth * 1 - blackKeyWidth / 2 + whiteKeyWidth / 2 }
   // keyWidth=48, blackKeyWidth=32, whiteKeyWidth=48 の場合
   // position = 48 - 16 + 24 = 56px
   ```

2. **黒鍵の表示位置の調整**
   - 黒鍵が白鍵の上に重なるように、CSSや描画ロジックを見直す必要があります。

## 実装手順

1. **src/vue/View.vue** の黒鍵計算を修正（オプション A）
2. **src/react/View.tsx** も同様に修正
3. ブラウザで確認

## 検証

1. ブラウザをリフレッシュ
2. 「Show Keyboard」をクリック
3. 黒鍵が白鍵の上に正しく重なって表示されることを確認
4. 各オクターブで黒鍵の位置が揃っていることを確認

## 修正対象ファイル

- `src/vue/View.vue` (lines 157-183)
- `src/react/View.tsx` (lines 224-247)
