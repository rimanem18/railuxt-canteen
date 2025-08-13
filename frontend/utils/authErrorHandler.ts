/**
 * 認証エラーハンドリングユーティリティ
 *
 * 単一責任：APIエラーレスポンスを統一的なAuthErrorに変換
 * - APIから返される様々なエラー形式を正規化
 * - 型安全なエラー処理を提供
 * - デバッグ情報の管理
 */

import type { AuthError } from '~/types/auth'

/**
 * 未知のエラーを認証エラーに変換
 * @param error - APIまたはその他のエラー
 * @param debug - デバッグモードフラグ
 * @returns 正規化された認証エラー
 */
export const handleAuthError = (error: unknown, debug = false): AuthError => {
  // デバッグモード時のログ出力
  if (debug) {
    console.error('[DEBUG AUTH ERROR]:', error)
  }

  // FetchError（Nuxt $fetchのエラー）の場合
  if (error && typeof error === 'object' && 'data' in error) {
    const errorData = error.data as any

    // APIからのバリデーションエラー配列が存在する場合
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      return {
        message: errorData.errors.join(', '),
        code: errorData.code || 'VALIDATION_ERROR',
        status: errorData.status || 422,
        errors: errorData.errors,
      }
    }

    // APIからの単一エラーメッセージの場合
    if (errorData?.message) {
      return {
        message: errorData.message,
        code: errorData.code || 'API_ERROR',
        status: errorData.status || 500,
      }
    }

    // レスポンスステータスがある場合
    if ('status' in error) {
      const status = (error as any).status
      return {
        message: getErrorMessageByStatus(status),
        code: 'HTTP_ERROR',
        status,
      }
    }

    // データはあるがエラー情報が不明な場合
    return {
      message: 'ログイン処理中にエラーが発生しました',
      code: 'UNKNOWN_API_ERROR',
      status: 500,
    }
  }

  // 標準Errorオブジェクトの場合
  if (error instanceof Error) {
    return {
      message: error.message || 'ログイン失敗',
      code: 'JS_ERROR',
      status: 500,
    }
  }

  // 文字列エラーの場合
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'STRING_ERROR',
      status: 500,
    }
  }

  // その他の不明なエラーの場合
  return {
    message: 'ログイン失敗',
    code: 'UNKNOWN_ERROR',
    status: 500,
  }
}

/**
 * HTTPステータスコードに基づいたエラーメッセージを取得
 * @param status - HTTPステータスコード
 * @returns 対応するエラーメッセージ
 */
const getErrorMessageByStatus = (status: number): string => {
  switch (status) {
    case 400:
      return 'リクエストが不正です'
    case 401:
      return 'メールアドレスまたはパスワードが間違っています'
    case 403:
      return 'アクセスが拒否されました'
    case 404:
      return 'リクエストされたリソースが見つかりません'
    case 422:
      return '入力内容に問題があります'
    case 429:
      return 'リクエスト数が上限を超えました。しばらくお待ちください'
    case 500:
      return 'サーバーエラーが発生しました'
    case 502:
      return 'サーバーに接続できません'
    case 503:
      return 'サービスが一時的に利用できません'
    default:
      return `エラーが発生しました (${status})`
  }
}

/**
 * エラーをコンソールにログ出力
 * @param error - 認証エラー
 * @param context - エラーが発生したコンテキスト
 */
export const logAuthError = (error: AuthError, context?: string): void => {
  const prefix = context ? `[AUTH ERROR - ${context}]` : '[AUTH ERROR]'
  console.error(prefix, {
    message: error.message,
    code: error.code,
    status: error.status,
    errors: error.errors,
  })
}

/**
 * デバッグ用のログ出力（開発環境でのみ有効）
 * @param message - ログメッセージ
 * @param data - 追加データ
 */
export const debugLog = (message: string, data?: unknown): void => {
  // 本番環境では何も出力しない
  if (process.env.NODE_ENV === 'production') {
    return
  }

  console.log(`[AUTH DEBUG] ${message}`, data || '')
}
