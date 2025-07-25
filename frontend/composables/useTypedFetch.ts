/**
 * 型付きFetchコンポーザブル
 * Zodスキーマによる実行時バリデーションと型安全性を提供
 */

import type { ZodSchema, ZodType } from 'zod'
import type { UseFetchOptions } from '#app'
import type { FetchOptions } from '~/types/api'

/**
 * 型付きAPI呼び出しを行うコンポーザブル関数
 * @param {string} url - APIのURL
 * @param {ZodSchema<T>} schema - レスポンスの検証用Zodスキーマ
 * @param {FetchOptions} options - useFetchのオプション
 * @returns {Promise<{ data: T, error: null } | { data: null, error: Error }>} 型安全なAPIレスポンス
 */
export async function useTypedFetch<T>(
  url: string,
  schema: ZodSchema<T, ZodType, any>,
  options: FetchOptions = {},
): Promise<{ data: T, error: null } | { data: null, error: Error }> {
  try {
    // 基本的なfetch設定
    const base = useRuntimeConfig().public.apiBase
    const fullUrl = `${base}${url}`

    // DeviseTokenAuthで必要な認証ヘッダーを取得
    const accessToken = useCookie('access-token')
    const client = useCookie('client')
    const uid = useCookie('uid')

    const authHeaders: Record<string, string> = {}
    if (accessToken.value) authHeaders['access-token'] = accessToken.value
    if (client.value) authHeaders['client'] = client.value
    if (uid.value) authHeaders['uid'] = uid.value

    // API呼び出し
    const response = await $fetch(fullUrl, {
      method: options.method || 'get',
      body: options.body,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options.headers || {}),
      },
      query: options.query,
      timeout: options.timeout,
      retry: options.retry,
      onResponse({ response }) {
        // DeviseTokenAuthはリクエストごとにトークンを更新するため
        // レスポンスヘッダーから新しい認証トークンを取得・保存
        const access = response.headers.get('access-token')
        const clientValue = response.headers.get('client')
        const uidValue = response.headers.get('uid')

        if (access) accessToken.value = access
        if (clientValue) client.value = clientValue
        if (uidValue) uid.value = uidValue
      },
      onResponseError({ response }) {
        // 401 Unauthorizedの場合は認証が無効になったと判断
        if (response.status === 401) {
          accessToken.value = null
          client.value = null
          uid.value = null
          // ユーザー情報もクリア
          const user = useState('user', () => null as unknown)
          user.value = null
        }
      },
    })

    // Zodスキーマでバリデーション
    const validatedData = schema.parse(response)

    return { data: validatedData, error: null }
  }
  catch (error) {
    // バリデーションエラーまたはネットワークエラー
    const errorObj = error instanceof Error ? error : new Error(String(error))
    return { data: null, error: errorObj }
  }
}

/**
 * リアクティブな型付きFetchコンポーザブル
 * useFetchのリアクティブな機能を保持しながら型安全性を提供
 */
export function useReactiveTypedFetch<T>(
  url: string,
  schema: ZodSchema<T, ZodType, any>,
  options: FetchOptions = {},
) {
  // 基本的なfetch設定
  const base = useRuntimeConfig().public.apiBase
  const fullUrl = `${base}${url}`

  // DeviseTokenAuthで必要な認証ヘッダーを取得
  const accessToken = useCookie('access-token')
  const client = useCookie('client')
  const uid = useCookie('uid')

  const authHeaders: Record<string, string> = {}
  if (accessToken.value) authHeaders['access-token'] = accessToken.value
  if (client.value) authHeaders['client'] = client.value
  if (uid.value) authHeaders['uid'] = uid.value

  // useFetchでリアクティブな取得
  const {
    data: rawData,
    error: fetchError,
    refresh,
  } = useFetch(fullUrl, {
    method: options.method || 'GET',
    body: options.body,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {}),
    },
    query: options.query,
    timeout: options.timeout,
    retry: options.retry,
    onResponse({ response }) {
      // DeviseTokenAuthはリクエストごとにトークンを更新するため
      // レスポンスヘッダーから新しい認証トークンを取得・保存
      const access = response.headers.get('access-token')
      const clientValue = response.headers.get('client')
      const uidValue = response.headers.get('uid')

      if (access) accessToken.value = access
      if (clientValue) client.value = clientValue
      if (uidValue) uid.value = uidValue
    },
    onResponseError({ response }) {
      // 401 Unauthorizedの場合は認証が無効になったと判断
      if (response.status === 401) {
        accessToken.value = null
        client.value = null
        uid.value = null
        // ユーザー情報もクリア
        const user = useState('user', () => null as unknown)
        user.value = null
      }
    },
  })

  // バリデーション済みデータのリアクティブな算出プロパティ
  const data = computed(() => {
    if (!rawData.value) return null

    try {
      return schema.parse(rawData.value)
    }
    catch (error) {
      console.error('Schema validation error:', error)
      return null
    }
  })

  // エラーのリアクティブな算出プロパティ
  const error = computed(() => {
    if (fetchError.value) return fetchError.value

    if (rawData.value) {
      try {
        schema.parse(rawData.value)
        return null
      }
      catch (error) {
        return error instanceof Error ? error : new Error(String(error))
      }
    }

    return null
  })

  return { data, error, refresh }
}

/**
 * useAuthコンポーザブル用の型付きFetchヘルパー
 * 認証関連のAPIレスポンスを型安全に処理
 */
export function useAuthTypedFetch() {
  return {
    /**
     * 認証付きのPOSTリクエスト
     */
    async post<T>(
      url: string,
      schema: ZodSchema<T, ZodType, any>,
      body: any,
      options: FetchOptions = {},
    ) {
      return useTypedFetch(url, schema, {
        ...options,
        method: 'post',
        body,
      })
    },

    /**
     * 認証付きのGETリクエスト
     */
    async get<T>(
      url: string,
      schema: ZodSchema<T, ZodType, any>,
      options: FetchOptions = {},
    ) {
      return useTypedFetch(url, schema, {
        ...options,
        method: 'get',
      })
    },

    /**
     * 認証付きのPUTリクエスト
     */
    async put<T>(
      url: string,
      schema: ZodSchema<T, ZodType, any>,
      body: any,
      options: FetchOptions = {},
    ) {
      return useTypedFetch(url, schema, {
        ...options,
        method: 'put',
        body,
      })
    },

    /**
     * 認証付きのDELETEリクエスト
     */
    async delete<T>(
      url: string,
      schema: ZodSchema<T, ZodType, any>,
      options: FetchOptions = {},
    ) {
      return useTypedFetch(url, schema, {
        ...options,
        method: 'delete',
      })
    },
  }
}
