import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from './components/Sidebar/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'S3 批量上传器',
  description: '基于 AWS S3 的现代化批量文件上传系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <div className="w-64 flex-shrink-0">
            <Navigation />
          </div>
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="material-fade-in">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}