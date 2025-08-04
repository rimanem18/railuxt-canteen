# 技術スタック - railuxt-canteen

## フロントエンド (web コンテナ)
- **フレームワーク**: Nuxt.js 3 + TypeScript
- **レンダリング**: SPA モード（`ssr: false`）
- **パッケージ管理**: npm
- **スタイリング**: Tailwind CSS
- **状態管理**: Pinia
- **データフェッチ**: @tanstack/vue-query
- **バリデーション**: Zod（実行時検証）
- **アイコン**: @nuxt/icon
- **画像処理**: @nuxt/image

## バックエンド (app コンテナ)
- **フレームワーク**: Rails 7 API Mode
- **Ruby版**: 3.2.8
- **データベース**: PostgreSQL 15
- **認証**: DeviseTokenAuth
- **テストフレームワーク**: RSpec
- **ファクトリ**: FactoryBot
- **CORS**: rack-cors

## 開発ツール
### フロントエンド
- **テスト**: Vitest + Vue Test Utils + jsdom
- **リンター**: ESLint + TypeScript
- **フォーマッター**: Prettier
- **型チェック**: TypeScript

### バックエンド
- **リンター/フォーマッター**: RuboCop（複数プラグイン）
- **テスト**: RSpec + FactoryBot
- **デバッグ**: debug gem

## 依存関係管理
- Frontend: package.json → npm ci
- Backend: Gemfile → bundle install

## ポート設定
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432 (コンテナ内部)