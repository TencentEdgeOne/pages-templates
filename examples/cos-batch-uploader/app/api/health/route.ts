import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      AWS_BUCKET_REGION: !!process.env.AWS_BUCKET_REGION,
      AWS_BUCKET_NAME: !!process.env.AWS_BUCKET_NAME,
      AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: 'Next.js API (App Router)',
      envCheck
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}