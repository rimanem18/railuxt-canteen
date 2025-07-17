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

以下を考慮し、コードの品質を保ってください：

- 共通
  - 必須: ファイルの末尾には必ず改行を入れて空行を作る
- Frontend:
  - 必須: `npm run format` による自動修正
  - 必須: `npx tsc --noEmit` による型チェック
  - 推奨: 1 行あたりの文字数は 80 字以内になるように改行
  - 禁止: any 型の使用
  - 禁止: テストの skip
