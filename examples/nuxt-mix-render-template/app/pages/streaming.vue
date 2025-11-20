<template>
  <div class="streaming-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="badge badge-warning">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Streaming Rendering
          </div>
          <h1>Streaming (Server-Side Streaming)</h1>
          <p class="page-description">
            Demonstrates progressive content delivery where data is streamed from server to client in chunks.
          </p>
        </div>
      </div>
    </section>

    <!-- Streaming Demo -->
    <section class="streaming-demo section">
      <div class="container">
        <div class="demo-card">
          <h2>📡 Data Streaming Progress</h2>
          
          <!-- Progress Bar -->
          <div class="progress-section">
            <div class="progress-info">
              <span>Streaming data from server...</span>
              <span>{{ progress }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
          </div>

          <!-- Streamed Data Display -->
          <div class="data-section">
            <h3>📊 Received Data</h3>
            <div class="data-container">
              <div class="data-item">
                <label>Server Time:</label>
                <span>{{ streamData?.serverTime || 'Loading...' }}</span>
              </div>
              <div class="data-item">
                <label>Request ID:</label>
                <span>{{ streamData?.metadata?.requestId || 'Loading...' }}</span>
              </div>
              <div class="data-item">
                <label>Environment:</label>
                <span>{{ streamData?.metadata?.environment || 'Loading...' }}</span>
              </div>
              <div class="data-item">
                <label>Response Time:</label>
                <span>{{ streamData?.performance?.responseTime || 0 }}ms</span>
              </div>
              <div class="data-item">
                <label>Throughput:</label>
                <span>{{ formatNumber(streamData?.performance?.throughput) }} req/s</span>
              </div>
              <div class="data-item">
                <label>Uptime:</label>
                <span>{{ streamData?.performance?.uptime || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <!-- Raw Data -->
          <div class="raw-data-section">
            <h3>🔍 Raw JSON Data</h3>
            <pre class="json-display">{{ JSON.stringify(streamData, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'Streaming Example',
  meta: [
    { name: 'description', content: 'Nuxt.js Streaming rendering example page demonstrating progressive content delivery' }
  ]
})

// Get streaming data
const { data: streamData } = await useAsyncData('streaming-data', () => $fetch('/api/streaming-data'), {
  server: true
})

// Simulate streaming progress
const progress = ref(0)

// Simulate progressive data loading
onMounted(() => {
  const interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.random() * 15 + 5 // Random increment between 5-20
      if (progress.value > 100) progress.value = 100
    } else {
      clearInterval(interval)
    }
  }, 200)
})

// Format number
const formatNumber = (num: number) => {
  if (!num) return '0'
  return num.toLocaleString('en-US')
}

// Page rendering mode is configured as ssr: true in nuxt.config.ts
</script>

<style scoped>
/* Page Header */
.page-header {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.08));
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  color: var(--color-text);
  padding: var(--spacing-2xl) 0;
  text-align: center;
}

.header-content .badge {
  background: rgba(245, 158, 11, 0.15);
  color: #92400E;
  border: 1px solid rgba(245, 158, 11, 0.25);
  margin-bottom: var(--spacing-md);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
  background: linear-gradient(135deg, #92400E, #D97706);
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

/* Streaming Demo */
.streaming-demo {
  padding: var(--spacing-2xl) 0;
}

.demo-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-md);
}

.demo-card h2 {
  margin-bottom: var(--spacing-xl);
  color: var(--color-text);
  text-align: center;
}

/* Progress Section */
.progress-section {
  margin-bottom: var(--spacing-2xl);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  font-weight: 500;
}

.progress-bar {
  height: 12px;
  background: var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #F59E0B, #D97706);
  border-radius: var(--radius-md);
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Data Section */
.data-section {
  margin-bottom: var(--spacing-2xl);
}

.data-section h3 {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
}

.data-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.data-item label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.data-item span {
  font-weight: 600;
  color: var(--color-text);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* Raw Data Section */
.raw-data-section h3 {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
}

.json-display {
  background: var(--nuxt-gray-900);
  color: var(--nuxt-gray-100);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .demo-card {
    padding: var(--spacing-lg);
  }
  
  .data-container {
    grid-template-columns: 1fr;
  }
  
  .progress-info {
    flex-direction: column;
    gap: var(--spacing-xs);
    text-align: center;
  }
}
</style>
