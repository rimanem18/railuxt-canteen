import { vi } from 'vitest'

// グローバルなモックの設定
global.console = {
  ...console,
  // コンソールログを無効化（必要に応じて）
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
}

// Nuxt 3の関数をグローバルにモック
global.useState = vi.fn((key: string, init?: () => unknown) => {
  // useState のシンプルなモック実装
  let value = init ? init() : undefined
  return {
    get value() {
      return value
    },
    set value(v) {
      value = v
    },
  }
})

global.useCookie = vi.fn((key: string) => {
  // useCookie のシンプルなモック実装
  let value: unknown = null
  return {
    get value() {
      return value
    },
    set value(v) {
      value = v
    },
  }
})

global.useRuntimeConfig = vi.fn(() => ({
  public: { apiBase: 'http://localhost:3000' },
}))

global.$fetch = vi.fn()

global.navigateTo = vi.fn()

global.defineNuxtRouteMiddleware = vi.fn(
  (fn: (to: unknown, from: unknown) => void | Promise<void>) => fn,
)

global.useAuth = vi.fn(() => ({
  user: { value: null },
  isLoggedIn: { value: false },
  logout: vi.fn(),
  login: vi.fn(),
  fetchUser: vi.fn(),
  errorMsg: { value: null },
}))

// Nuxt 3 の useFetch と $fetch をモック化
vi.mock('#app', async (importOriginal) => {
  const mod = await importOriginal<Record<string, unknown>>()
  return {
    ...mod,
    useFetch: vi.fn(),
    // $fetch は useNuxtApp().$fetch で提供されることが多い
    useNuxtApp: () => ({
      $fetch: vi.fn(),
    }),
  }
})

// Nuxt 3 の composables をモック化
vi.mock('#imports', async (importOriginal) => {
  const mod = await importOriginal<Record<string, unknown>>()
  return {
    ...mod,
    navigateTo: vi.fn(),
    useState: vi.fn((key: string, init?: () => unknown) => {
      // useState のシンプルなモック実装
      let value = init ? init() : undefined
      return {
        get value() {
          return value
        },
        set value(v) {
          value = v
        },
      }
    }),
    useCookie: vi.fn((key: string) => {
      // useCookie のシンプルなモック実装
      let value: unknown = null
      return {
        get value() {
          return value
        },
        set value(v) {
          value = v
        },
      }
    }),
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    })),
    useRuntimeConfig: vi.fn(() => ({
      public: { apiBase: 'http://localhost:3000' },
    })),
    $fetch: vi.fn(),
    defineNuxtRouteMiddleware: vi.fn(
      (fn: (to: unknown, from: unknown) => void | Promise<void>) => fn,
    ),
  }
})
