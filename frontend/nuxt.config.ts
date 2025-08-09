// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  ssr: false,
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
      isDev: process.env.NODE_ENV === 'development',
      testUsers: {
        user1: {
          name: 'ユーザー1',
          email: 'user1@example.com',
          password: 'railuxt01', // seeds.rbのパスワードと一致させる（開発環境のみ）
        },
        user2: {
          name: 'ユーザー2',
          email: 'user2@example.com',
          password: 'railuxt02', // seeds.rbのパスワードと一致させる（開発環境のみ）
        },
      },
    },
  },
  compatibilityDate: '2025-05-15',
  eslint: { config: { stylistic: true } },
})
