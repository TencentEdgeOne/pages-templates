import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'COS Batch Uploader - File Upload Tool | EdgeOne Makers',
  description: 'Professional COS batch file upload tool with drag-and-drop interface, progress tracking, and storage management · Demo only · EdgeOne Makers',
  keywords: 'EdgeOne Makers, Demo only, COS, file upload, batch upload, Tencent, cloud storage, file management',
  authors: [{ name: 'COS Batch Uploader' }],
  openGraph: {
    title: 'COS Batch Uploader',
    description: 'Professional COS batch file upload tool with drag-and-drop interface',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
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