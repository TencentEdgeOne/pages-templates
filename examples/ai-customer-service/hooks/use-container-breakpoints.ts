'use client'
import { useCallback, useEffect, useState } from 'react'

export type ContainerSize = 'narrow' | 'medium' | 'wide'

/**
 * Uses a ResizeObserver to watch the target element's width and returns a
 * container size tier:
 * - narrow: < 480px   (suitable for embedded widgets)
 * - medium: 480–768px (tablet / narrow sidebar)
 * - wide:   > 768px   (full desktop page)
 *
 * Unlike useBreakpoints (which is based on window.innerWidth), this hook
 * produces correct results inside iframes and non-fullscreen containers.
 */
export function useContainerBreakpoints(containerRef: React.RefObject<HTMLElement | null>): ContainerSize {
  const [size, setSize] = useState<ContainerSize>('wide')

  const computeSize = useCallback((width: number): ContainerSize => {
    if (width < 480) return 'narrow'
    if (width <= 768) return 'medium'
    return 'wide'
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Initialize once
    setSize(computeSize(el.getBoundingClientRect().width))

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        const newSize = computeSize(width)
        setSize(prev => prev !== newSize ? newSize : prev)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [containerRef, computeSize])

  return size
}
