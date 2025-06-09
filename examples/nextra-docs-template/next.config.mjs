import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
})

export default withNextra({
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
})

// export default withNextra