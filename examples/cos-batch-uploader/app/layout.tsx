import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'COS Batch Uploader - File Upload Tool',
  description: 'Professional COS batch file upload tool with drag-and-drop interface, progress tracking, and storage management',
  keywords: 'COS, file upload, batch upload, Tencent, cloud storage, file management',
  authors: [{ name: 'COS Batch Uploader' }],
  openGraph: {
    title: 'COS Batch Uploader',
    description: 'Professional COS batch file upload tool with drag-and-drop interface',
    type: 'website',
  },
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