import { vi, beforeAll, afterAll, afterEach } from 'vitest'
import type { Ref } from 'vue'
import { startServer, stopServer, resetServerHandlers } from './mocks/server'

// Nuxtコンポーザブルのグローバルモック設定
// 型の競合を回避するため、直接プロパティを設定

// グローバルにNuxtコンポーザブルを設定（型検査を一時的に無効化）
// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.useState = vi.fn(<T>(key: string, init?: () => T): Ref<T> => {
  // useState のシンプルなモック実装
  let value = init ? init() : undefined
  return {
    get value() {
      return value
    },
    set value(v) {
      value = v
    },
  } as Ref<T>
})

// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.useCookie = vi.fn(<T>(key: string): Ref<T | null> => {
  // useCookie のシンプルなモック実装
  let value: T | null = null
  return {
    get value() {
      return value
    },
    set value(v) {
      value = v
    },
  } as Ref<T | null>
})

// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.useRuntimeConfig = vi.fn(() => ({
  public: { apiBase: 'http://localhost:3000' },
  app: { baseURL: '/', buildAssetsDir: '/_nuxt/', cdnURL: '' },
  icon: {},
}))

// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.useNuxtApp = vi.fn(() => ({
  $config: {
    public: {
      apiBase: 'http://localhost:3000',
      isDev: true, // テスト環境では開発環境として扱う
      testUsers: {
        user1: {
          name: 'ユーザー1',
          email: 'user1@example.com',
          password: 'railuxt01',
        },
        user2: {
          name: 'ユーザー2',
          email: 'user2@example.com',
          password: 'railuxt02',
        },
      },
    },
  },
  provide: vi.fn(),
  hook: vi.fn(),
  callHook: vi.fn(),
  addHooks: vi.fn(),
  hooks: {},
  payload: {},
  isHydrating: false,
  deferHydration: vi.fn(),
  ssrContext: undefined,
}))

// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.$fetch = vi.fn()
// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.navigateTo = vi.fn()
// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.defineNuxtRouteMiddleware = vi.fn(
  <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
)
// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.useAuth = vi.fn(() => ({
  accessToken: { value: 'mock-token' },
  client: { value: 'mock-client' },
  uid: { value: 'test@example.com' },
}))

// @ts-expect-error - Vue関数のグローバル設定
globalThis.ref = vi.fn(value => ({
  value,
}))

// @ts-expect-error - Vue関数のグローバル設定
globalThis.computed = vi.fn(fn => ({
  value: fn(),
}))

// @ts-expect-error - Vue関数のグローバル設定
globalThis.readonly = vi.fn(obj => obj)

// ルーターモック
// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.useRoute = vi.fn(() => ({
  query: {},
  params: {},
  path: '/orders',
}))

// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
}))

/**
 * MSWサーバーの設定
 * テスト開始前にサーバーを起動し、終了後に停止
 */
beforeAll(() => {
  startServer()
})

afterAll(() => {
  stopServer()
})

afterEach(() => {
  resetServerHandlers()
})

/**
 * コンソール出力をモック（テスト時のログ抑制）
 */
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
}
