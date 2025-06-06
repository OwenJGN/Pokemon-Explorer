import { Button } from '@/components/ui/button'

interface NavigationButtonsProps {
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
}

/**
 * Pagination navigation component for moving between pages of Pokemon data
 * Handles both forward and backward navigation with disabled states
 * Used on the main page for browsing through API results
 */
const NavigationButtons = ({ 
  onPrevious, 
  onNext, 
  hasPrevious, 
  hasNext 
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mb-8">
      
      {/* Previous button - disabled when on first page */}
      <Button 
        onClick={onPrevious} 
        disabled={!hasPrevious}
        variant="default"
        className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
      >
        ← Back
      </Button>
      
      {/* Next button - disabled when on last page */}
      <Button 
        onClick={onNext} 
        disabled={!hasNext}
        variant="default"
        className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
      >
        Next →
      </Button>
    </div>
  )
}

export default NavigationButtons