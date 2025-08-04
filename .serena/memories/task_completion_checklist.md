# タスク完了時のチェックリスト - railuxt-canteen

## 実装完了後の必須チェック

### 1. 型チェック (フロントエンド)

```bash
docker compose exec web npx nuxi typecheck
```

**エラーが出た場合は必ず修正してからコミット**

### 2. テスト実行

#### フロントエンド

```bash
docker compose exec web npm run test
```

#### バックエンド

```bash
docker compose exec app bundle exec rspec
```

**失敗したテストは必ず修正してからコミット**

### 3. リント・フォーマット

```bash
make fmt
# または個別に
docker compose exec web npm run format
docker compose exec app bundle exec rubocop -a
```

### 4. 動作確認

- [ ] http://localhost:3000 で画面が正常表示される
- [ ] API エンドポイントが正常に動作する
- [ ] 新機能・修正箇所が期待通り動作する

## コード品質チェック

### フロントエンド

- [ ] TypeScript エラーなし
- [ ] ESLint エラーなし
- [ ] テストが通る
- [ ] `any`型を使用していない
- [ ] `@ts-ignore`を使用していない
- [ ] コンポーネント名が multi-word（必要に応じて）

### バックエンド

- [ ] RuboCop エラーなし
- [ ] RSpec テストが通る
- [ ] 関数が 10 行以内
- [ ] 適切なバリデーションが設定されている
- [ ] セキュリティ要件を満たしている

## ドキュメント更新

- [ ] 新しい API エンドポイントの場合、使用方法を明確化
- [ ] 新しい環境変数の場合、.env.example を更新
- [ ] 新しい依存関係の場合、README 更新を検討

## Git 関連

- [ ] 適切なブランチで作業している
- [ ] コミットメッセージが日本語で明確
- [ ] 不要なファイルがステージングされていない

## デプロイ前確認（本番環境）

- [ ] 本番環境でのビルドが成功する
- [ ] 環境変数が適切に設定されている
- [ ] マイグレーションが問題なく実行される

## チェック失敗時の対応

### TypeScript エラー

1. エラー内容を確認
2. 型定義を修正
3. 再度 `npx tsc --noEmit` で確認

### テスト失敗

1. テスト出力を確認
2. 実装またはテストを修正
3. 再度テスト実行

### RuboCop エラー

1. `bundle exec rubocop` でエラー確認
2. 可能な限り `bundle exec rubocop -a` で自動修正
3. 手動修正が必要な場合は指摘に従って修正

## 緊急時のコマンド

```bash
# 全て停止して再起動
make down && make up

# データベースリセット
make db-setup

# 依存関係再インストール
docker compose exec web npm ci
docker compose exec app bundle install
```
