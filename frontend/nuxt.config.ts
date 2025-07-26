// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@nuxtjs/tailwindcss'],
  ssr: false,

  // 手動インポート方式: コンポーネント自動インポートのみ無効化
  components: false,
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
    },
  },
  compatibilityDate: '2025-05-15',
  eslint: { config: { stylistic: true } },

  // Tailwind CSS設定: feature-based構造に対応
  tailwindcss: {
    config: {
      content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './features/**/*.{js,vue,ts}', // feature-basedディレクトリ
        './shared/**/*.{js,vue,ts}', // sharedディレクトリ
        './app.vue',
      ],
    },
  },
})
