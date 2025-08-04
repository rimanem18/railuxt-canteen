# 推奨コマンド - railuxt-canteen

## 基本コンテナ操作

### 初回セットアップ

```bash
make init  # 環境変数コピー、依存関係インストール
```

### 日常的な操作

```bash
make up    # コンテナ起動
make down  # コンテナ終了
make ps    # コンテナ状況確認
make logs  # ログ表示
```

### コンテナアクセス

```bash
make app   # Railsコンテナにbashでアクセス
make web   # Nuxtコンテナにbashでアクセス
make db    # PostgreSQLコンテナにbashでアクセス
```

### データベース操作

```bash
make db-setup  # DB作成・マイグレーション・シード実行
```

## フロントエンド開発 (web コンテナ内)

### 開発サーバー

```bash
docker compose exec web npm run dev
```

### テスト

```bash
docker compose exec web npm run test          # テスト実行
docker compose exec web npm run test:watch    # ウォッチモード
docker compose exec web npm run test:coverage # カバレッジ付き
```

### 型チェック・品質チェック

```bash
docker compose exec web npx nuxi typecheck      # TypeScript型チェック
docker compose exec web npm run lint          # ESLint実行
docker compose exec web npm run lint:fix      # ESLint自動修正
docker compose exec web npm run format        # Prettier + ESLint修正
```

### ビルド

```bash
docker compose exec web npm run build         # 本番ビルド
docker compose exec web npm run generate      # 静的生成
docker compose exec web npm run preview       # ビルド確認
```

## バックエンド開発 (app コンテナ内)

### 開発サーバー

```bash
docker compose exec app rails server  # Rails APIサーバー起動
```

### テスト

```bash
docker compose exec app bundle exec rspec     # RSpec実行
docker compose exec app bundle exec rspec spec/models  # モデルテストのみ
```

### データベース操作

```bash
docker compose exec app rails console         # Railsコンソール
docker compose exec app rails db:create       # DB作成
docker compose exec app rails db:migrate      # マイグレーション
docker compose exec app rails db:seed         # シードデータ投入
docker compose exec app rails db:reset        # DB削除・再作成
```

### コード品質

```bash
docker compose exec app bundle exec rubocop   # RuboCop実行
docker compose exec app bundle exec rubocop -a # RuboCop自動修正
make fmt  # フロントエンド+バックエンド同時フォーマット
```

### その他の Rails コマンド

```bash
docker compose exec app rails routes          # ルート確認
docker compose exec app rails generate model User  # モデル生成
docker compose exec app rails db:rollback     # マイグレーション巻き戻し
```

## Git 操作

```bash
make amend  # 最新コミットの修正
```

## よく使うコマンド組み合わせ

### 完全リセット

```bash
make down && make up && make db-setup
```

### 開発開始

```bash
make up
# 別ターミナルで
docker compose exec web npm run dev
docker compose exec app rails server
```

### テスト実行 (両方)

```bash
docker compose exec web npm run test
docker compose exec app bundle exec rspec
```

### コード品質チェック

```bash
make fmt  # または個別に
docker compose exec web npm run format
docker compose exec app bundle exec rubocop -a
```

## アクセス URL

- フロントエンド: http://localhost:3000
- バックエンド API: http://localhost:3001
- 注文履歴: http://localhost:3000/orders
