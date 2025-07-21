import { vi } from 'vitest'
import type { Ref } from 'vue'

// グローバル型定義を拡張
declare global {
  let useState: ReturnType<typeof vi.fn>
  let useCookie: ReturnType<typeof vi.fn>
  let useRuntimeConfig: ReturnType<typeof vi.fn>
  let $fetch: ReturnType<typeof vi.fn>
  let navigateTo: ReturnType<typeof vi.fn>
  let defineNuxtRouteMiddleware: ReturnType<typeof vi.fn>
  let useAuth: ReturnType<typeof vi.fn>
}

// Nuxtコンポーザブルのグローバルモック
global.useState = vi.fn(<T>(key: string, init?: () => T): Ref<T> => {
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

global.useCookie = vi.fn(<T>(key: string): Ref<T | null> => {
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

global.useRuntimeConfig = vi.fn(() => ({
  public: { apiBase: 'http://localhost:3000' },
  app: { baseURL: '/', buildAssetsDir: '/_nuxt/', cdnURL: '' },
  icon: {},
}))

global.$fetch = vi.fn()
global.navigateTo = vi.fn()
global.defineNuxtRouteMiddleware = vi.fn(
  <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
)
global.useAuth = vi.fn()

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
