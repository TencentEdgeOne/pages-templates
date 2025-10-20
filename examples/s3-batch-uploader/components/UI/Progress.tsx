import { clsx } from 'clsx'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'error'
}

export function Progress({ 
  value, 
  max = 100, 
  className, 
  showPercentage = false,
  size = 'md',
  variant = 'default'
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={clsx('w-full', className)}>
      <div
        className={clsx(
          'bg-gray-200 rounded-full overflow-hidden',
          {
            'h-1': size === 'sm',
            'h-2': size === 'md',
            'h-3': size === 'lg',
          }
        )}
      >
        <div
          className={clsx(
            'h-full transition-all duration-300 ease-out',
            {
              'bg-primary-600': variant === 'default',
              'bg-success-600': variant === 'success',
              'bg-error-600': variant === 'error',
            }
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-xs text-gray-600 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}