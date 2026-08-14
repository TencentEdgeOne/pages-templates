// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Nuxt Content Starter | EdgeOne Makers",
      meta: [
        { name: "description", content: "Demo only · EdgeOne Makers" },
        { name: "keywords", content: "EdgeOne Makers, Demo only" },
      ],
    },
  },
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/content'],
  devtools: { enabled: true },
  nitro: {}
})
