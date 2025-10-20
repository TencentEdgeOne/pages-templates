'use client'

import { ReactNode } from 'react'
import { Navigation } from '../Sidebar/Navigation'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* 侧边栏 */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200">
          <Navigation />
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 顶部边框 */}
          <div className="h-px bg-gray-200"></div>
          
          {/* 内容区域 */}
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}