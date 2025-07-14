## プロジェクト概要

このプロジェクトは、Docker コンテナによって、バックエンドとフロントエンドがわかれています。

バックエンドは app サービスとして提供されており、フロントエンドは web サービスとして提供されています。

### 技術スタック

- **バックエンド**: Rails 7 API Mode + PostgreSQL
- **フロントエンド**: Nuxt.js 3 + TypeScript
  - **パッケージ管理**: npm
- **認証**: DeviseTokenAuth
- **インフラ**: Docker + Docker Compose

### 日常的な開発作業

- **コンテナ**
  - **起動**: `make up`
  - **停止**: `make down`
  - **再起動**: `make restart`
  - **ログ確認**: `make logs`
  - **状態確認**: `make ps`

## Recommend Docker コンテナの利用

それぞれのコンテナには、

- フロントエンド: `make web`
- バックエンド: `make app`
- データベース: `make db`
  で入ることができます。

## MUST 一部のコマンド操作はコンテナのなかでおこなう

以下に関連するコマンドは、それぞれのコンテナの中に入ってから実施してください。

- Backend
  - `rails *`
  - `bundle exec *`
- Frontend
  - `npm *`

## コード品質・フォーマット

コードの品質を保つため、以下のコマンドを活用してください：

- **自動フォーマット**: `make fmt`
  - Rails: RuboCop による自動修正
  - Frontend: npm run format による自動修正
- **pre-commit フック**: Git コミット前に自動実行
