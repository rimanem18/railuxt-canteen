# TypeScript型強化ガイド

## 概要

このプロジェクトでは、TypeScriptの型安全性を最大限に活用するため、段階的な型強化を実施しました。

## 実装した機能

### 1. ESLint設定強化

- `@typescript-eslint/eslint-plugin`を追加
- `@typescript-eslint/no-explicit-any`ルールを警告レベルで導入
- Nuxtの推奨設定を使用した統合設定

### 2. 型定義ファイルの整理

#### API型定義 (`types/api.ts`)

- Rails APIレスポンスの型定義
- リクエスト・レスポンスの型定義
- エラーハンドリングの型定義

#### Zodスキーマ (`types/schemas.ts`)

- 実行時バリデーション用のスキーマ
- 型推論による型安全性の確保
- バリデーションエラーの適切な処理

### 3. コンポーザブルの型強化

#### useApi

- ジェネリクスの適切な活用
- `any`を`unknown`に変更
- オプションパラメータの型定義

#### useAuth

- エラーハンドリングでの`any`削除
- 型アサーションの適切な使用
- API型定義の活用

#### useTypedFetch

- Zodスキーマによる実行時バリデーション
- 型安全なAPI呼び出し
- エラーハンドリングの強化

### 4. テストコードの型強化

- モック関数の型定義
- `any`を`unknown`に変更
- 型アサーションの適切な使用

## 使用方法

### 1. 基本的なAPI呼び出し

```typescript
import { useApi } from "~/composables/useApi";
import type { User } from "~/types/api";

// 型安全なAPI呼び出し
const { data, error } = useApi<User>("/api/v1/users/1");
```

### 2. 実行時バリデーション付きAPI呼び出し

```typescript
import { useTypedFetch } from "~/composables/useTypedFetch";
import { UserSchema } from "~/types/schemas";

// スキーマによる実行時バリデーション
const result = await useTypedFetch("/api/v1/users/1", UserSchema);
if (result.error) {
  // エラー処理
  console.error(result.error);
} else {
  // データは型安全
  console.log(result.data.name);
}
```

### 3. 新しいAPI型の追加

1. `types/api.ts`に型定義を追加
2. `types/schemas.ts`に対応するZodスキーマを追加
3. コンポーザブルで型を活用

```typescript
// types/api.ts
export interface NewEntity {
  id: number;
  name: string;
}

// types/schemas.ts
export const NewEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
});

// 使用例
const { data } = useApi<NewEntity>("/api/v1/new-entities");
```

## 開発ガイドライン

### 1. 型の使用方針

- **`any`の使用を避ける**: 必要な場合は`unknown`を使用
- **型アサーション**: 最小限に留め、適切な型ガードを使用
- **ジェネリクス**: 再利用可能な型定義を活用

### 2. エラーハンドリング

```typescript
try {
  const result = await apiCall();
  // 成功時の処理
} catch (e: unknown) {
  // エラーの型を確認してから処理
  if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error("Unknown error:", e);
  }
}
```

### 3. 新規コンポーネントの作成

```typescript
// props と emits の型定義
interface Props {
  user: User | null;
  isLoading: boolean;
}

interface Emits {
  (e: "update", user: User): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
```

## メンテナンス

### 1. 型エラーの確認

```bash
# 型チェック
npm run lint

# 自動修正
npm run lint:fix
```

### 2. 新しい型の追加

1. 必要に応じて型定義ファイルを更新
2. 対応するZodスキーマを追加
3. テストコードを更新
4. ドキュメントを更新

### 3. 既存コードの移行

1. ESLintの警告を確認
2. `any`を適切な型に変更
3. 型アサーションを型ガードに変更
4. テストの実行と確認

## 参考資料

- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Zod公式ドキュメント](https://zod.dev/)
- [Nuxt 3 TypeScript](https://nuxt.com/docs/guide/concepts/typescript)
- [Vue 3 TypeScript](https://vuejs.org/guide/typescript/)
