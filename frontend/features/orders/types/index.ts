/**
 * 注文機能の型定義とスキーマ
 */

import { z } from 'zod'
import { UserSchema } from '../../auth/types/index'
import { DishSchema, PaginationMetaSchema } from '../../dishes/types/index'

// ====================
// 注文関連のスキーマ定義
// ====================

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
// 型推論のエクスポート
// ====================

export type Order = z.infer<typeof OrderSchema>
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>
export type UpdateOrderRequest = z.infer<typeof UpdateOrderRequestSchema>
export type OrderListResponse = z.infer<typeof OrderListResponseSchema>
export type OrderDetailResponse = z.infer<typeof OrderDetailResponseSchema>
export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>
