/**
 * Zodスキーマ定義ファイル
 * 実行時バリデーションと型安全性を提供
 */

import { z } from 'zod'

// ====================
// 基本的なスキーマ定義
// ====================

/**
 * ユーザー情報のスキーマ
 */
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'ユーザー名は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  image: z.string().url().nullable().optional(), // テストで使用されるプロパティ
  provider: z.string().optional(), // テストで使用されるプロパティ
  uid: z.string().optional(), // テストで使用されるプロパティ（認証用UID）
  allow_password_change: z.boolean().optional(), // テストで使用されるプロパティ（パスワード変更許可）
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

/**
 * 料理情報のスキーマ
 */
export const DishSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, '料理名は必須です'),
  description: z.string().optional(),
  price: z.number().positive('価格は正の数である必要があります'),
  image_url: z.string().url().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

/**
 * 注文情報のスキーマ
 */
export const OrderSchema = z.object({
  id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  dish_id: z.number().int().positive(),
  quantity: z.number().int().positive('数量は正の整数である必要があります'),
  total_price: z.number().positive('合計価格は正の数である必要があります'),
  status: z.enum([
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'completed',
    'cancelled',
  ]),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  dish: DishSchema.optional(),
  user: UserSchema.optional(),
})

// ====================
// リクエストスキーマ定義
// ====================

/**
 * ログインリクエストのスキーマ
 */
export const LoginRequestSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードは必須です'),
})

/**
 * ユーザー登録リクエストのスキーマ
 */
export const RegisterRequestSchema = z
  .object({
    name: z.string().min(1, 'ユーザー名は必須です'),
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
    password_confirmation: z
      .string()
      .min(6, 'パスワード確認は6文字以上である必要があります'),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'パスワードが一致しません',
    path: ['password_confirmation'],
  })

/**
 * 注文作成リクエストのスキーマ
 */
export const CreateOrderRequestSchema = z.object({
  dish_id: z.number().int().positive('料理IDは正の整数である必要があります'),
  quantity: z.number().int().positive('数量は正の整数である必要があります'),
})

/**
 * 注文更新リクエストのスキーマ
 */
export const UpdateOrderRequestSchema = z.object({
  quantity: z
    .number()
    .int()
    .positive('数量は正の整数である必要があります')
    .optional(),
  status: z
    .enum([
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'completed',
      'cancelled',
    ])
    .optional(),
})

// ====================
// レスポンススキーマ定義
// ====================

/**
 * 認証レスポンスのスキーマ
 */
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  data: UserSchema,
  message: z.string().optional(),
})

/**
 * 認証検証レスポンスのスキーマ
 */
export const AuthValidateResponseSchema = z.object({
  success: z.boolean(),
  data: UserSchema,
})

/**
 * ページネーション情報のスキーマ
 */
export const PaginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  current_page: z.number().int().positive(),
  total_pages: z.number().int().nonnegative(),
  per_page: z.number().int().positive(),
  has_next: z.boolean(),
  has_prev: z.boolean(),
})

/**
 * 料理一覧レスポンスのスキーマ
 */
export const DishListResponseSchema = z.object({
  data: z.array(DishSchema),
  meta: PaginationMetaSchema.optional(),
})

/**
 * 料理詳細レスポンスのスキーマ
 */
export const DishDetailResponseSchema = z.object({
  data: DishSchema,
})

/**
 * 注文一覧レスポンスのスキーマ
 */
export const OrderListResponseSchema = z.object({
  data: z.array(OrderSchema),
  meta: PaginationMetaSchema.optional(),
})

/**
 * 注文詳細レスポンスのスキーマ
 */
export const OrderDetailResponseSchema = z.object({
  data: OrderSchema,
})

/**
 * 注文作成レスポンスのスキーマ
 */
export const CreateOrderResponseSchema = z.object({
  data: OrderSchema,
  message: z.string().optional(),
})

// ====================
// エラーレスポンススキーマ定義
// ====================

/**
 * APIエラーレスポンスのスキーマ
 */
export const ApiErrorSchema = z.object({
  message: z.string(),
  errors: z.array(z.string()).optional(),
  code: z.string().optional(),
  status: z.number().int().optional(),
})

/**
 * バリデーションエラーのスキーマ
 */
export const ValidationErrorSchema = z.object({
  errors: z.record(z.string(), z.array(z.string())),
  message: z.string(),
})

// ====================
// 汎用スキーマ定義
// ====================

/**
 * API成功レスポンスの汎用スキーマ
 */
export const createApiSuccessSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) => {
  return z.object({
    data: dataSchema,
    message: z.string().optional(),
    meta: PaginationMetaSchema.optional(),
  })
}

// ====================
// 型推論のエクスポート
// ====================

export type User = z.infer<typeof UserSchema>
export type Dish = z.infer<typeof DishSchema>
export type Order = z.infer<typeof OrderSchema>
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>
export type UpdateOrderRequest = z.infer<typeof UpdateOrderRequestSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type AuthValidateResponse = z.infer<typeof AuthValidateResponseSchema>
export type DishListResponse = z.infer<typeof DishListResponseSchema>
export type DishDetailResponse = z.infer<typeof DishDetailResponseSchema>
export type OrderListResponse = z.infer<typeof OrderListResponseSchema>
export type OrderDetailResponse = z.infer<typeof OrderDetailResponseSchema>
export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>
export type ApiError = z.infer<typeof ApiErrorSchema>
export type ValidationError = z.infer<typeof ValidationErrorSchema>
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
