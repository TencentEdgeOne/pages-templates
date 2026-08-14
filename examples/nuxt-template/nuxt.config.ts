// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Nuxt Template | EdgeOne Makers",
      meta: [
        { name: "description", content: "Demo only · EdgeOne Makers" },
        { name: "keywords", content: "EdgeOne Makers, Demo only" },
      ],
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {}
})
