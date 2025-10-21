// EdgeOne Node Functions - 健康检查和环境变量验证
export async function onRequestGet(request) {
  const envCheck = {
    AWS_REGION: !!process.env.AWS_REGION,
    AWS_BUCKET_NAME: !!process.env.AWS_BUCKET_NAME,
    AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
  }

  return new Response(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'EdgeOne Node Functions',
    envCheck
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}