<template>
  <div class="isr-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="badge badge-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M22.99 14A9 9 0 0 1 18.36 18.36L23 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Incremental Static Regeneration
          </div>
          <h1>ISR (Incremental Static Regeneration)</h1>
          <p class="page-description">
            Combine static generation with dynamic updates, maintaining high performance while ensuring content freshness.
            This page data was last updated at {{ formatTime(contentData?.metadata?.lastUpdated) }}.
          </p>
        </div>
      </div>
    </section>

    <!-- Live Content Display -->
    <section class="live-content section">
      <div class="container">
        <div class="content-header">
          <h2>📊 Live Content Display</h2>
          <div class="refresh-info">
            <span class="badge badge-info">
              Data freshness: {{ contentData?.performance?.dataFreshness || 0 }} minutes ago
            </span>
            <span class="badge badge-success">
              Cache status: {{ contentData?.metadata?.cacheStatus || 'unknown' }}
            </span>
          </div>
        </div>

        <!-- Articles List -->
        <div class="content-section">
          <h3>📚 Latest Articles</h3>
          <div class="articles-list">
            <article 
              v-for="article in contentData?.articles" 
              :key="article.id"
              class="article-card"
            >
              <div class="article-header">
                <h4>{{ article.title }}</h4>
                <div class="article-meta">
                  <span class="author">{{ article.author.name }}</span>
                  <span class="read-time">{{ article.readTime }} min read</span>
                  <span class="views">{{ article.views }} views</span>
                </div>
              </div>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              <div class="article-tags">
                <span 
                  v-for="tag in article.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </article>
          </div>
        </div>

        <!-- Statistics -->
        <div class="statistics-section">
          <h3>📈 Website Statistics</h3>
          <div class="stats-grid grid grid-cols-4">
            <div class="stat-card">
              <div class="stat-value">{{ contentData?.statistics?.totalArticles || 0 }}</div>
              <div class="stat-label">Total Articles</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ contentData?.statistics?.totalProducts || 0 }}</div>
              <div class="stat-label">Products</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ formatNumber(contentData?.statistics?.monthlyVisitors) }}</div>
              <div class="stat-label">Monthly Visitors</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ contentData?.statistics?.satisfactionRate || '0%' }}</div>
              <div class="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How ISR Works -->
    <section class="how-it-works section">
      <div class="container">
        <h2>How ISR Works</h2>
        <div class="workflow-timeline">
          <div class="timeline-item">
            <div class="timeline-marker">1</div>
            <div class="timeline-content">
              <h3>Initial Build</h3>
              <p>Generate static pages at build time, just like SSG</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker">2</div>
            <div class="timeline-content">
              <h3>User Visit</h3>
              <p>Users get fast static page response</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker">3</div>
            <div class="timeline-content">
              <h3>Background Check</h3>
              <p>System checks if page needs regeneration (based on time or triggers)</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker">4</div>
            <div class="timeline-content">
              <h3>Incremental Update</h3>
              <p>If needed, regenerate page in background, next visit gets new content</p>
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
              <span class="badge badge-info">ISR</span>
            </div>
            <div class="info-item">
              <strong>Revalidation:</strong>
              <span>Every hour</span>
            </div>
            <div class="info-item">
              <strong>Data Source:</strong>
              <span>/api/isr-content</span>
            </div>
            <div class="info-item">
              <strong>Cache Status:</strong>
              <span class="badge" :class="getCacheStatusClass(contentData?.metadata?.cacheStatus)">
                {{ contentData?.metadata?.cacheStatus || 'unknown' }}
              </span>
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
  title: 'ISR Example',
  meta: [
    { name: 'description', content: 'Nuxt.js Incremental Static Regeneration (ISR) example page demonstrating ISR principles and real-time content updates' }
  ]
})

// Get ISR content data
const { data: contentData } = await useAsyncData('isr-content', () => $fetch('/api/isr-content'))
console.log('ISR Content Data:', contentData)

// Format time
const formatTime = (dateString: string) => {
  if (!dateString) return 'unknown'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC' 
  })
}

// Format number
const formatNumber = (num?: number) => {
  if (!num) return '0'
  return num.toLocaleString('en-US')
}

// Get cache status style class
const getCacheStatusClass = (status: string) => {
  switch (status) {
    case 'fresh': return 'badge-success'
    case 'stale': return 'badge-warning'
    case 'error': return 'badge-danger'
    default: return 'badge-info'
  }
}

// Page rendering mode is configured as isr: true in nuxt.config.ts
</script>

<style scoped>
/* Page Header */
.page-header {
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.12), rgba(30, 144, 255, 0.08));
  border-bottom: 1px solid rgba(0, 191, 255, 0.2);
  color: var(--color-text);
  padding: var(--spacing-2xl) 0;
  text-align: center;
}

.header-content .badge {
  background: rgba(0, 191, 255, 0.15);
  color: #0369A1;
  border: 1px solid rgba(0, 191, 255, 0.25);
  margin-bottom: var(--spacing-md);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
  background: linear-gradient(135deg, #0369A1, #0284C7);
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

/* Live Content */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.refresh-info {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.content-section h3 {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* Article Cards */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.article-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all 0.2s ease;
}

.article-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.article-header h4 {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
  font-size: 1.125rem;
}

.article-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.article-excerpt {
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.article-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tag {
  background: var(--nuxt-green-100);
  color: var(--nuxt-green-dark);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

/* Statistics */
.statistics-section {
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-2xl);
  border-top: 1px solid var(--color-border);
}

.stats-grid {
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px solid var(--color-border);
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-primary);
  display: block;
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

/* Timeline */
.workflow-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  max-width: 600px;
  margin: 0 auto;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
}

.timeline-marker {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #00BFFF, #1E90FF);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.timeline-content h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.timeline-content p {
  color: var(--color-text-secondary);
  margin: 0;
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
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .timeline-item {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>