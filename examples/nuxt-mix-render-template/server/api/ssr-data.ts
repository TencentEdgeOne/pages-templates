// SSR Dynamic Data API
// Provides real-time data for server-side rendering demonstration

export default defineEventHandler(async (event) => {
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Get current timestamp
  const now = new Date()
  
  // Generate random data
  const randomStats = {
    activeUsers: Math.floor(Math.random() * 1000) + 500,
    totalViews: Math.floor(Math.random() * 10000) + 50000,
    serverLoad: Math.floor(Math.random() * 100),
    responseTime: Math.floor(Math.random() * 50) + 10
  }
  
  // Mock user data
  const users = [
    { id: 1, name: 'John Doe', status: 'online', lastActive: new Date(now.getTime() - Math.random() * 3600000) },
    { id: 2, name: 'Jane Smith', status: 'offline', lastActive: new Date(now.getTime() - Math.random() * 86400000) },
    { id: 3, name: 'Mike Johnson', status: 'online', lastActive: new Date(now.getTime() - Math.random() * 1800000) },
    { id: 4, name: 'Sarah Wilson', status: 'busy', lastActive: new Date(now.getTime() - Math.random() * 7200000) }
  ]
  
  // Mock system status
  const systemStatus = {
    database: Math.random() > 0.1 ? 'healthy' : 'warning',
    cache: Math.random() > 0.05 ? 'healthy' : 'error',
    api: 'healthy',
    cdn: Math.random() > 0.02 ? 'healthy' : 'warning'
  }
  
  // Return dynamic data
  return {
    timestamp: now.toISOString(),
    serverTime: now.toLocaleString('en-US', { 
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    stats: randomStats,
    users: users,
    systemStatus: systemStatus,
    renderMode: 'SSR',
    requestId: Math.random().toString(36).substring(2, 15),
    performance: {
      generatedAt: now.getTime(),
      processingTime: Math.floor(Math.random() * 50) + 5
    },
    metadata: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    }
  }
})
