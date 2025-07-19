# プロジェクト概要

このプロジェクトは、Docker コンテナによって、バックエンドとフロントエンドがわかれています。

バックエンドは app サービスとして提供されており、フロントエンドは web サービスとして提供されています。

## ディレクトリ

web コンテナのファイルは、`frontend` にバインドされています。
app コンテナのファイルは、`backend` にバインドされています。
インフラは Docker + Docker Compose です。

# フロントエンド開発ガイドライン

## 技術スタック

- **フロントエンド**: Nuxt.js 3 + TypeScript
  - **パッケージ管理**: npm

## コマンド操作

フロントエンド関連のコマンドは web コンテナ内で実行してください：

```bash
docker compose exec web npm install
docker compose exec web npm run dev
docker compose exec web npm run build
```

## コード品質・フォーマット

以下を考慮し、コードの品質を保ってください：

- **必須**: `npm run format` による自動修正
- **必須**: `npx tsc --noEmit` による型チェック
- **推奨**: 1 行あたりの文字数は 80 字以内になるように改行
- **禁止**: any 型の使用
- **禁止**: テストの skip

## MUST テストと実装のワークフロー

- 実装を更新したらテストコードも更新してください
- テストコードに記載するテストケース名は、日本語で記載してください

# バックエンド開発ガイドライン

## 技術スタック

- **バックエンド**: Rails 7 API Mode + PostgreSQL
- **認証**: DeviseTokenAuth

## コマンド操作

バックエンド関連のコマンドは app コンテナ内で実行してください：

```bash
docker compose exec app rails console
docker compose exec app rails server
docker compose exec app bundle exec rspec
docker compose exec app bundle install
```

## コード品質・フォーマット

以下を考慮し、コードの品質を保ってください：

- **必須**: ファイルの末尾には必ず改行を入れて空行を作る

# 共通開発ガイドライン

## MUST テストと実装のワークフロー

- 実装を更新したらテストコードも更新してください
- テストコードに記載するテストケース名は、日本語で記載してください
