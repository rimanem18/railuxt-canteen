## プロジェクト概要

このプロジェクトは、Docker コンテナによって、バックエンドとフロントエンドがわかれています。

バックエンドは app サービスとして提供されており、フロントエンドは web サービスとして提供されています。

## ディレクトリ

web コンテナのファイルは、`frontend` にバインドされています。
app コンテナのファイルは、`backend` にバインドされています。

### 技術スタック

- **バックエンド**: Rails 7 API Mode + PostgreSQL
- **フロントエンド**: Nuxt.js 3 + TypeScript
  - **パッケージ管理**: npm
- **認証**: DeviseTokenAuth
- **インフラ**: Docker + Docker Compose

## MUST 一部のコマンド操作はコンテナのなかでおこなう

- フロントエンド: `docker compose exec web`
- バックエンド: `docker compose exec app`
  のように、 docker compose コマンドを通じてコマンドを実施してください。

- Backend
  - `rails *`
  - `bundle exec *`
- Frontend
  - `npm *`

## MUST テストと実装のワークフロー

- 実装を更新したらテストコードも更新してください
- テストコードに記載するテストケース名は、日本語で記載してください

## コード品質・フォーマット

コードの品質を保つため、以下のコマンドを活用してください：

- **自動フォーマット**: `make fmt`
  - Rails: RuboCop による自動修正
  - Frontend: npm run format による自動修正
