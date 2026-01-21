# Piano Plugin 実装時の問題点と解決策

## 発生した問題

実装中に以下のエラーが発生し、ピアノの鍵盤が表示されませんでした：

```
ReferenceError: Can't find variable: TOOL_NAME
```

## 根本原因

### 1. **TOOL_NAME のインポート漏れ（最重要）**

**計画ドキュメント（正しい）**
```typescript
// docs/piano-plugin-plan.ja.md 459行目
import { TOOL_DEFINITION, TOOL_NAME, SYSTEM_PROMPT } from "./definition";
```

**実際の実装（誤り）**
```typescript
// src/core/plugin.ts 10行目（修正前）
import { TOOL_DEFINITION, SYSTEM_PROMPT } from "./definition";
```

`TOOL_NAME` のインポートが抜けていたため、63行目で `toolName: TOOL_NAME` を使用した際に `ReferenceError` が発生しました。

### 2. **toolName プロパティの追加漏れ（重要）**

**計画ドキュメント（明示されていない）**
```typescript
// docs/piano-plugin-plan.ja.md 507-515行目
return {
  data: { state, melody },
  jsonData: { success: true, playedNotes, chord },
  message: `Played: ${playedNotes.join(", ") || "keyboard shown"}`,
  title: title || chord || "Piano",
  instructions: action === "play_melody"
    ? "The melody is now playing. Ask the user if they enjoyed it."
    : "The piano is ready. Ask the user what they would like to play next.",
};
```

計画ドキュメントの `executePiano` 関数の return 文には **`toolName` プロパティが記載されていませんでした**。

しかし、Vue コンポーネントの watch 条件では：

```typescript
// src/vue/View.vue 116行目
if (newResult?.toolName === TOOL_NAME && newResult.data) {
```

`toolName` が必要とされています。このため、return 文に `toolName: TOOL_NAME` を追加する必要がありました。

**最終的な実装（正しい）**
```typescript
// src/core/plugin.ts 62-72行目
return {
  toolName: TOOL_NAME,  // ← これが必要だった
  data: { state, melody },
  jsonData: { success: true, playedNotes, chord },
  message: `Played: ${playedNotes.join(", ") || "keyboard shown"}`,
  title: title || chord || "Piano",
  instructions:
    action === "play_melody"
      ? "The melody is now playing. Ask the user if they enjoyed it."
      : "The piano is ready. Ask the user what they would like to play next.",
};
```

## なぜこの問題が発生したか

1. **計画ドキュメントの不完全性**
   - `executePiano` の return 文に `toolName` プロパティが記載されていなかった
   - `gui-chat-protocol` の `ToolResult` 型定義では `toolName` は必須または推奨プロパティの可能性がある

2. **インポート文の転記ミス**
   - 計画では `TOOL_NAME` のインポートが明記されていたが、実装時に見落とした
   - 3つのインポート (`TOOL_DEFINITION`, `TOOL_NAME`, `SYSTEM_PROMPT`) のうち、中央の `TOOL_NAME` だけが抜けた

## デバッグプロセス

1. ブラウザで「Loading piano... Waiting for data」が表示され続ける
2. デバッグ情報を追加して確認：
   - `selectedResult: exists` ✓
   - `toolName: ` (空) ✗
   - `has data: yes` ✓
3. Vue の watch 条件 `newResult?.toolName === TOOL_NAME` が失敗していることを特定
4. `plugin.ts` の return 文に `toolName` がないことを発見
5. `TOOL_NAME` を使おうとしたら `ReferenceError` が発生
6. インポート文に `TOOL_NAME` が抜けていることを発見

## 教訓

### 実装時のチェックリスト

1. **インポート文の確認**
   - 使用する定数・型はすべてインポートされているか
   - 計画ドキュメントのインポート文と一致しているか

2. **return 文の型適合性**
   - 返り値の型（`ToolResult`）に必要なプロパティがすべて含まれているか
   - 計画ドキュメントに記載がなくても、型定義を確認する

3. **コンポーネントとの整合性**
   - Vue/React コンポーネントが期待するデータ構造を確認
   - watch 条件や useEffect の依存関係を確認

### 計画ドキュメントの改善点

今後、同様の計画を作成する際は：

1. **`ToolResult` の完全な return 文を記載**
   ```typescript
   return {
     toolName: TOOL_NAME,  // 必須プロパティを明記
     data: { state, melody },
     jsonData: { success: true, playedNotes, chord },
     message: "...",
     title: "...",
     instructions: "...",
   };
   ```

2. **型定義の参照先を明記**
   ```typescript
   // gui-chat-protocol の ToolResult 型に準拠
   // 必須プロパティ: toolName, data または message
   ```

3. **インポート文は完全な形で記載**
   - 省略せず、すべての必要な import を列挙する

## まとめ

| 問題 | 原因 | 解決策 |
|------|------|--------|
| `ReferenceError: Can't find variable: TOOL_NAME` | `TOOL_NAME` のインポート漏れ | `import { ..., TOOL_NAME } from "./definition"` を追加 |
| ピアノが表示されない | return 文に `toolName` プロパティがない | `toolName: TOOL_NAME` を return オブジェクトに追加 |
| 計画と実装の不一致 | 計画ドキュメントの return 文が不完全 | 型定義と Vue/React コンポーネントを確認して補完 |

これらの修正により、ピアノプラグインは正常に動作するようになりました。
