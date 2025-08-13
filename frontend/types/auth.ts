/**
 * 認証機能専用の型定義
 * schemas.tsの型を拡張し、認証関連の追加型を提供
 */

import type { User, AuthResponse, AuthValidateResponse, ApiError } from './schemas'

/**
 * 認証トークン情報
 */
export interface AuthTokens {
  accessToken: string | null
  client: string | null
  uid: string | null
}

/**
 * 認証エラー情報
 * APIErrorを拡張してより詳細な情報を提供
 */
export interface AuthError {
  message: string
  code?: string
  status?: number
  errors?: string[]
}

/**
 * ログインオプション
 */
export interface LoginOptions {
  debug?: boolean
}

/**
 * 認証状態
 */
export interface AuthState {
  user: User | null
  isLoggedIn: boolean
  error: string | null
}

/**
 * 認証API通信の結果
 */
export interface AuthApiResult<T = unknown> {
  success: boolean
  data?: T
  error?: AuthError
}

/**
 * ログイン結果
 */
export type LoginResult = AuthApiResult<User>

/**
 * ログアウト結果
 */
export type LogoutResult = AuthApiResult<void>

/**
 * トークン検証結果
 */
export type ValidateTokenResult = AuthApiResult<User>

// Re-export base types for convenience
export type { User, AuthResponse, AuthValidateResponse, ApiError }
