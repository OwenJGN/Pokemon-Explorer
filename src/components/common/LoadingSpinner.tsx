import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  return (
    <div 
      className={cn(
        `${sizeClasses[size]} animate-spin rounded-full border-1 border-gray-800 border-t-white`,
        className
      )}
    />
  )
}

export default LoadingSpinner