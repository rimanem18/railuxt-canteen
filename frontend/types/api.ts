/**
 * API型定義ファイル
 * Rails APIレスポンスの型定義を管理
 */

// ====================
// 基本的な型定義
// ====================

/**
 * ユーザー情報の型定義
 */
export interface User {
  /** ユーザーID */
  id: number
  /** ユーザー名 */
  name: string
  /** メールアドレス */
  email: string
  /** 作成日時 */
  created_at?: string
  /** 更新日時 */
  updated_at?: string
}

/**
 * 料理情報の型定義
 */
export interface Dish {
  /** 料理ID */
  id: number
  /** 料理名 */
  name: string
  /** 説明 */
  description?: string
  /** 価格 */
  price: number
  /** 画像URL */
  image_url?: string
  /** 作成日時 */
  created_at?: string
  /** 更新日時 */
  updated_at?: string
}

/**
 * 注文情報の型定義
 */
export interface Order {
  /** 注文ID */
  id: number
  /** ユーザーID */
  user_id: number
  /** 料理ID */
  dish_id: number
  /** 数量 */
  quantity: number
  /** 合計価格 */
  total_price: number
  /** 注文ステータス */
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'completed'
    | 'cancelled'
  /** 作成日時 */
  created_at?: string
  /** 更新日時 */
  updated_at?: string
  /** 関連する料理情報 */
  dish?: Dish
  /** 関連するユーザー情報 */
  user?: User
}

// ====================
// API リクエスト型定義
// ====================

/**
 * ログインリクエストの型定義
 */
export interface LoginRequest {
  /** メールアドレス */
  email: string
  /** パスワード */
  password: string
}

/**
 * ユーザー登録リクエストの型定義
 */
export interface RegisterRequest {
  /** ユーザー名 */
  name: string
  /** メールアドレス */
  email: string
  /** パスワード */
  password: string
  /** パスワード確認 */
  password_confirmation: string
}

/**
 * 注文作成リクエストの型定義
 */
export interface CreateOrderRequest {
  /** 料理ID */
  dish_id: number
  /** 数量 */
  quantity: number
}

/**
 * 注文更新リクエストの型定義
 */
export interface UpdateOrderRequest {
  /** 数量 */
  quantity?: number
  /** 注文ステータス */
  status?: Order['status']
}

// ====================
// API レスポンス型定義
// ====================

/**
 * 認証レスポンスの型定義
 */
export interface AuthResponse {
  /** 認証成功フラグ */
  success: boolean
  /** ユーザー情報 */
  data: User
  /** メッセージ */
  message?: string
}

/**
 * 認証検証レスポンスの型定義
 */
export interface AuthValidateResponse {
  /** 認証成功フラグ */
  success: boolean
  /** ユーザー情報 */
  data: User
}

/**
 * 料理一覧レスポンスの型定義
 */
export interface DishListResponse {
  /** 料理一覧 */
  data: Dish[]
  /** メタ情報 */
  meta?: {
    /** 総数 */
    total: number
    /** 現在のページ */
    current_page: number
    /** 総ページ数 */
    total_pages: number
    /** 1ページあたりの件数 */
    per_page: number
  }
}

/**
 * 料理詳細レスポンスの型定義
 */
export interface DishDetailResponse {
  /** 料理情報 */
  data: Dish
}

/**
 * 注文一覧レスポンスの型定義
 */
export interface OrderListResponse {
  /** 注文一覧 */
  data: Order[]
  /** メタ情報 */
  meta?: {
    /** 総数 */
    total: number
    /** 現在のページ */
    current_page: number
    /** 総ページ数 */
    total_pages: number
    /** 1ページあたりの件数 */
    per_page: number
  }
}

/**
 * 注文詳細レスポンスの型定義
 */
export interface OrderDetailResponse {
  /** 注文情報 */
  data: Order
}

/**
 * 注文作成レスポンスの型定義
 */
export interface CreateOrderResponse {
  /** 作成された注文情報 */
  data: Order
  /** メッセージ */
  message?: string
}

// ====================
// エラーレスポンス型定義
// ====================

/**
 * APIエラーレスポンスの型定義
 */
export interface ApiError {
  /** エラーメッセージ */
  message: string
  /** エラー詳細（複数の場合） */
  errors?: string[]
  /** エラーコード */
  code?: string
  /** HTTPステータスコード */
  status?: number
}

/**
 * バリデーションエラーの型定義
 */
export interface ValidationError {
  /** フィールド名とエラーメッセージのマッピング */
  errors: Record<string, string[]>
  /** エラーメッセージ */
  message: string
}

// ====================
// 汎用型定義
// ====================

/**
 * ページネーション情報の型定義
 */
export interface PaginationMeta {
  /** 総数 */
  total: number
  /** 現在のページ */
  current_page: number
  /** 総ページ数 */
  total_pages: number
  /** 1ページあたりの件数 */
  per_page: number
  /** 次のページがあるか */
  has_next: boolean
  /** 前のページがあるか */
  has_prev: boolean
}

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
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
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
