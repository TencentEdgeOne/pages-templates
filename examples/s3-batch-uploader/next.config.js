const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,

  images: {
    domains: ['your-bucket.s3.amazonaws.com'],
  },
}

module.exports = nextConfig