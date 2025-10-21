const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出时禁用 i18n 配置
  ...(process.env.NODE_ENV === 'production' ? {} : { i18n }),
  
  // 启用静态导出
  output: 'export',
  trailingSlash: true,
  
  images: {
    domains: ['your-bucket.s3.amazonaws.com'],
    unoptimized: true, // 静态导出时需要
  },
  
  // 静态导出时的路径配置
  ...(process.env.NODE_ENV === 'production' && {
    generateBuildId: () => 'build',
  }),
}

module.exports = nextConfig