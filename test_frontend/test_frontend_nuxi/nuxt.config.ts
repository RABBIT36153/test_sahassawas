// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    'bootstrap/dist/css/bootstrap.min.css'
  ],
  plugins: [
    '~/plugins/bootstrap.client.ts'
  ],
  runtimeConfig: {
    apiSecret: process.env.API_SECRET || '123',
    public: {
      API_BASE: process.env.API_BASE || 'http://localhost:4000'
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }

})
