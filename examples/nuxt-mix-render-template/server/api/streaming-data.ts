// Streaming Data API
// Simulates streaming data for real-time updates demonstration

export default defineEventHandler(async (event) => {
  // Set headers for streaming response
  setHeader(event, 'Content-Type', 'application/json')
  setHeader(event, 'Cache-Control', 'no-cache')
  
  // Simulate data processing delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const now = new Date()
  
  // Generate streaming data chunks
  const streamingData = {
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
    
    // Real-time metrics
    metrics: {
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 100),
      networkIO: Math.floor(Math.random() * 1000),
      diskIO: Math.floor(Math.random() * 500),
      activeConnections: Math.floor(Math.random() * 200) + 50,
      requestsPerSecond: Math.floor(Math.random() * 1000) + 100
    },
    
    // Live data streams
    streams: [
      {
        id: 'stream-1',
        name: 'User Activity Stream',
        status: 'active',
        dataPoints: Array.from({ length: 10 }, (_, i) => ({
          timestamp: new Date(now.getTime() - (9 - i) * 1000).toISOString(),
          value: Math.floor(Math.random() * 100) + 20
        }))
      },
      {
        id: 'stream-2',
        name: 'Performance Metrics',
        status: 'active',
        dataPoints: Array.from({ length: 10 }, (_, i) => ({
          timestamp: new Date(now.getTime() - (9 - i) * 1000).toISOString(),
          value: Math.floor(Math.random() * 50) + 10
        }))
      },
      {
        id: 'stream-3',
        name: 'Error Rate Monitor',
        status: 'warning',
        dataPoints: Array.from({ length: 10 }, (_, i) => ({
          timestamp: new Date(now.getTime() - (9 - i) * 1000).toISOString(),
          value: Math.floor(Math.random() * 10)
        }))
      }
    ],
    
    // Live events
    events: [
      {
        id: `event-${Date.now()}-1`,
        type: 'info',
        message: 'New user connected from US-East',
        timestamp: new Date(now.getTime() - Math.random() * 60000).toISOString()
      },
      {
        id: `event-${Date.now()}-2`,
        type: 'success',
        message: 'Database backup completed successfully',
        timestamp: new Date(now.getTime() - Math.random() * 120000).toISOString()
      },
      {
        id: `event-${Date.now()}-3`,
        type: 'warning',
        message: 'High memory usage detected on server-2',
        timestamp: new Date(now.getTime() - Math.random() * 180000).toISOString()
      },
      {
        id: `event-${Date.now()}-4`,
        type: 'error',
        message: 'Failed to connect to external API',
        timestamp: new Date(now.getTime() - Math.random() * 240000).toISOString()
      }
    ],
    
    // System status
    systemStatus: {
      overall: Math.random() > 0.1 ? 'healthy' : 'warning',
      services: {
        webServer: Math.random() > 0.05 ? 'healthy' : 'error',
        database: Math.random() > 0.1 ? 'healthy' : 'warning',
        cache: Math.random() > 0.02 ? 'healthy' : 'error',
        messageQueue: Math.random() > 0.08 ? 'healthy' : 'warning'
      }
    },
    
    // Performance data
    performance: {
      responseTime: Math.floor(Math.random() * 100) + 10,
      throughput: Math.floor(Math.random() * 5000) + 1000,
      errorRate: Math.random() * 5,
      uptime: '99.9%'
    },
    
    // Metadata
    metadata: {
      renderMode: 'Streaming',
      requestId: Math.random().toString(36).substring(2, 15),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
  }
  
  return streamingData
})
