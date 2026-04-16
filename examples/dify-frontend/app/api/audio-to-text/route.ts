import { type NextRequest, NextResponse } from 'next/server'
import { API_KEY } from '@/config'
import { getInfo, getDifyBaseUrl } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  const { user } = getInfo(request)

  const formData = await request.formData()
  formData.append('user', user)

  const res = await fetch(`${getDifyBaseUrl()}/v1/audio-to-text`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: formData,
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
