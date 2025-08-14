import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory, useRoute } from 'vue-router'
import { ref } from 'vue'

// モック関数の定義
const mockUseAuth = vi.fn(() => ({
  isLoggedIn: ref(false),
}))

const mockNavigateTo = vi.fn()

vi.mock('~/composables/useAuth', () => ({
  useAuth: mockUseAuth,
}))

vi.mock('nuxt/app', () => ({
  navigateTo: mockNavigateTo,
}))

describe('ゲストミドルウェア', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    // モックのリセット
    vi.clearAllMocks()

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/login', component: { template: 'Login' } },
        { path: '/', component: { template: 'Home' } },
        { path: '/orders', component: { template: 'Orders' } },
      ],
    })
  })

  afterEach(() => {
    // テスト後にルーターの状態をリセット
    router.push('/')
  })

  it('ログイン済みユーザーが /login にアクセスした場合、/ にリダイレクトする', async () => {
    // ログイン状態をtrueに設定
    mockUseAuth.mockReturnValue({
      isLoggedIn: ref(true),
    })

    // ナビゲーションをテスト
    await router.push('/login')

    // リダイレクトが正しく行われることを確認
    expect(router.currentRoute.value.path).toBe('/')
    expect(mockNavigateTo).toHaveBeenCalledWith('/')
  })

  it('未ログインユーザーが /login にアクセスした場合、ログインページを表示する', async () => {
    // ログイン状態をfalseに設定
    mockUseAuth.mockReturnValue({
      isLoggedIn: ref(false),
    })

    // ナビゲーションをテスト
    await router.push('/login')

    // ログインページが表示されることを確認
    expect(router.currentRoute.value.path).toBe('/login')
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('ログイン済みユーザーが / にいる場合、リダイレクトループを防ぐ', async () => {
    // ログイン状態をtrueに設定
    mockUseAuth.mockReturnValue({
      isLoggedIn: ref(true),
    })

    // ホームページにナビゲーション
    await router.push('/')

    // リダイレクトが発生しないことを確認
    expect(router.currentRoute.value.path).toBe('/')
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('クエリパラメータ付きの /login パスに対する適切な処理', async () => {
    // ログイン状態をtrueに設定
    mockUseAuth.mockReturnValue({
      isLoggedIn: ref(true),
    })

    // クエリパラメータ付きでナビゲーション
    await router.push('/login?redirect=orders')

    // リダイレクトが正しく行われることを確認
    expect(router.currentRoute.value.path).toBe('/')
    expect(mockNavigateTo).toHaveBeenCalledWith('/')
  })

  it('/login 以外のパスでは動作しない', async () => {
    // ログイン状態をtrueに設定
    mockUseAuth.mockReturnValue({
      isLoggedIn: ref(true),
    })

    // /orders パスにナビゲーション
    await router.push('/orders')

    // リダイレクトが発生しないことを確認
    expect(router.currentRoute.value.path).toBe('/orders')
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('useAuth が undefined を返した場合のエラーハンドリング', async () => {
    // useAuth が undefined を返すようにモック
    mockUseAuth.mockReturnValue(undefined)

    // ナビゲーションをテスト
    await router.push('/login')

    // エラーが発生しないことを確認
    expect(router.currentRoute.value.path).toBe('/login')
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('navigateTo が失敗した場合の処理', async () => {
    // ログイン状態をtrueに設定
    mockUseAuth.mockReturnValue({
      isLoggedIn: ref(true),
    })

    // navigateTo が例外をスローするようにモック
    mockNavigateTo.mockRejectedValue(new Error('Navigation failed'))

    // ナビゲーションをテスト
    await router.push('/login')

    // エラーが発生しても適切に処理されることを確認
    expect(router.currentRoute.value.path).toBe('/login')
  })
})
