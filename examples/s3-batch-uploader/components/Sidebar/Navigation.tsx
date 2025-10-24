import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Upload, Database, Settings, Folder, PaintBucket } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()

  const menuItems = [
    {
      id: 'upload',
      label: 'File Upload',
      icon: Upload,
      href: '/upload'
    },
    {
      id: 'bucket',
      label: 'Storage Bucket',
      icon: PaintBucket,
      href: '/history'
    },
  ]

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Logo area */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">S3 Uploader</h1>
            <p className="text-xs text-gray-500">File Upload System</p>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom information */}
      <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-600">Version 1.0</p>
          <p className="text-xs text-gray-500">© 2025 S3 Uploader</p>
        </div>
      </div>
    </div>
  )
}