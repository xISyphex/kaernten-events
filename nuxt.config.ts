// https://nuxt.com/docs/api/configuration/nuxt-config
const env = (globalThis as any).process?.env || {}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  tailwindcss: {
    configPath: '~/tailwind.config.js',
    cssPath: '~/assets/css/main.css',
  },

  runtimeConfig: {
    dataCycleToken: env.DATA_CYCLE_TOKEN || '',
    dataCycleEndpointId: env.DATA_CYCLE_ENDPOINT_ID || '',
    dataCycleEndpointSlug: env.DATA_CYCLE_ENDPOINT_SLUG || '',
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ['@vuepic/vue-datepicker/dist/main.css']

})