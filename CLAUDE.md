# プロジェクト概要

このプロジェクトは、Docker コンテナによって、バックエンドとフロントエンドがわかれています。

バックエンドは app サービスとして提供されており、フロントエンドは web サービスとして提供されています。

## ディレクトリ構成

- **`frontend/`**: web コンテナにバインド（Nuxt.js アプリケーション）
- **`backend/`**: app コンテナにバインド（Rails API アプリケーション）
- **`docker/`**: Dockerfile とコンテナ設定
- **`compose.yml`**: Docker Compose 設定ファイル

## アーキテクチャ概要

- **SPA + API 構成**: フロントエンド（Nuxt.js）とバックエンド（Rails API）の完全分離
- **コンテナベース**: Docker Compose によるコンテナ環境での開発
- **トークンベース認証**: DeviseTokenAuth によるステートレス認証

## コンテナ構成

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │  PostgreSQL     │
│   (Nuxt.js 3)   │◄──►│   (Rails 7)     │◄──►│   Database      │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │
        └──────────────┬────────┘
                       │
             Docker Compose Network
```

## データモデル構造

```
User (ユーザー)
├── id, name, email (基本情報)
├── DeviseTokenAuth認証情報
├── trackable情報（ログイン履歴）
└── has_many: orders (注文履歴)

Dish (料理)
├── id, name, price (基本情報)
├── created_at, updated_at
└── has_many: orders (注文履歴)

Order (注文)
├── user_id, dish_id (関連ID)
├── quantity (注文数量)
├── status (提供状況: enum)
├── created_at (注文日時)
└── belongs_to: user, dish
```

## セキュリティ機能

- **トークン自動更新**: リクエスト毎にトークンをローテーション
- **セッション管理**: クライアント側でのトークン管理
- **権限制御**: ロールベースの機能制限
- **確認機能**: メール確認によるアカウント有効化
- **追跡機能**: ログイン履歴の記録

# フロントエンド開発ガイドライン

## 技術スタック

- **フロントエンド**: Nuxt.js 3 + TypeScript
  - **パッケージ管理**: npm
  - **テスト**: Vitest + Vue Test Utils
  - **フォーマット**: ESLint + Prettier + TypeScript
  - **型チェック**: TypeScript + Zod 実行時検証
  - **レンダリング**: SPA モード（`ssr: false`）
  - **TypeScript**: 全面採用による型安全性確保
  - **スタイリング**: Tailwind CSS（ユーティリティファースト）
  - **状態管理**: Pinia

## コマンド操作

フロントエンド関連のコマンドは web コンテナ内で実行してください：

```bash
# example
docker compose exec web npm install
docker compose exec web npm run dev
docker compose exec web npm run build
```

## コード品質・フォーマット

以下を考慮し、コードの品質を保ってください：

- **必須**: テスト駆動開発
  - 実装を更新したらテストコードも更新
  - テストコードに記載するテストケース名は日本語で記載
- **必須**: ファイルの末尾には改行を入れて空行を作る
- **必須**: `docker compose exec web npx tsc --noEmit` による型チェック
- **必須**: `docker compose exec web npm run test` による自動テスト
- **推奨**: 1 行あたりの文字数は 80 字以内になるように改行
- **推奨**: `const` の使用
- **非推奨**: テストでのモックの乱用
  - 特に実装との乖離を生むような過度なスタブは避け、E2E または統合テストとのバランスを考慮
- **非推奨**: `let` の使用
  - ただし、再代入が明確に必要な場面（ループ変数や一時的な状態）の使用可
- **非推奨**: `data-testid` の使用
- **禁止**: `@ts-ignore` ディレクティブの使用
  - `@ts-expect-error` ディレクティブで代用
- **禁止**: `any` 型の使用
  - ただし、型が取得不能な外部ライブラリや JSON パースなどの場合に限り、理由コメントを添えて明示的に使用可
- **禁止**: `var` の使用
- **禁止**: テストの `.skip`
  - 意図的な未実装は TODO コメントで

# バックエンド開発ガイドライン

## 技術スタック

- **バックエンド**: Rails 7 API Mode + PostgreSQL
  - **認証**: DeviseTokenAuth
  - **フォーマット**: RuboCop
  - **テスト**: RSpec

## コマンド操作

バックエンド関連のコマンドは app コンテナ内で実行してください：

```bash
# example
docker compose exec app rails console
docker compose exec app rails server
docker compose exec app bundle exec rspec
docker compose exec app bundle install
```

## コード品質・フォーマット

以下を考慮し、コードの品質を保ってください：

- **必須**: テスト駆動開発
  - 実装を更新したらテストコードも更新
  - テストコードに記載するテストケース名は日本語で記載
- **必須**: ファイルの末尾には改行を入れて空行を作る
- **禁止**: 10 行を超える複雑な関数の作成
  - 処理の一部を private のメソッドに抽出して対応
- **禁止**: MiniTest の使用
  - RSpec を使用してください。
