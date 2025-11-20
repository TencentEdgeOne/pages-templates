// ISR Semi-Static Content API
// Provides relatively stable but periodically updated content data

export default defineEventHandler(async (event) => {
  // Simulate content fetching delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Get current time as the real data generation time
  const now = new Date()
  const lastUpdated = now // Use current time as real update time
  
  // Mock article/blog content
  const articles = [
    {
      id: 1,
      title: 'Nuxt.js Incremental Static Regeneration (ISR) Deep Dive',
      slug: 'nuxt-isr-deep-dive',
      excerpt: 'ISR combines the advantages of static generation and server-side rendering, making your website both fast and up-to-date.',
      content: `
        Incremental Static Regeneration (ISR) is a powerful rendering strategy
        that allows you to generate static pages at build time while updating them on-demand at runtime.
        
        ## How ISR Works
        
        1. **Initial Build**: Generate static pages at build time
        2. **Cache Strategy**: Set page revalidation time
        3. **On-Demand Updates**: Regenerate pages in the background when they expire
        4. **Seamless Experience**: Users always see fast static pages
        
        ## Use Cases
        
        - Blog posts and news content
        - Product catalogs and pricing information
        - User-generated content
        - SEO-required pages with changing content
      `,
      author: {
        name: 'Tech Team',
        avatar: '/avatars/tech-team.jpg'
      },
      publishedAt: new Date('2025-01-15'),
      updatedAt: lastUpdated,
      tags: ['Nuxt.js', 'ISR', 'Performance', 'Web Development'],
      readTime: 8,
      views: Math.floor(Math.random() * 5000) + 1000
    },
    {
      id: 2,
      title: 'Modern Web Application Rendering Strategy Guide',
      slug: 'web-rendering-strategies-guide',
      excerpt: 'In-depth comparison of SSG, ISR, and SSR rendering modes to help you choose the best strategy for your project.',
      content: `
        Choosing the right rendering strategy is crucial for web application performance and user experience.
        
        ## Rendering Mode Comparison
        
        ### SSG (Static Site Generation)
        - **Advantages**: Fastest loading speed, excellent SEO
        - **Disadvantages**: Content updates require rebuilding
        - **Use Cases**: Documentation, marketing pages, personal blogs
        
        ### ISR (Incremental Static Regeneration)  
        - **Advantages**: Balances speed and content freshness
        - **Disadvantages**: Relatively complex configuration
        - **Use Cases**: E-commerce sites, news sites, content platforms
        
        ### SSR (Server-Side Rendering)
        - **Advantages**: Real-time data, personalized content
        - **Disadvantages**: Higher server load
        - **Use Cases**: Social apps, dashboards, real-time applications
      `,
      author: {
        name: 'Architect',
        avatar: '/avatars/architect.jpg'
      },
      publishedAt: new Date('2025-01-10'),
      updatedAt: lastUpdated,
      tags: ['Web Development', 'Architecture', 'Performance'],
      readTime: 12,
      views: Math.floor(Math.random() * 8000) + 2000
    },
    {
      id: 3,
      title: 'Comprehensive Analysis of Nuxt 4.0 New Features',
      slug: 'nuxt-4-new-features',
      excerpt: 'Explore the exciting new features and improvements in Nuxt 4.0 that enhance development experience and application performance.',
      content: `
        Nuxt 4.0 brings many exciting new features and improvements.
        
        ## Key New Features
        
        1. **Improved Type Safety**: Better TypeScript support
        2. **Enhanced Developer Experience**: Faster hot reload and builds
        3. **New Rendering Options**: More flexible hybrid rendering configuration
        4. **Optimized Bundle Size**: Smaller bundles and better tree-shaking
        
        ## Migration Guide
        
        Upgrading from Nuxt 3 to Nuxt 4 is relatively simple, most APIs remain backward compatible.
      `,
      author: {
        name: 'Nuxt Team',
        avatar: '/avatars/nuxt-team.jpg'
      },
      publishedAt: new Date('2025-01-20'),
      updatedAt: lastUpdated,
      tags: ['Nuxt.js', 'New Features', 'Upgrade Guide'],
      readTime: 6,
      views: Math.floor(Math.random() * 3000) + 500
    }
  ]
  
  // Mock product data
  const products = [
    {
      id: 101,
      name: 'Complete Nuxt.js Course',
      category: 'Online Course',
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 156,
      image: '/products/nuxt-course.jpg',
      inStock: true,
      lastPriceUpdate: lastUpdated
    },
    {
      id: 102,
      name: 'Advanced Vue.js Guide',
      category: 'E-book',
      price: 89,
      originalPrice: 129,
      rating: 4.6,
      reviews: 89,
      image: '/products/vue-book.jpg',
      inStock: true,
      lastPriceUpdate: lastUpdated
    },
    {
      id: 103,
      name: 'Web Performance Optimization Toolkit',
      category: 'Development Tools',
      price: 199,
      originalPrice: 299,
      rating: 4.9,
      reviews: 234,
      image: '/products/perf-tools.jpg',
      inStock: false,
      lastPriceUpdate: lastUpdated
    }
  ]
  
  // Mock statistics data (relatively stable but periodically updated)
  const statistics = {
    totalArticles: articles.length + Math.floor(Math.random() * 50),
    totalProducts: products.length + Math.floor(Math.random() * 20),
    monthlyVisitors: Math.floor(Math.random() * 10000) + 50000,
    satisfactionRate: (Math.random() * 10 + 90).toFixed(1) + '%'
  }
  
  return {
    articles,
    products,
    statistics,
    metadata: {
      lastUpdated: lastUpdated.toISOString(),
      nextUpdate: new Date(now.getTime() + 5000).toISOString(), // 5 seconds later (matching SWR config)
      renderMode: 'ISR',
      cacheStatus: 'fresh',
      // revalidateAfter: 5 // Revalidate after 5 seconds (matching SWR config)
    },
    performance: {
      generatedAt: now.getTime(),
      dataFreshness: 0 // Always 0 since lastUpdated is now the current time
    }
  }
})
