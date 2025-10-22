'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage({ params }: { params: { locale: string } }) {
  const router = useRouter()

  useEffect(() => {
    // 自动重定向到上传页面
    router.replace(`/${params.locale}/upload`)
  }, [router, params.locale])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">正在跳转到上传页面...</p>
      </div>
    </div>
  )
}