/**
 * 料理機能の型定義とスキーマ
 */

import { z } from 'zod'

// ====================
// 料理関連のスキーマ定義
// ====================

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

// ====================
// 型推論のエクスポート
// ====================

export type Dish = z.infer<typeof DishSchema>
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
export type DishListResponse = z.infer<typeof DishListResponseSchema>
export type DishDetailResponse = z.infer<typeof DishDetailResponseSchema>
