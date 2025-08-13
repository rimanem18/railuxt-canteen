import type { UseApiOptions } from '~/types/useApi'

/**
 * API呼び出しを行うコンポーザブル関数
 * @param path - APIのパス（例: "/api/v1/dishes"）
 * @param options - useFetchのオプション（method, body, headers等）
 * @returns APIレスポンス、エラー、リフレッシュ関数
 */
export const useApi = <T = unknown>(
  path: string,
  options: UseApiOptions = {},
) => {
  const base = useRuntimeConfig().public.apiBase
  const url = `${base}${path}`

  // useAuthTokensから認証関連の機能を取得
  const { accessToken, client, uid, saveTokensFromHeaders } = useAuthTokens()
  const auth = useAuth()

  // useFetchに適合する型に変換し、トークンローテーション対応を実装
  const { data, error, refresh, pending } = useFetch<T>(url, {
    method: options.method as any, // NuxtのuseFetchのmethod型は複雑なため型アサーション
    body: options.body as any, // bodyの型はAPIによって可変のため型アサーション
    query: options.query,
    headers: {
      // API専用フォーマットを明示してDeviseのセッション使用を防ぐ
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // DeviseTokenAuthで必要な認証ヘッダーを自動付与
      ...(accessToken.value && { 'access-token': accessToken.value }),
      ...(client.value && { client: client.value }),
      ...(uid.value && { uid: uid.value }),
      // ユーザー指定のヘッダーも含める（Accept/Content-Typeは上書き可能）
      ...(options.headers || {}),
    },
    onRequest({ options: requestOptions }) {
      // リクエスト直前に最新の認証トークンを確実に設定
      // これによりトークンが更新されていた場合も確実に反映される
      if (accessToken.value && client.value && uid.value) {
        requestOptions.headers = new Headers(requestOptions.headers)
        requestOptions.headers.set('access-token', accessToken.value)
        requestOptions.headers.set('client', client.value)
        requestOptions.headers.set('uid', uid.value)
      }
    },
    onResponse({ response }) {
      // DeviseTokenAuthのトークンローテーション対応
      // 成功時のレスポンスヘッダーから新しい認証トークンを取得・更新
      if (response.headers.has('access-token')) {
        saveTokensFromHeaders(response.headers)
      }
    },
    onResponseError({ response }) {
      // 401 Unauthorizedの場合は認証が無効になったと判断
      // 認証情報をクリアしてログイン画面への遷移を促す
      if (response.status === 401) {
        // useAuthのlogout関数を使用して認証情報をクリア
        auth.logout()
        // クライアントサイドでのみリダイレクト実行
        if (import.meta.client) {
          navigateTo('/login')
        }
      }
    },
  })

  if (error.value) {
    console.error('API error:', error.value)
  }

  return { data, error, refresh, pending }
}
