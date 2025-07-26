import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    // feature-based構造対応: テストファイルのスキャン設定
    include: [
      'test/**/*.{test,spec}.{js,ts}', // 既存のtestディレクトリ（段階的移行用）
      'features/**/*.{test,spec}.{js,ts}', // featuresディレクトリ配下のテストファイル
      'shared/**/*.{test,spec}.{js,ts}', // sharedディレクトリ配下のテストファイル
    ],
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.'),
      // feature-based構造用のエイリアス追加
      '@features': resolve(__dirname, './features'),
      '@shared': resolve(__dirname, './shared'),
    },
  },
})
