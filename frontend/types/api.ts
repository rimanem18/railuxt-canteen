/**
 * API型定義ファイル
 * Rails APIレスポンスの型定義を管理
 *
 * 注意: 基本的な型定義（User, Dish, Order等）は schemas.ts で Zod ベースで定義されています。
 * このファイルは API 固有の型定義のみを保持します。
 */

// schemas.ts から基本型をインポート
// ====================
// API 固有の型定義
// ====================

// PaginationMetaをインポート
import type { PaginationMeta } from './schemas'

export type {
  User,
  Dish,
  Order,
  LoginRequest,
  RegisterRequest,
  CreateOrderRequest,
  UpdateOrderRequest,
  AuthResponse,
  AuthValidateResponse,
  DishListResponse,
  DishDetailResponse,
  OrderListResponse,
  OrderDetailResponse,
  CreateOrderResponse,
  ApiError,
  ValidationError,
  PaginationMeta,
} from './schemas'

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
