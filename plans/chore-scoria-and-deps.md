# scoria の導入と依存更新

## 方針
- GUIChatPluginSpreadsheet と同じ形で scoria を入れる
  - `scoria` を devDependencies に入れ、`yarn quality`（= `scoria`）で走らせる
  - `scoria.config.json`（検出結果を固定）と `.scoria/baseline.json` をコミットする
  - `.github/workflows/scoria.yml` は Spreadsheet と同じ。計測ジョブは読み取り権限のみ、SARIF のアップロードは別ジョブ
- 依存は `yarn upgrade --latest`。TypeScript は 7 にせず `^6.0.3` に留める（ts 7 は typescript-eslint の対応外）

## Spreadsheet と違うところ
- このリポにはテストが無いので `test:coverage`（c8）は入れない。scoria.yml からも coverage の手順を外す
- `dist/` がコミットされているので scoria は `dist/` も計測する。`dist/` の扱いは今回変えない

## Node の版
- scoria は `engines: node >=24`。Yarn v1 は engines 不一致で install を失敗させるので、このパッケージも `engines: node >=24` とし、CI は Node 24.x / 26.x × ubuntu / windows / macos にする

## 受け入れたこと
- scoria → jscpd → fast-glob → micromatch → braces に High の警告。修正版が未公開なので今は消せない。開発依存なので利用者には届かない
