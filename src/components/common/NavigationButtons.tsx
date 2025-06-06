import { Button } from '@/components/ui/button'

interface NavigationButtonsProps {
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
}

const NavigationButtons = ({ 
  onPrevious, 
  onNext, 
  hasPrevious, 
  hasNext 
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mb-8">
      <Button 
        onClick={onPrevious} 
        disabled={!hasPrevious}
        variant="default"
        className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
      >
        ← Back
      </Button>
      
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