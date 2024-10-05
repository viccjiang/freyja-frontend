// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  },
  imports: {
    dirs: ['stores']
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'], // 啟用 Tailwind CSS 模組
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  routeRules: {
    '/': { prerender: true }
  }
})
