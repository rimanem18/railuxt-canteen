/**
 * 認証API通信コンポーザブル
 *
 * 単一責任：認証関連のAPI通信処理
 * - ログイン、ログアウト、トークン検証のAPI呼び出し
 * - レスポンスからのトークン抽出とヘッダー管理
 * - エラーハンドリングとデバッグ機能
 */

import type {
  LoginResult,
  LogoutResult,
  ValidateTokenResult,
  LoginOptions,
  User,
  AuthResponse,
  AuthValidateResponse,
} from '~/types/auth'
import { handleAuthError, debugLog } from '~/utils/authErrorHandler'

/**
 * 認証API通信のコンポーザブル関数
 * @returns API通信のインターフェース
 */
export const useAuthApi = () => {
  const { getAuthHeaders, saveTokensFromHeaders } = useAuthTokens()

  /**
   * APIベースURLを取得
   * @returns ベースURL
   */
  const getBaseUrl = (): string => {
    const config = useRuntimeConfig()
    return config.public.apiBase || ''
  }

  /**
   * 共通のAPIリクエストヘッダーを取得
   * @param includeAuth - 認証ヘッダーを含めるかどうか
   * @returns リクエストヘッダー
   */
  const getRequestHeaders = (includeAuth = false): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (includeAuth) {
      Object.assign(headers, getAuthHeaders())
    }

    return headers
  }

  /**
   * ログインAPI呼び出し
   * @param email - メールアドレス
   * @param password - パスワード
   * @param options - オプション設定
   * @returns ログイン結果
   */
  const login = async (
    email: string,
    password: string,
    options: LoginOptions = {},
  ): Promise<LoginResult> => {
    const { debug = false } = options

    debugLog(`ログイン試行開始: ${email}`, { debug })

    try {
      const response = await $fetch<AuthResponse>('/api/v1/auth/sign_in', {
        method: 'POST',
        baseURL: getBaseUrl(),
        headers: getRequestHeaders(false),
        body: { email, password },
        onResponse({ response }) {
          debugLog('ログインAPIレスポンスヘッダー取得', response.headers)
          // トークンをCookieに保存
          saveTokensFromHeaders(response.headers)
        },
        onResponseError({ response }) {
          // API側でのエラーレスポンス詳細をログ出力
          console.error(
            'ログインAPIエラーレスポンス:',
            response.status,
            response.statusText,
          )
          console.error('レスポンス内容:', response._data)
        },
      })

      debugLog('ログイン成功', response.data)

      return {
        success: true,
        data: response.data,
      }
    }
    catch (error) {
      const authError = handleAuthError(error, debug)

      debugLog('ログイン失敗', authError)

      return {
        success: false,
        error: authError,
      }
    }
  }

  /**
   * ログアウトAPI呼び出し
   * @returns ログアウト結果
   */
  const logout = async (): Promise<LogoutResult> => {
    try {
      await $fetch('/api/v1/auth/sign_out', {
        method: 'DELETE',
        baseURL: getBaseUrl(),
        headers: getRequestHeaders(true), // 認証ヘッダーを含める
      })

      debugLog('ログアウト成功')

      return {
        success: true,
      }
    }
    catch (error) {
      const authError = handleAuthError(error)

      // ログアウトは失敗してもクライアント側での認証情報クリアは続行
      console.warn('ログアウトAPI呼び出しに失敗しましたが、処理を続行します:', authError)

      return {
        success: false,
        error: authError,
      }
    }
  }

  /**
   * トークン検証API呼び出し
   * @returns トークン検証結果
   */
  const validateToken = async (): Promise<ValidateTokenResult> => {
    try {
      const response = await $fetch<AuthValidateResponse>(
        '/api/v1/auth/validate_token',
        {
          method: 'GET',
          baseURL: getBaseUrl(),
          headers: getRequestHeaders(true), // 認証ヘッダーを含める
          onResponse({ response }) {
            // レスポンス時にトークンが更新される可能性があるため保存
            saveTokensFromHeaders(response.headers)
          },
        },
      )

      debugLog('トークン検証成功', response.data)

      return {
        success: true,
        data: response.data,
      }
    }
    catch (error) {
      const authError = handleAuthError(error)

      debugLog('トークン検証失敗', authError)

      return {
        success: false,
        error: authError,
      }
    }
  }

  /**
   * APIの疎通確認（ヘルスチェック）
   * @returns 疎通確認結果
   */
  const healthCheck = async (): Promise<{ success: boolean, message?: string }> => {
    try {
      // 簡単なAPIエンドポイントで疎通確認
      await $fetch('/api/health', {
        method: 'GET',
        baseURL: getBaseUrl(),
        timeout: 5000, // 5秒でタイムアウト
      })

      return { success: true }
    }
    catch (error) {
      return {
        success: false,
        message: 'APIサーバーに接続できません',
      }
    }
  }

  return {
    login,
    logout,
    validateToken,
    healthCheck,
  }
}
