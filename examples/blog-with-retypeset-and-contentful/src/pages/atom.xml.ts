import { generateRSS } from '@/utils/rss'

export async function GET() {
  return generateRSS()
}
