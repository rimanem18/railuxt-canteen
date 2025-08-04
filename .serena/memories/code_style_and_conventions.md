# コードスタイルと規約 - railuxt-canteen

## 共通規約

- **必須**: テスト駆動開発
- **必須**: ファイル末尾には改行を入れて空行を作る
- **必須**: テストケース名は日本語で記載
- **必須**: クラス・関数 Doc には仕様（What）、関数内コメントには判断理由（Why）を記載

## フロントエンド規約 (Nuxt.js/TypeScript)

### 必須事項

- TypeScript 型チェック: `docker compose exec web npx nuxi typecheck`
- 自動テスト: `docker compose exec web npm run test`
- 1 行 80 字以内を推奨

### 推奨/非推奨

- **推奨**: `const` の使用
- **非推奨**: `let` の使用（再代入が明確に必要な場面除く）
- **非推奨**: テストでのモックの乱用
- **非推奨**: `data-testid` の使用

### 禁止事項

- `@ts-ignore` ディレクティブ（`@ts-expect-error`で代用）
- `any` 型（外部ライブラリ等で型取得不能な場合のみ例外）
- `var` の使用
- テストの `.skip`

### ESLint 設定

```javascript
// eslint.config.mjs の主要ルール
'@typescript-eslint/no-explicit-any': 'warn'
'@typescript-eslint/no-unused-vars': 'warn'
'vue/multi-word-component-names': 'off'
'no-console': 'warn'
'no-debugger': 'warn'
```

## バックエンド規約 (Rails/Ruby)

### 必須事項

- RSpec 使用（MiniTest 禁止）
- 関数は 10 行以内（private 抽出で対応）

### RuboCop 設定

- TargetRubyVersion: 3.2
- Max line length: 120
- テストファイルでの長いブロック許容
- ドキュメントコメント無効化
- Rails 向け拡張有効

### ファイル除外

- db/schema.rb, db/migrate/\*.rb
- bin/**, tmp/**, vendor/\*\*

## テスト戦略

### フロントエンド

- Vitest + Vue Test Utils
- jsdom 環境
- テストタイムアウト: 10 秒
- E2E/統合テストとのバランス重視

### バックエンド

- RSpec + FactoryBot
- テストファイルは日本語命名

## コメント規約

```ruby
# 悪い例
def calculate_age(birth_date)
  # 年齢を計算
  age = Date.current.year - birth_date.year
end

# 良い例
/**
 * ユーザーの年齢を計算する
 * @param {Date} birthDate - 生年月日
 * @returns {number} 年齢（0以上の整数）
 */
def calculate_age(birth_date)
  # 単純な年の差分だとうるう年で誤差が生じるため、日付比較を使用
  age = Date.current.year - birth_date.year
  # 誕生日前なら1歳引く必要がある
  age -= 1 if Date.current < birth_date + age.years
  age
end
```
