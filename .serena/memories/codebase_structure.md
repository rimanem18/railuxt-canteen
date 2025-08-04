# コードベース構造 - railuxt-canteen

## プロジェクト全体構造
```
railuxt-canteen/
├── frontend/           # Nuxt.js アプリケーション (webコンテナ)
├── backend/            # Rails API (appコンテナ)
├── docker/             # Dockerfile設定
├── scripts/            # 補助スクリプト
├── compose.yml         # Docker Compose設定
├── Makefile           # 開発用コマンド
├── CLAUDE.md          # プロジェクト固有の開発ガイドライン
└── README.md          # プロジェクト説明
```

## フロントエンド構造 (frontend/)
```
frontend/
├── components/         # Vueコンポーネント
│   ├── OrderList.vue
│   ├── OrderStatus.vue
│   ├── OrderHeader.vue
│   ├── OrderFooter.vue
│   ├── OrderItem.vue
│   ├── OrderItemEmpty.vue
│   └── OrderTimestamp.vue
├── composables/        # Vue Composition API
│   └── useUserDisplay.ts
├── pages/              # ページコンポーネント (ルーティング)
│   └── orders.vue
├── middleware/         # Nuxtミドルウェア
├── plugins/            # Nuxtプラグイン
├── public/             # 静的ファイル
├── server/             # サーバーサイド処理
├── test/               # テストファイル
│   ├── components/     # コンポーネントテスト
│   ├── composables/    # Composableテスト
│   └── setup.ts        # テスト設定
├── types/              # TypeScript型定義
├── app.vue             # ルートコンポーネント
├── nuxt.config.ts      # Nuxt設定
├── vitest.config.ts    # テスト設定
├── eslint.config.mjs   # ESLint設定
├── package.json        # 依存関係
└── tsconfig.json       # TypeScript設定
```

## バックエンド構造 (backend/)
```
backend/
├── app/
│   ├── controllers/
│   │   ├── application_controller.rb
│   │   └── api/
│   │       └── v1/
│   │           ├── health_controller.rb
│   │           ├── dishes_controller.rb
│   │           └── orders_controller.rb
│   └── models/
│       ├── application_record.rb
│       ├── user.rb           # DeviseTokenAuth使用
│       ├── dish.rb
│       └── order.rb          # ステータス管理・ページネーション
├── config/               # Rails設定
├── db/
│   ├── migrate/          # マイグレーションファイル
│   └── seeds.rb          # 初期データ
├── spec/                 # RSpecテスト
├── Gemfile               # Ruby依存関係
├── .rubocop.yml          # RuboCop設定
└── .rspec                # RSpec設定
```

## 重要な設計パターン

### 認証フロー
1. DeviseTokenAuth (Rails) でトークン生成
2. フロントエンドでトークン管理
3. API呼び出し時にトークンをヘッダーに含める

### データフロー
1. Nuxt.js (SPA) → Rails API (JSON)
2. TanStack Query でキャッシュ管理
3. Pinia で状態管理

### テスト戦略
- **Frontend**: Vitest + Vue Test Utils（コンポーネント単体）
- **Backend**: RSpec + FactoryBot（モデル・API）
- **E2E**: プロジェクト要件に応じて追加検討

### APIバージョニング
- `/api/v1/` プレフィックス使用
- RESTful設計

### Order ステータス管理
```ruby
enum :status, {
  pending: 0,      # 未提供
  confirmed: 1,    # 受付済み
  preparing: 2,    # 調理中
  ready: 3,        # 提供準備完了
  completed: 4,    # 提供済み
  cancelled: 5     # キャンセル
}
```

## 環境設定ファイル
- `.env` : 環境変数（.env.exampleからコピー）
- `frontend/nuxt.config.ts` : Nuxt設定
- `backend/config/` : Rails設定
- `compose.yml` : Docker Compose設定

## 重要な依存関係
### Frontend
- **@tanstack/vue-query**: データフェッチ・キャッシュ
- **@pinia/nuxt**: 状態管理
- **zod**: 実行時検証
- **@nuxtjs/tailwindcss**: スタイリング

### Backend
- **devise_token_auth**: API認証
- **rack-cors**: CORS対応
- **pg**: PostgreSQL接続