// Next.js API - 健康检查和环境变量验证 (开发环境回退)
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  const envCheck = {
    AWS_REGION: !!process.env.AWS_REGION,
    AWS_BUCKET_NAME: !!process.env.AWS_BUCKET_NAME,
    AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
  }

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'Next.js API (Local Development)',
    envCheck
  })
}