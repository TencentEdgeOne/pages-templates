<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            Nuxt.js Hybrid Rendering
          </div>
          <h1 class="hero-title">
            Modern Web Application
            <span class="gradient-text">Rendering Strategies</span>
          </h1>
          <p class="hero-description">
            Explore SSG, ISR, and SSR rendering modes with complete examples and best practices.
          </p>
          <div class="hero-actions">
            <NuxtLink to="/ssg" class="btn btn-primary">
              Start Exploring
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </NuxtLink>
            <a href="https://nuxt.com/docs" target="_blank" class="btn btn-secondary">
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Introduction -->
    <section class="features-section section">
      <div class="container">
        <div class="section-header">
          <h2>Rendering Mode Comparison</h2>
          <p>Learn the characteristics and use cases of each rendering mode</p>
        </div>
        
        <div class="features-grid grid grid-cols-3">
          <!-- SSG Features -->
          <div class="feature-card card">
            <div class="feature-icon ssg-color">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Static Site Generation (SSG)</h3>
            <p>Pre-generate all pages at build time for the fastest loading speed and optimal SEO performance.</p>
            <div class="feature-stats">
              <div class="stat">
                <span class="stat-value">&lt; 100ms</span>
                <span class="stat-label">First Load</span>
              </div>
              <div class="stat">
                <span class="stat-value">100%</span>
                <span class="stat-label">SEO Friendly</span>
              </div>
            </div>
            <NuxtLink to="/ssg" class="feature-link">
              View Example →
            </NuxtLink>
          </div>

          <!-- ISR Features -->
          <div class="feature-card card">
            <div class="feature-icon isr-color">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M22.99 14A9 9 0 0 1 18.36 18.36L23 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Incremental Static Regeneration (ISR)</h3>
            <p>Combine static generation with dynamic updates, maintaining high performance while ensuring content freshness.</p>
            <div class="feature-stats">
              <div class="stat">
                <span class="stat-value">On-Demand</span>
                <span class="stat-label">Content Updates</span>
              </div>
              <div class="stat">
                <span class="stat-value">Balanced</span>
                <span class="stat-label">Performance</span>
              </div>
            </div>
            <NuxtLink to="/isr" class="feature-link">
              View Example →
            </NuxtLink>
          </div>

          <!-- SSR Features -->
          <div class="feature-card card">
            <div class="feature-icon ssr-color">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Server-Side Rendering (SSR)</h3>
            <p>Render pages on the server in real-time, supporting personalized content and live data display.</p>
            <div class="feature-stats">
              <div class="stat">
                <span class="stat-value">Real-time</span>
                <span class="stat-label">Data Updates</span>
              </div>
              <div class="stat">
                <span class="stat-value">Personalized</span>
                <span class="stat-label">User Experience</span>
              </div>
            </div>
            <NuxtLink to="/ssr" class="feature-link">
              View Example →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Introduction -->
    <section class="tech-stack-section section">
      <div class="container">
        <div class="section-header">
          <h2>Tech Stack</h2>
          <p>Modern technology stack used in this project</p>
        </div>
        
        <div class="tech-grid grid grid-cols-2">
          <div class="tech-info">
            <h3>Core Technologies</h3>
            <ul class="tech-list">
              <li>
                <strong>Nuxt.js 4.1.3</strong> - Full-stack Vue framework
              </li>
              <li>
                <strong>Vue.js 3.5.22</strong> - Progressive JavaScript framework
              </li>
              <li>
                <strong>TypeScript</strong> - Type-safe JavaScript
              </li>
              <li>
                <strong>Vite</strong> - Fast build tool
              </li>
            </ul>
          </div>
          
          <div class="tech-features">
            <h3>Project Features</h3>
            <div class="feature-badges">
              <span class="badge badge-success">Hybrid Rendering</span>
              <span class="badge badge-info">TypeScript</span>
              <span class="badge badge-success">Responsive Design</span>
              <span class="badge badge-warning">Performance Optimized</span>
              <span class="badge badge-info">SEO Friendly</span>
              <span class="badge badge-success">Modern UI</span>
            </div>
            <div class="highlight-box">
              <h4>🎯 Learning Goals</h4>
              <p>
                Through this example project, you will gain deep understanding of different rendering modes,
                their performance characteristics and best practices, mastering core skills for modern web application development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Start -->
    <section class="quick-start-section section">
      <div class="container">
        <div class="section-header">
          <h2>Quick Start</h2>
          <p>Get started with your Nuxt hybrid rendering journey in a few simple steps</p>
        </div>
        
        <div class="steps-grid grid grid-cols-3">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3>Clone Project</h3>
            <pre><code>git clone &lt;repository-url&gt;
cd nuxt-hybrid-rendering</code></pre>
          </div>
          
          <div class="step-card">
            <div class="step-number">2</div>
            <h3>Install Dependencies</h3>
            <pre><code>npm install
# or
yarn install</code></pre>
          </div>
          
          <div class="step-card">
            <div class="step-number">3</div>
            <h3>Start Development</h3>
            <pre><code>npm run dev
# Visit http://localhost:3000</code></pre>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: 'Nuxt.js hybrid rendering example project homepage showcasing SSG, ISR, and SSR rendering modes' }
  ]
})

// Page rendering mode is configured as prerender: true (SSG) in nuxt.config.ts
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fffe 50%, #f0fdfb 100%);
  padding: var(--spacing-xl) 0;
  min-height: 50vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(0, 220, 130, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 220, 130, 0.02) 0%, transparent 50%);
  opacity: 0.8;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: rgba(0, 220, 130, 0.1);
  color: var(--nuxt-green-dark);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: var(--spacing-lg);
  border: 1px solid rgba(0, 220, 130, 0.2);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  line-height: 1.1;
  color: var(--color-text);
}

.hero-description {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: var(--spacing-xl);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* Features Grid */
.features-section {
  background: var(--color-background);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.section-header h2 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.section-header p {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
}

.features-grid {
  gap: var(--spacing-xl);
}

.feature-card {
  text-align: center;
  position: relative;
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
}

.ssg-color {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
}

.isr-color {
  background: linear-gradient(135deg, #00BFFF, #1E90FF);
  color: white;
}

.ssr-color {
  background: linear-gradient(135deg, var(--nuxt-green), var(--nuxt-green-light));
  color: white;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.feature-card p {
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.feature-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.feature-link {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.feature-link:hover {
  color: var(--color-primary-dark);
}

/* Tech Stack Section */
.tech-stack-section {
  background: var(--color-surface);
}

.tech-grid {
  gap: var(--spacing-2xl);
  align-items: start;
}

.tech-list {
  list-style: none;
  padding: 0;
}

.tech-list li {
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
}

.tech-list li:last-child {
  border-bottom: none;
}

.feature-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

/* Quick Start Section */
.quick-start-section {
  background: var(--color-background);
}

.steps-grid {
  gap: var(--spacing-xl);
}

.step-card {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.step-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--nuxt-green), var(--nuxt-green-light));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 auto var(--spacing-lg);
}

.step-card h3 {
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.step-card pre {
  text-align: left;
  margin: 0;
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1.125rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .hero-section {
    min-height: 45vh;
    padding: var(--spacing-lg) 0;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 280px;
  }
}
</style>