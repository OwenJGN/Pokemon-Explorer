import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Reusable loading spinner component with configurable sizes
 * Provides visual feedback during API calls and data fetching 
 */
const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {

  // Size mappings for different use cases (cards, full page loading)
  const sizeClasses = {
    sm: 'w-4 h-4',     // NOT IN USE
    md: 'w-8 h-8',     // For card loading
    lg: 'w-12 h-12'    // For full page loading states
  }
  
  return (
    <div 
      className={cn(
        // Base spinner styling 
        `${sizeClasses[size]} animate-spin rounded-full border-1 border-gray-800 border-t-white`,
        className
      )}
    />
  )
}

export default LoadingSpinner