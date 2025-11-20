<template>
  <div class="ssg-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="badge badge-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            Static Site Generation
          </div>
          <h1>SSG (Static Site Generation)</h1>
          <p class="page-description">
            Pre-generate all pages at build time for the fastest loading speed and optimal SEO performance.
            This page was generated at build time on {{ buildTime }}.
          </p>
        </div>
      </div>
    </section>

    <!-- How SSG Works -->
    <section class="how-it-works section">
      <div class="container">
        <h2>How SSG Works</h2>
        <div class="workflow-diagram">
          <div class="workflow-step">
            <div class="step-icon build">📦</div>
            <h3>Build Time Generation</h3>
            <p>During <code>npm run build</code> or <code>npm run generate</code>, Nuxt pre-renders all pages as static HTML files</p>
          </div>
          <div class="workflow-arrow">→</div>
          <div class="workflow-step">
            <div class="step-icon cdn">🌐</div>
            <h3>CDN Distribution</h3>
            <p>Static files can be deployed to any CDN or static hosting service like Netlify, Vercel, GitHub Pages</p>
          </div>
          <div class="workflow-arrow">→</div>
          <div class="workflow-step">
            <div class="step-icon fast">⚡</div>
            <h3>Lightning Fast Loading</h3>
            <p>Users get pre-generated HTML directly, no server rendering needed, extremely fast loading</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Performance Metrics -->
    <section class="performance-metrics section">
      <div class="container">
        <h2>Performance Metrics</h2>
        <div class="metrics-grid grid grid-cols-2">
          <div class="metrics-chart">
            <h3>Loading Time Comparison</h3>
            <div class="chart-bars">
              <div class="chart-bar">
                <div class="bar-label">SSG</div>
                <div class="bar-container">
                  <div class="bar ssg-bar" :style="{ width: '20%' }">50ms</div>
                </div>
              </div>
              <div class="chart-bar">
                <div class="bar-label">ISR</div>
                <div class="bar-container">
                  <div class="bar isr-bar" :style="{ width: '40%' }">120ms</div>
                </div>
              </div>
              <div class="chart-bar">
                <div class="bar-label">SSR</div>
                <div class="bar-container">
                  <div class="bar ssr-bar" :style="{ width: '80%' }">300ms</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="metrics-stats">
            <h3>SSG Advantages</h3>
            <div class="stats-list">
              <div class="stat-item">
                <div class="stat-icon">⚡</div>
                <div class="stat-content">
                  <strong>Lightning Fast</strong>
                  <p>First load time typically &lt; 100ms</p>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🔍</div>
                <div class="stat-content">
                  <strong>SEO Friendly</strong>
                  <p>Complete HTML content, easily indexed by search engines</p>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">💰</div>
                <div class="stat-content">
                  <strong>Cost Effective</strong>
                  <p>No server needed, can deploy to free CDN</p>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🛡️</div>
                <div class="stat-content">
                  <strong>Secure & Stable</strong>
                  <p>Static files, no server security risks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Use Cases -->
    <section class="use-cases section">
      <div class="container">
        <h2>Use Cases</h2>
        <div class="use-cases-grid grid grid-cols-3">
          <div class="use-case-card card">
            <div class="use-case-icon">📚</div>
            <h3>Documentation Sites</h3>
            <p>Technical docs, API documentation, user manuals with relatively fixed content</p>
            <div class="use-case-examples">
              <span class="example-tag">VuePress</span>
              <span class="example-tag">GitBook</span>
              <span class="example-tag">Docusaurus</span>
            </div>
          </div>
          
          <div class="use-case-card card">
            <div class="use-case-icon">🏢</div>
            <h3>Corporate Websites</h3>
            <p>Company introduction, product showcase, contact information and marketing sites</p>
            <div class="use-case-examples">
              <span class="example-tag">Landing Page</span>
              <span class="example-tag">Portfolio</span>
              <span class="example-tag">Brochure</span>
            </div>
          </div>
          
          <div class="use-case-card card">
            <div class="use-case-icon">✍️</div>
            <h3>Personal Blogs</h3>
            <p>Low-frequency publishing, infrequent content updates for personal websites</p>
            <div class="use-case-examples">
              <span class="example-tag">Jekyll</span>
              <span class="example-tag">Hexo</span>
              <span class="example-tag">Gatsby</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Configuration Example -->
    <section class="code-examples section">
      <div class="container">
        <h2>Configuration Example</h2>
        <div class="code-tabs">
          <div class="tab-buttons">
            <button 
              class="tab-button" 
              :class="{ active: activeTab === 'config' }"
              @click="activeTab = 'config'"
            >
              Nuxt Config
            </button>
            <button 
              class="tab-button" 
              :class="{ active: activeTab === 'page' }"
              @click="activeTab = 'page'"
            >
              Page Component
            </button>
            <button 
              class="tab-button" 
              :class="{ active: activeTab === 'build' }"
              @click="activeTab = 'build'"
            >
              Build Commands
            </button>
          </div>
          
          <div class="tab-content">
            <div v-if="activeTab === 'config'" class="tab-panel">
              <pre><code>// nuxt.config.ts
