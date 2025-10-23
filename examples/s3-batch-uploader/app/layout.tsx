import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'S3 批量上传工具',
  description: 'S3批量上传工具 - 极简扁平风格版本',
  icons: {
    icon: [
      { url: '/favicon.ico?v=3', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.svg?v=3', sizes: 'any', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico?v=3',
    apple: '/favicon.svg?v=3',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}