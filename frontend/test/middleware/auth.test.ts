import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { RouteLocationNormalized } from 'vue-router'
import authMiddleware from '~/middleware/auth'

/**
 * ログイン状態モック
 */
const mockIsLoggedIn = { value: false }

describe('auth middleware', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks()
    mockIsLoggedIn.value = false

    // useAuthのモック設定（globalのモックを使用）
    vi.mocked(global.useAuth).mockReturnValue({
      user: { value: null },
      isLoggedIn: mockIsLoggedIn,
      errorMsg: { value: null },
      login: vi.fn(),
      logout: vi.fn(),
      fetchUser: vi.fn(),
      saveHeaders: vi.fn(),
      clearAuth: vi.fn(),
    })
  })

  it('ユーザーが認証済みの場合、何もしない', () => {
    mockIsLoggedIn.value = true // 認証済みユーザーを設定

    const mockRoute: RouteLocationNormalized = {
      path: '/protected',
      name: 'protected',
      params: {},
      query: {},
      hash: '',
      fullPath: '/protected',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
    }

    const result = authMiddleware(mockRoute, mockRoute)

    // navigateToが呼ばれないことをチェック
    expect(global.navigateTo).not.toHaveBeenCalled()
    // 関数が何も返さないことをチェック
    expect(result).toBeUndefined()
  })

  it('ユーザーが未認証の場合、/loginにリダイレクトする', () => {
    mockIsLoggedIn.value = false // 未認証状態を設定

    const mockRoute: RouteLocationNormalized = {
      path: '/protected',
      name: 'protected',
      params: {},
      query: {},
      hash: '',
      fullPath: '/protected',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
    }

    authMiddleware(mockRoute, mockRoute)

    // navigateToが正しい引数で呼ばれたかチェック
    expect(global.navigateTo).toHaveBeenCalledWith('/login')
  })

  it('ログイン状態がfalseの場合、/loginにリダイレクトする', () => {
    mockIsLoggedIn.value = false

    const mockRoute: RouteLocationNormalized = {
      path: '/dashboard',
      name: 'dashboard',
      params: {},
      query: {},
      hash: '',
      fullPath: '/dashboard',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
    }

    authMiddleware(mockRoute, mockRoute)

    expect(global.navigateTo).toHaveBeenCalledWith('/login')
  })

  it('ログイン状態がtrueの場合、リダイレクトしない', () => {
    mockIsLoggedIn.value = true

    const mockRoute: RouteLocationNormalized = {
      path: '/profile',
      name: 'profile',
      params: {},
      query: {},
      hash: '',
      fullPath: '/profile',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
    }

    authMiddleware(mockRoute, mockRoute)

    expect(global.navigateTo).not.toHaveBeenCalled()
  })

  it('toとfromパラメータを受け取る', () => {
    const mockTo: RouteLocationNormalized = {
      path: '/protected',
      name: 'protected',
      params: {},
      query: {},
      hash: '',
      fullPath: '/protected',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
    }
    const mockFrom: RouteLocationNormalized = {
      path: '/public',
      name: 'public',
      params: {},
      query: {},
      hash: '',
      fullPath: '/public',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
    }

    mockIsLoggedIn.value = false

    authMiddleware(mockTo, mockFrom)

    // パラメータに関係なくログイン状態のみをチェックする
    expect(global.navigateTo).toHaveBeenCalledWith('/login')
  })
})
