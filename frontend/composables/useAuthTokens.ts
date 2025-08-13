/**
 * 認証トークン管理コンポーザブル
 * DeviseTokenAuthの認証トークンのCRUD操作を担当
 *
 * 単一責任：認証トークンの永続化とアクセス
 * - access-token, client, uid の Cookie操作
 * - ヘッダーからトークンへの変換
 * - トークンからヘッダーへの変換
 */

import type { AuthTokens } from '~/types/auth'

/**
 * 認証トークン管理のコンポーザブル関数
 * @returns トークン管理のインターフェース
 */
export const useAuthTokens = () => {
  // DeviseTokenAuthで必要な認証トークンを管理するためのCookie
  const accessToken = useCookie('access-token')
  const client = useCookie('client')
  const uid = useCookie('uid')

  /**
   * 現在のトークン情報を取得
   * @returns 現在のトークン情報
   */
  const getTokens = (): AuthTokens => ({
    accessToken: accessToken.value || null,
    client: client.value || null,
    uid: uid.value || null,
  })

  /**
   * トークンが有効かどうかを判定
   * @returns すべてのトークンが存在する場合true
   */
  const hasValidTokens = (): boolean => {
    return !!(accessToken.value && client.value && uid.value)
  }

  /**
   * レスポンスヘッダーから認証トークンを取得してCookieに保存
   * @param headers - レスポンスヘッダー
   */
  const saveTokensFromHeaders = (headers: Headers): void => {
    const newAccessToken = headers.get('access-token')
    const newClient = headers.get('client')
    const newUid = headers.get('uid')

    // DeviseTokenAuthは成功時に新しいaccess-tokenを返すため、存在する場合のみ更新
    if (newAccessToken) accessToken.value = newAccessToken
    if (newClient) client.value = newClient
    if (newUid) uid.value = newUid
  }

  /**
   * API呼び出し用の認証ヘッダーを取得
   * @returns 認証ヘッダー（トークンが存在する場合のみ含む）
   */
  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {}

    if (accessToken.value) headers['access-token'] = accessToken.value
    if (client.value) headers['client'] = client.value
    if (uid.value) headers['uid'] = uid.value

    return headers
  }

  /**
   * 認証トークンを全てクリア
   */
  const clearTokens = (): void => {
    accessToken.value = null
    client.value = null
    uid.value = null
  }

  /**
   * トークンを直接設定（テスト用やデバッグ用）
   * @param tokens - 設定するトークン情報
   */
  const setTokens = (tokens: AuthTokens): void => {
    accessToken.value = tokens.accessToken
    client.value = tokens.client
    uid.value = tokens.uid
  }

  return {
    // 状態（読み取り専用として公開）
    accessToken: readonly(accessToken),
    client: readonly(client),
    uid: readonly(uid),

    // 操作メソッド
    getTokens,
    hasValidTokens,
    saveTokensFromHeaders,
    getAuthHeaders,
    clearTokens,
    setTokens,
  }
}
