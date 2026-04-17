'use client'

import React, { lazy, Suspense } from 'react'
import ProductDemoPage from '@/app/components/product-demo'

// Lazy-load the widget so only the product page is rendered on the first screen, reducing TTI
const DraggableWidget = lazy(
  () => import('@/app/components/draggable-widget'),
)

/**
 * DemoHomePage
 *
 * Home page "deployment effect demo" container:
 * - The main body is a product demo landing page (ProductDemoPage).
 * - A draggable AI customer service widget (DraggableWidget) overlays the bottom-right corner.
 * - Widget content is embedded via iframe from /embed, fully decoupled from business logic:
 *   anyone using this template only needs to replace embedUrl with their own bot address.
 */
const DemoHomePage: React.FC = () => {
  return (
    <>
      {/* Product demo landing page (main content) */}
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <ProductDemoPage />
      </div>

      {/* Bottom-right draggable customer service widget (iframe mode) */}
      <Suspense fallback={null}>
        <DraggableWidget embedUrl="/embed" />
      </Suspense>
    </>
  )
}

export default DemoHomePage
