'use client'

// Advanced loading spinner with variants

import React from 'react'
import { cn } from '@/lib/utils'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'pulse' | 'ring'
  className?: string
  message?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  message,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={cn('flex space-x-1', className)}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'bg-green-600 rounded-full animate-bounce',
                  size === 'sm' ? 'w-1 h-1' :
                  size === 'md' ? 'w-2 h-2' :
                  size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )

      case 'pulse':
        return (
          <div
            className={cn(
              'bg-green-600 rounded-full animate-pulse',
              sizeClasses[size],
              className
            )}
          />
        )

      case 'ring':
        return (
          <div
            className={cn(
              'border-2 border-gray-200 border-t-green-600 rounded-full animate-spin',
              sizeClasses[size],
              className
            )}
          />
        )

      default:
        return (
          <div
            className={cn(
              'border-2 border-green-100 border-t-green-600 rounded-full animate-spin',
              sizeClasses[size],
              className
            )}
          />
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {renderSpinner()}
      {message && (
        <p className="text-sm text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  )
}

// Full page loading component
export const PageLoader: React.FC<{ message?: string }> = ({
  message = "Loading..."
}) => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" message={message} />
  </div>
)

// Inline loading component
export const InlineLoader: React.FC<{ className?: string }> = ({
  className
}) => (
  <div className={cn("flex items-center justify-center py-8", className)}>
    <LoadingSpinner size="md" />
  </div>
)