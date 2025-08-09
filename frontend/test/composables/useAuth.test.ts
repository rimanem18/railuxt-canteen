import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import type { User } from '~/types/schemas'

/**
 * モックエラー型定義
 */
interface MockError {
  data?: {
    errors?: string[]
  }
  message?: string
}

/**
 * fetchのオプション型定義
 */
interface FetchOptions {
  method?: string
  baseURL?: string
  headers?: Record<string, string>
  body?: Record<string, unknown>
  onResponse?: (context: { response: { headers: Headers } }) => void
  onResponseError?: (context: {
    response: { status: number, statusText: string, _data: unknown }
  }) => void
}

describe('useAuth', () => {
  let mockUser: Ref<User | null>
  let mockAccessToken: Ref<string | null>
  let mockClient: Ref<string | null>
  let mockUid: Ref<string | null>

  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks()

    // リアクティブな値をモック
    mockUser = { value: null } as Ref<User | null>
    mockAccessToken = { value: null } as Ref<string | null>
    mockClient = { value: null } as Ref<string | null>
    mockUid = { value: null } as Ref<string | null>

    // globalに設定されたモック関数を使用
    vi.mocked((globalThis as any).useState).mockReturnValue(mockUser)
    vi.mocked((globalThis as any).useCookie).mockImplementation(
      (key: string) => {
        switch (key) {
          case 'access-token':
            return mockAccessToken
          case 'client':
            return mockClient
          case 'uid':
            return mockUid
          default:
            return { value: null } as Ref<string | null>
        }
      },
    )
    vi.mocked((globalThis as any).useRuntimeConfig).mockReturnValue({
      public: { apiBase: 'http://localhost:3000' },
      app: { baseURL: '/', buildAssetsDir: '/_nuxt/', cdnURL: '' },
      icon: {},
    })
  })

  describe('login', () => {
    it('ログイン成功時にユーザー情報を更新し、trueを返す', async () => {
      const mockUserData: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        provider: 'email',
        uid: 'test@example.com',
        allow_password_change: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const mockHeaders = new Headers()
      mockHeaders.set('access-token', 'test-token')
      mockHeaders.set('client', 'test-client')
      mockHeaders.set('uid', 'test-uid')

      vi.mocked((globalThis as any).$fetch).mockImplementation(
        (url: any, options?: any) => {
          // onResponseコールバックを実行
          if (options?.onResponse) {
            options.onResponse({ response: { headers: mockHeaders } })
          }
          return Promise.resolve({ data: mockUserData })
        },
      )

      const { login, user } = useAuth()
      const result = await login('test@example.com', 'password123')

      // APIが正しく呼び出されたかチェック
      expect(globalThis.$fetch).toHaveBeenCalledWith('/api/v1/auth/sign_in', {
        method: 'POST',
        baseURL: 'http://localhost:3000',
        headers: { 'Content-Type': 'application/json' },
        body: { email: 'test@example.com', password: 'password123' },
        onResponse: expect.any(Function),
        onResponseError: expect.any(Function),
      })

      // ユーザー情報が正しく設定されたかチェック
      expect(user.value).toEqual(mockUserData)
      // 認証トークンが保存されたかチェック
      expect(mockAccessToken.value).toBe('test-token')
      expect(mockClient.value).toBe('test-client')
      expect(mockUid.value).toBe('test-uid')
      // 戻り値がtrueであることをチェック
      expect(result).toBe(true)
    })

    it('ログイン失敗時にエラーメッセージを設定し、falseを返す', async () => {
      const mockError: MockError = {
        data: { errors: ['Invalid credentials'] },
        message: 'Login failed',
      }

      vi.mocked((globalThis as any).$fetch).mockRejectedValue(mockError)

      const { login, errorMsg } = useAuth()
      const result = await login('test@example.com', 'wrong-password')

      // エラーメッセージが正しく設定されたかチェック
      expect(errorMsg.value).toBe('Invalid credentials')
      // 戻り値がfalseであることをチェック
      expect(result).toBe(false)
      // 認証情報がクリアされたかチェック
      expect(mockAccessToken.value).toBe(null)
      expect(mockClient.value).toBe(null)
      expect(mockUid.value).toBe(null)
      expect(mockUser.value).toBe(null)
    })
  })

  describe('logout', () => {
    it('ログアウトAPIを呼び出し、認証情報をクリアする', async () => {
      // 初期状態としてログイン済みにしておく
      mockUser.value = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        provider: 'email',
        uid: 'test@example.com',
        allow_password_change: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockAccessToken.value = 'test-token'
      mockClient.value = 'test-client'
      mockUid.value = 'test-uid'

      vi.mocked((globalThis as any).$fetch).mockResolvedValue({})

      const { logout } = useAuth()
      await logout()

      // APIが正しく呼び出されたかチェック
      expect(globalThis.$fetch).toHaveBeenCalledWith('/api/v1/auth/sign_out', {
        method: 'DELETE',
        baseURL: 'http://localhost:3000',
        headers: {
          'access-token': 'test-token',
          'client': 'test-client',
          'uid': 'test-uid',
        },
      })

      // 認証情報がクリアされたかチェック
      expect(mockAccessToken.value).toBe(null)
      expect(mockClient.value).toBe(null)
      expect(mockUid.value).toBe(null)
      expect(mockUser.value).toBe(null)
    })

    it('ログアウトAPIが失敗しても認証情報をクリアする', async () => {
      // 初期状態としてログイン済みにしておく
      mockUser.value = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        provider: 'email',
        uid: 'test@example.com',
        allow_password_change: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockAccessToken.value = 'test-token'
      mockClient.value = 'test-client'
      mockUid.value = 'test-uid'

      vi.mocked((globalThis as any).$fetch).mockRejectedValue(
        new Error('Network error'),
      )

      const { logout } = useAuth()

      // エラーをキャッチして、認証情報がクリアされることを確認
      try {
        await logout()
      }
      catch (error) {
        // エラーが発生してもfinallyブロックでクリアされるはず
      }

      // 認証情報がクリアされたかチェック（APIエラーでも）
      expect(mockAccessToken.value).toBe(null)
      expect(mockClient.value).toBe(null)
      expect(mockUid.value).toBe(null)
      expect(mockUser.value).toBe(null)
    })
  })

  describe('fetchUser', () => {
    it('有効なトークンがある場合、ユーザー情報を取得する', async () => {
      // 事前にトークンを設定
      mockAccessToken.value = 'test-token'
      mockClient.value = 'test-client'
      mockUid.value = 'test-uid'

      const mockUserData: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        provider: 'email',
        uid: 'test@example.com',
        allow_password_change: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const mockHeaders = new Headers()
      mockHeaders.set('access-token', 'new-token')
      mockHeaders.set('client', 'new-client')
      mockHeaders.set('uid', 'new-uid')

      vi.mocked((globalThis as any).$fetch).mockImplementation(
        (url: any, options?: any) => {
          // onResponseコールバックを実行
          if (options?.onResponse) {
            options.onResponse({ response: { headers: mockHeaders } })
          }
          return Promise.resolve({ data: mockUserData })
        },
      )

      const { fetchUser, user } = useAuth()
      await fetchUser()

      // APIが正しく呼び出されたかチェック
      expect(globalThis.$fetch).toHaveBeenCalledWith(
        '/api/v1/auth/validate_token',
        {
          method: 'GET',
          baseURL: 'http://localhost:3000',
          headers: {
            'Content-Type': 'application/json',
            'access-token': 'test-token',
            'client': 'test-client',
            'uid': 'test-uid',
          },
          onResponse: expect.any(Function),
        },
      )

      // ユーザー情報が正しく設定されたかチェック
      expect(user.value).toEqual(mockUserData)
      // トークンが更新されたかチェック
      expect(mockAccessToken.value).toBe('new-token')
      expect(mockClient.value).toBe('new-client')
      expect(mockUid.value).toBe('new-uid')
    })

    it('トークンが不完全な場合は処理をスキップする', async () => {
      // 不完全なトークン（accessTokenのみ）
      mockAccessToken.value = 'test-token'
      mockClient.value = null
      mockUid.value = null

      const { fetchUser } = useAuth()
      await fetchUser()

      // APIが呼び出されないことをチェック
      expect(globalThis.$fetch).not.toHaveBeenCalled()
    })

    it('APIエラー時は認証情報をクリアする', async () => {
      // 事前にトークンを設定
      mockAccessToken.value = 'test-token'
      mockClient.value = 'test-client'
      mockUid.value = 'test-uid'
      mockUser.value = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        provider: 'email',
        uid: 'test@example.com',
        allow_password_change: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      vi.mocked((globalThis as any).$fetch).mockRejectedValue(
        new Error('Unauthorized'),
      )

      const { fetchUser } = useAuth()
      await fetchUser()

      // 認証情報がクリアされたかチェック
      expect(mockAccessToken.value).toBe(null)
      expect(mockClient.value).toBe(null)
      expect(mockUid.value).toBe(null)
      expect(mockUser.value).toBe(null)
    })
  })

  describe('isLoggedIn', () => {
    it('ユーザーが存在する場合はtrueを返す', () => {
      mockUser.value = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        provider: 'email',
        uid: 'test@example.com',
        allow_password_change: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { isLoggedIn } = useAuth()

      expect(isLoggedIn.value).toBe(true)
    })

    it('ユーザーが存在しない場合はfalseを返す', () => {
      mockUser.value = null

      const { isLoggedIn } = useAuth()

      expect(isLoggedIn.value).toBe(false)
    })
  })

  describe('debugLogin', () => {
    it('デバッグログイン成功時にユーザー情報を更新し、trueを返す', async () => {
      const mockUserData: User = {
        id: 1,
        name: 'Debug User',
        email: 'debug@example.com',
        image: null,
        provider: 'email',
        uid: 'debug@example.com',
        allow_password_change: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const mockHeaders = new Headers()
      mockHeaders.set('access-token', 'debug-token')
      mockHeaders.set('client', 'debug-client')
      mockHeaders.set('uid', 'debug-uid')

      // console.logをスパイ
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      vi.mocked((globalThis as any).$fetch).mockImplementation(
        (url: any, options?: any) => {
          // onResponseコールバックを実行
          if (options?.onResponse) {
            options.onResponse({ response: { headers: mockHeaders } })
          }
          return Promise.resolve({ data: mockUserData })
        },
      )

      const { debugLogin, user } = useAuth()
      const result = await debugLogin('debug@example.com', 'password123')

      // APIが正しく呼び出されたかチェック（既存のログイン機能と同じ）
      expect(globalThis.$fetch).toHaveBeenCalledWith('/api/v1/auth/sign_in', {
        method: 'POST',
        baseURL: 'http://localhost:3000',
        headers: { 'Content-Type': 'application/json' },
        body: { email: 'debug@example.com', password: 'password123' },
        onResponse: expect.any(Function),
        onResponseError: expect.any(Function),
      })

      // デバッグログが出力されたかチェック
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[DEBUG LOGIN] Attempting login with:',
        { email: 'debug@example.com', password: '***' },
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[DEBUG LOGIN] Login successful for user:',
        mockUserData,
      )

      // ユーザー情報が正しく設定されたかチェック
      expect(user.value).toEqual(mockUserData)
      // 認証トークンが保存されたかチェック
      expect(mockAccessToken.value).toBe('debug-token')
      expect(mockClient.value).toBe('debug-client')
      expect(mockUid.value).toBe('debug-uid')
      // 戻り値がtrueであることをチェック
      expect(result).toBe(true)

      consoleLogSpy.mockRestore()
    })

    it('デバッグログイン失敗時にエラーログを出力し、falseを返す', async () => {
      const mockError: MockError = {
        data: { errors: ['Invalid debug credentials'] },
        message: 'Debug login failed',
      }

      // console.logとconsole.errorをスパイ
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      vi.mocked((globalThis as any).$fetch).mockRejectedValue(mockError)

      const { debugLogin, errorMsg } = useAuth()
      const result = await debugLogin('debug@example.com', 'wrong-password')

      // デバッグログが出力されたかチェック
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[DEBUG LOGIN] Attempting login with:',
        { email: 'debug@example.com', password: '***' },
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[DEBUG LOGIN] Login failed with error:',
        mockError,
      )

      // エラーメッセージが正しく設定されたかチェック
      expect(errorMsg.value).toBe('Invalid debug credentials')
      // 戻り値がfalseであることをチェック
      expect(result).toBe(false)
      // 認証情報がクリアされたかチェック
      expect(mockAccessToken.value).toBe(null)
      expect(mockClient.value).toBe(null)
      expect(mockUid.value).toBe(null)
      expect(mockUser.value).toBe(null)

      consoleLogSpy.mockRestore()
      consoleErrorSpy.mockRestore()
    })

    it('デバッグモード専用のログ出力を行う', async () => {
      const mockUserData: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        provider: 'email',
        uid: 'test@example.com',
        allow_password_change: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const mockHeaders = new Headers()
      mockHeaders.set('access-token', 'test-token')
      mockHeaders.set('client', 'test-client')
      mockHeaders.set('uid', 'test-uid')

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      vi.mocked((globalThis as any).$fetch).mockImplementation(
        (url: any, options?: any) => {
          if (options?.onResponse) {
            options.onResponse({ response: { headers: mockHeaders } })
          }
          return Promise.resolve({ data: mockUserData })
        },
      )

      const { debugLogin } = useAuth()
      await debugLogin('test@example.com', 'password123')

      // デバッグ専用のログ出力パターンを確認
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[DEBUG LOGIN] Attempting login with:',
        { email: 'test@example.com', password: '***' },
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[DEBUG LOGIN] API Response headers:',
        expect.any(Headers),
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[DEBUG LOGIN] Login successful for user:',
        mockUserData,
      )

      consoleLogSpy.mockRestore()
    })
  })

  describe('clearAuth', () => {
    it('全ての認証情報をクリアする', () => {
      // 初期状態として認証情報を設定
      mockUser.value = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        provider: 'email',
        uid: 'test@example.com',
        allow_password_change: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockAccessToken.value = 'test-token'
      mockClient.value = 'test-client'
      mockUid.value = 'test-uid'

      const { clearAuth } = useAuth()
      clearAuth()

      // 全ての認証情報がクリアされたかチェック
      expect(mockAccessToken.value).toBe(null)
      expect(mockClient.value).toBe(null)
      expect(mockUid.value).toBe(null)
      expect(mockUser.value).toBe(null)
    })
  })
})
