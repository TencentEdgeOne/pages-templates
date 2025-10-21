import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 检测浏览器语言偏好
    const browserLang = navigator.language.toLowerCase()
    const isZh = browserLang.startsWith('zh')
    
    // 根据浏览器语言重定向到对应语言的上传页面
    if (isZh) {
      window.location.href = '/zh.html'
    } else {
      window.location.href = '/en.html'
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting... / 正在跳转...</p>
      </div>
    </div>
  )
}