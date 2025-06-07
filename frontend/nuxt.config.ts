// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3001",
    },
  },

  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxt/image", "@nuxtjs/tailwindcss"],
  eslint: { config: { stylistic: true } },
});
