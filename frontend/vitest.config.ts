import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    // vue-queryの非同期処理に対応するためのタイムアウト拡張
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.'),
    },
  },
  // 依存関係の最適化設定
  optimizeDeps: {
    include: ['@tanstack/vue-query'],
  },
})
