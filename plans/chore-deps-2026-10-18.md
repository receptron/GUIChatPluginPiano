# 依存更新（2026-10-18）

## 方針
- `yarn upgrade --latest` で最新化。TypeScript は 7 にせず `^6.0.3` に留める（ts 7 は typescript-eslint の対応外）
- `openai` 4 → 7 の型変更（tool call が function / custom の和型）に `demo/useChat.ts` を追従させる
- CI を Node 24.x / 26.x × ubuntu / windows / macos にし、checkout に `persist-credentials: false`、install を `--frozen-lockfile` にする

## やらないこと
- scoria の導入（このリポには入れない）
- `dist/` の扱いの変更
