// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    },
  },

  vite: {
    server: {
      proxy: {
        "/api": {
          target: process.env.NUXT_PUBLIC_API_BASE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  },
  // モジュール一覧
  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxt/image"],

  // ESLint の設定
  eslint: {
    config: {
      stylistic: true,
    },
  },
});