export default defineNuxtConfig({
  // Global SSG configuration
  nitro: {
    prerender: {
      routes: ['/ssg', '/about', '/contact']
    }
  },
  
  // Route-level configuration
  routeRules: {
    '/ssg': { prerender: true },
    '/blog/**': { prerender: true }
  }
})</code></pre>
            </div>
            
            <div v-if="activeTab === 'page'" class="tab-panel">
              <pre><code>// pages/ssg.vue
&lt;template&gt;
  &lt;div&gt;
    &lt;h1&gt;{{ title }}&lt;/h1&gt;
    &lt;p&gt;Build time: {{ buildTime }}&lt;/p&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
// Executed at build time, data will be staticized
const { data: content } = await $fetch('/api/static-content')

const title = content.title
const buildTime = new Date().toISOString()
&lt;/script&gt;</code></pre>
            </div>
            
            <div v-if="activeTab === 'build'" class="tab-panel">
              <pre><code># Generate static site
npm run generate

# Or build with prerendering
npm run build

# Preview generated static files
npm run preview</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Page Info -->
    <section class="page-info section">
      <div class="container">
        <div class="info-card card">
          <h3>📊 Page Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Rendering Mode:</strong>
              <span class="badge badge-success">SSG</span>
            </div>
            <div class="info-item">
              <strong>Build Time:</strong>
              <span>{{ buildTime }}</span>
            </div>
            <div class="info-item">
              <strong>Page Size:</strong>
              <span>~15KB (gzipped)</span>
            </div>
            <div class="info-item">
              <strong>First Load:</strong>
              <span>&lt; 100ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'SSG Example',
  meta: [
    { name: 'description', content: 'Nuxt.js Static Site Generation (SSG) example page demonstrating SSG principles, performance benefits and best practices' }
  ]
})

// Build time (generated at build time, staticized into the page)
const config = useRuntimeConfig()
const buildTime = new Date(config.public.buildTime as string).toLocaleString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'UTC'
})

// Tab state
const activeTab = ref('config')

// Page rendering mode is configured as prerender: true (SSG) in nuxt.config.ts
</script>

<style scoped>
/* Page Header */
.page-header {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1));
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  color: var(--color-text);
  padding: var(--spacing-2xl) 0;
  text-align: center;
}

.header-content .badge {
  background: rgba(255, 215, 0, 0.2);
  color: #B45309;
  border: 1px solid rgba(255, 215, 0, 0.3);
  margin-bottom: var(--spacing-md);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
  background: linear-gradient(135deg, #B45309, #D97706);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  color: var(--color-text-secondary);
}

/* Workflow Diagram */
.workflow-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  margin: var(--spacing-2xl) 0;
  flex-wrap: wrap;
}

.workflow-step {
  text-align: center;
  max-width: 200px;
}

.step-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.workflow-arrow {
  font-size: 2rem;
  color: var(--color-primary);
  font-weight: bold;
}

/* Performance Metrics */
.metrics-grid {
  gap: var(--spacing-2xl);
  align-items: start;
}

.chart-bars {
  margin-top: var(--spacing-lg);
}

.chart-bar {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
}

.bar-label {
  width: 60px;
  font-weight: 500;
  text-align: right;
}

.bar-container {
  flex: 1;
  background: var(--nuxt-gray-200);
  border-radius: var(--radius-sm);
  height: 32px;
  position: relative;
}

.bar {
  height: 100%;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 var(--spacing-sm);
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  transition: width 0.8s ease;
}

.ssg-bar {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.isr-bar {
  background: linear-gradient(135deg, #00BFFF, #1E90FF);
}

.ssr-bar {
  background: linear-gradient(135deg, var(--nuxt-green), var(--nuxt-green-light));
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.stat-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.stat-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-content strong {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
}

.stat-content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

/* Use Cases */
.use-cases-grid {
  gap: var(--spacing-xl);
}

.use-case-card {
  text-align: center;
}

.use-case-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.use-case-examples {
  margin-top: var(--spacing-md);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  justify-content: center;
}

.example-tag {
  background: var(--nuxt-green-100);
  color: var(--nuxt-green-dark);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

/* Code Examples */
.code-tabs {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.tab-buttons {
  display: flex;
  background: var(--nuxt-gray-100);
  border-bottom: 1px solid var(--color-border);
}

.tab-button {
  flex: 1;
  padding: var(--spacing-md);
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.tab-button.active {
  background: var(--color-background);
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}

.tab-button:hover:not(.active) {
  background: var(--nuxt-gray-200);
}

.tab-content {
  padding: var(--spacing-lg);
}

.tab-panel pre {
  margin: 0;
  background: var(--nuxt-gray-900);
  color: var(--nuxt-gray-100);
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Page Info */
.info-card {
  text-align: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-item strong {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.info-item span {
  font-size: 1.125rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .workflow-diagram {
    flex-direction: column;
  }
  
  .workflow-arrow {
    transform: rotate(90deg);
  }
  
  .tab-buttons {
    flex-direction: column;
  }
  
  .chart-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .bar-container {
    width: 100%;
  }
}
</style>