# 東京ランダム散歩OS

iPhone対応のPWAウェブアプリ。ワンタップで東京23区の散歩ミッションをランダム生成する。

## Run & Operate

- `pnpm --filter @workspace/tokyo-walk run dev` — フロントエンド開発サーバー（ポートはPORT環境変数）
- `pnpm run typecheck` — 全パッケージのタイプチェック
- `pnpm run build` — タイプチェック＋ビルド

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- フロントエンド: React + Vite
- スタイル: Tailwind CSS v4, shadcn/ui
- アニメーション: framer-motion
- ルーティング: wouter（現状はシングルページのため実質未使用）

## Where things live

- `artifacts/tokyo-walk/src/App.tsx` — メインアプリロジック（全ランダム生成ロジックはここ）
- `artifacts/tokyo-walk/src/index.css` — ダークテーマパレット（サイバーパンク×東京）
- `artifacts/tokyo-walk/index.html` — PWAメタタグ（iPhone対応）
- `artifacts/tokyo-walk/public/manifest.json` — PWAマニフェスト

## Architecture decisions

- バックエンド不要: 全ランダム生成はクライアントサイドのMath.random()で完結
- 常時ダークモード: ライトモードトグルなし、htmlにdarkクラス固定
- PWA対応: apple-mobile-web-app-capable、viewport-fit=cover、manifest.json
- フォント: Noto Sans JP（Google Fonts）

## Product

- エリア（12種）: 下町、商店街、工場地帯、住宅街、繁華街、川沿い、寺社仏閣、再開発、坂道、市場周辺、路地裏、公園
- テーマ（12種）: 猫を探せ、昭和の残り香、インスタ映えゼロ、など
- 特殊ルール（12種）: 右にしか曲がれない、スマホのナビ禁止、など
- 途中イベント（15種から3つ）: 通り雨、謎の行列、猫登場、など
- 途中イベント単体の再抽選ボタンあり

## User preferences

- iPhoneで使いやすいモバイルファーストUI
- ダークテーマ固定
- 日本語UI
- ゲーム感・サイバーパンクな雰囲気

## Gotchas

- index.cssの先頭行はGoogle Fonts @importでなければならない（PostCSSの制約）
- framer-motionは既にpackage.jsonに含まれている

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
