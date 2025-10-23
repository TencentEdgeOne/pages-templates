import { ReactNode } from 'react'
import { Navigation } from '../Sidebar/Navigation'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 min-w-[1000px]">
      <div className="flex h-screen">
        {/* 侧边栏 */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200">
          <Navigation />
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 内容区域 */}
          <main className="flex-1 overflow-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}