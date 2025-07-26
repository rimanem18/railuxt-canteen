/**
 * 共通API型定義
 * 複数のfeatureで使用される汎用的な型定義を管理
 */

import { z } from 'zod'

// ====================
// HTTP メソッド型定義
// ====================

/**
 * 利用するHTTPメソッドを明示的に定義
 * 大文字・小文字両方をサポートして互換性を保つ
 */
type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'

// ====================
// API オプション型定義
// ====================

/**
 * useApi専用のオプション型定義
 * 実際に使用される機能のみを定義
 */
export interface UseApiOptions {
  /** HTTPメソッド */
  method?: HttpMethod
  /** リクエストボディ */
  body?: unknown
  /** リクエストヘッダー */
  headers?: Record<string, string>
  /** クエリパラメータ */
  query?: Record<string, string | number | boolean>
}

/**
 * useFetchのオプション型定義
 */
export interface FetchOptions {
  /** HTTPメソッド */
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete'
  /** リクエストボディ */
  body?: any
  /** リクエストヘッダー */
  headers?: Record<string, string>
  /** クエリパラメータ */
  query?: Record<string, string | number | boolean>
  /** リクエストタイムアウト */
  timeout?: number
  /** リトライ回数 */
  retry?: number
  /** レスポンスの型変換を無効化 */
  transform?: boolean
}

// ====================
// API レスポンス型定義
// ====================

/**
 * API成功レスポンスの汎用型定義
 */
export interface ApiSuccess<T> {
  /** レスポンスデータ */
  data: T
  /** メッセージ */
  message?: string
  /** メタ情報 */
  meta?: PaginationMeta
}

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

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
export type ApiError = z.infer<typeof ApiErrorSchema>
export type ValidationError = z.infer<typeof ValidationErrorSchema>
