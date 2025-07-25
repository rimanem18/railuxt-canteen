import { vi } from 'vitest'
import type { Ref } from 'vue'

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
globalThis.$fetch = vi.fn()
// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.navigateTo = vi.fn()
// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.defineNuxtRouteMiddleware = vi.fn(
  <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
)
// @ts-expect-error - テスト環境でのNuxtコンポーザブルモック設定
globalThis.useAuth = vi.fn()

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
