# プロジェクト概要 - railuxt-canteen

## プロジェクトの目的
社員食堂における注文管理システム。ユーザーが料理を注文し、注文状況を管理できるシステムを提供。

## アーキテクチャ
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
```

## ディレクトリ構成
- **`frontend/`**: web コンテナにバインド（Nuxt.js アプリケーション）
- **`backend/`**: app コンテナにバインド（Rails API アプリケーション）
- **`docker/`**: Dockerfile とコンテナ設定
- **`compose.yml`**: Docker Compose 設定ファイル

## データモデル
### User (ユーザー)
- DeviseTokenAuth認証情報
- has_many: orders

### Dish (料理)
- name, price (基本情報)
- has_many: orders

### Order (注文)
- user_id, dish_id, quantity, status
- ステータス: pending, confirmed, preparing, ready, completed, cancelled
- belongs_to: user, dish

## セキュリティ機能
- トークン自動更新
- メール確認によるアカウント有効化
- ロールベースの機能制限
- セッション管理