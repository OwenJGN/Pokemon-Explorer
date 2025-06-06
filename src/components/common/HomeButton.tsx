import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface HomeButtonProps {
  className?: string
  text?: string
}

const HomeButton = ({ 
  className = "bg-black text-white hover:bg-gray-800 px-6 py-2 rounded",
  text = "← Return Home"
}: HomeButtonProps) => {
  return (
    <div className="mt-8 px-4">
      <div className="flex justify-center">
        <div className="w-full max-w-[1160px]">
          <Link href="/">
            <Button className={className}>
              {text}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeButton