<template>
  <div class="ssr-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="badge badge-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            Server-Side Rendering
          </div>
          <h1>SSR (Server-Side Rendering)</h1>
          <p class="page-description">
            Render pages on the server in real-time, supporting personalized content and live data display.
            Each request generates fresh data and content dynamically.
          </p>
        </div>
      </div>
    </section>

    <!-- Real-time Data Dashboard -->
    <section class="dashboard section">
      <div class="container">
        <div class="dashboard-header">
          <h2>📊 Server-Side Rendered Dashboard</h2>
          <div class="server-info">
            <span class="badge badge-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
              Rendered on Server
            </span>
            <span class="server-time">Server-Side Rendered</span>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid grid grid-cols-4">
          <div class="stat-card">
            <div class="stat-icon active-users">👥</div>
            <div class="stat-content">
              <div class="stat-value">{{ ssrData?.stats?.activeUsers || 0 }}</div>
              <div class="stat-label">Active Users</div>
              <div class="stat-trend positive">+12%</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon total-views">👁️</div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(ssrData?.stats?.totalViews) }}</div>
              <div class="stat-label">Total Views</div>
              <div class="stat-trend positive">+8%</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon server-load">⚡</div>
            <div class="stat-content">
              <div class="stat-value">{{ ssrData?.stats?.serverLoad || 0 }}%</div>
              <div class="stat-label">Server Load</div>
              <div class="stat-trend" :class="getLoadTrendClass(ssrData?.stats?.serverLoad)">
                {{ getLoadTrend(ssrData?.stats?.serverLoad) }}
              </div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon response-time">🚀</div>
            <div class="stat-content">
              <div class="stat-value">{{ ssrData?.stats?.responseTime || 0 }}ms</div>
              <div class="stat-label">Response Time</div>
              <div class="stat-trend" :class="getResponseTrendClass(ssrData?.stats?.responseTime)">
                {{ getResponseTrend(ssrData?.stats?.responseTime) }}
              </div>
            </div>
          </div>
        </div>

        <!-- User Activity -->
        <div class="activity-section">
          <h3>👤 User Activity</h3>
          <div class="users-grid">
            <div 
              v-for="user in ssrData?.users" 
              :key="user.id"
              class="user-card"
            >
              <div class="user-avatar">
                <div class="avatar-circle" :class="getStatusClass(user.status)">
                  {{ user.name.charAt(0) }}
                </div>
                <div class="status-indicator" :class="user.status"></div>
              </div>
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-status">{{ getStatusText(user.status) }}</div>
                <div class="last-active">
                  Last active: {{ formatRelativeTime(user.lastActive) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="system-status">
          <h3>🔧 System Status</h3>
          <div class="status-grid grid grid-cols-2">
            <div 
              v-for="(status, service) in ssrData?.systemStatus" 
              :key="service"
              class="status-item"
            >
              <div class="service-info">
                <div class="service-name">{{ getServiceName(service) }}</div>
                <div class="service-status" :class="status">
                  <div class="status-dot" :class="status"></div>
                  {{ getStatusText(status) }}
                </div>
              </div>
              <div class="service-icon" :class="status">
                {{ getServiceIcon(service) }}
              </div>
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
              <span class="badge badge-success">SSR</span>
            </div>
            <div class="info-item">
              <strong>Request ID:</strong>
              <span>{{ ssrData?.requestId || 'unknown' }}</span>
            </div>
            <div class="info-item">
              <strong>Processing Time:</strong>
              <span>{{ ssrData?.performance?.processingTime || 0 }}ms</span>
            </div>
            <div class="info-item">
              <strong>Environment:</strong>
              <span>{{ ssrData?.metadata?.environment || 'unknown' }}</span>
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
  title: 'SSR Example',
  meta: [
    { name: 'description', content: 'Nuxt.js Server-Side Rendering (SSR) example page demonstrating real-time data and dynamic content' }
  ]
})

// Get SSR data - executed on server only, cached for client hydration
const { data: ssrData } = await useAsyncData('ssr-data', () => $fetch('/api/ssr-data'), {
  server: true
})

// Format number
const formatNumber = (num: number) => {
  if (!num) return '0'
  return num.toLocaleString('en-US')
}

// Format relative time using server time to avoid hydration mismatch
const formatRelativeTime = (dateString: string) => {
  if (!dateString) return 'unknown'
  
  // Use server time from ssrData to ensure consistency
  const serverTime = ssrData.value?.timestamp ? new Date(ssrData.value.timestamp) : new Date()
  const date = new Date(dateString)
  const diff = serverTime.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return `${days} days ago`
}

// Get status style class
const getStatusClass = (status: string) => {
  switch (status) {
    case 'online': return 'status-online'
    case 'offline': return 'status-offline'
    case 'busy': return 'status-busy'
    default: return 'status-unknown'
  }
}

// Get status text
const getStatusText = (status: string) => {
  switch (status) {
    case 'online': return 'Online'
    case 'offline': return 'Offline'
    case 'busy': return 'Busy'
    case 'healthy': return 'Healthy'
    case 'warning': return 'Warning'
    case 'error': return 'Error'
    default: return 'Unknown'
  }
}

// Get service name
const getServiceName = (service: string) => {
  switch (service) {
    case 'database': return 'Database'
    case 'cache': return 'Cache'
    case 'api': return 'API Service'
    case 'cdn': return 'CDN'
    default: return service
  }
}

// Get service icon
const getServiceIcon = (service: string) => {
  switch (service) {
    case 'database': return '🗄️'
    case 'cache': return '⚡'
    case 'api': return '🔌'
    case 'cdn': return '🌐'
    default: return '⚙️'
  }
}

// Get load trend
const getLoadTrend = (load: number) => {
  if (load < 30) return 'Low'
  if (load < 70) return 'Medium'
  return 'High'
}

const getLoadTrendClass = (load: number) => {
  if (load < 30) return 'positive'
  if (load < 70) return 'neutral'
  return 'negative'
}

// Get response time trend
const getResponseTrend = (time: number) => {
  if (time < 50) return 'Excellent'
  if (time < 100) return 'Good'
  return 'Needs Optimization'
}

const getResponseTrendClass = (time: number) => {
  if (time < 50) return 'positive'
  if (time < 100) return 'neutral'
  return 'negative'
}

// Page rendering mode is configured as ssr: true in nuxt.config.ts
</script>

<style scoped>
/* Page Header */
.page-header {
  background: linear-gradient(135deg, rgba(0, 220, 130, 0.12), rgba(52, 232, 158, 0.08));
  border-bottom: 1px solid rgba(0, 220, 130, 0.2);
  color: var(--color-text);
  padding: var(--spacing-2xl) 0;
  text-align: center;
}

.header-content .badge {
  background: rgba(0, 220, 130, 0.15);
  color: var(--nuxt-green-dark);
  border: 1px solid rgba(0, 220, 130, 0.25);
  margin-bottom: var(--spacing-md);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
  background: linear-gradient(135deg, var(--nuxt-green-dark), var(--nuxt-green));
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

/* Dashboard */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.server-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.server-time {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: var(--color-surface);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

/* Statistics Cards */
.stats-grid {
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.stat-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.active-users {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
}

.stat-icon.total-views {
  background: linear-gradient(135deg, #10B981, #059669);
}

.stat-icon.server-load {
  background: linear-gradient(135deg, #F59E0B, #D97706);
}

.stat-icon.response-time {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: var(--spacing-xs);
}

.stat-trend {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.stat-trend.positive {
  background: #DCFCE7;
  color: #059669;
}

.stat-trend.neutral {
  background: #FEF3C7;
  color: #D97706;
}

.stat-trend.negative {
  background: #FEE2E2;
  color: #DC2626;
}

/* User Activity */
.activity-section {
  margin-bottom: var(--spacing-2xl);
}

.activity-section h3 {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.user-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-avatar {
  position: relative;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1.25rem;
}

.avatar-circle.status-online {
  background: linear-gradient(135deg, #10B981, #059669);
}

.avatar-circle.status-offline {
  background: linear-gradient(135deg, #6B7280, #4B5563);
}

.avatar-circle.status-busy {
  background: linear-gradient(135deg, #F59E0B, #D97706);
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online {
  background: #10B981;
}

.status-indicator.offline {
  background: #6B7280;
}

.status-indicator.busy {
  background: #F59E0B;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.user-status {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.last-active {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

/* System Status */
.system-status h3 {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
}

.status-grid {
  gap: var(--spacing-lg);
}

.status-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-info {
  flex: 1;
}

.service-name {
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.service-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.healthy {
  background: #10B981;
}

.status-dot.warning {
  background: #F59E0B;
}

.status-dot.error {
  background: #EF4444;
}

.service-status.healthy {
  color: #059669;
}

.service-status.warning {
  color: #D97706;
}

.service-status.error {
  color: #DC2626;
}

.service-icon {
  font-size: 1.5rem;
  opacity: 0.7;
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
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .server-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .users-grid {
    grid-template-columns: 1fr;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
}
</style>