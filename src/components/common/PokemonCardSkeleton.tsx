import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loading component that matches the layout of PokemonCard
 * Provides visual feedback while Pokemon data is being fetched
 */
const PokemonCardSkeleton = () => {
  return (
    <Card className="w-full h-full overflow-hidden p-0">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Pokemon image skeleton */}
        <div 
          className="flex justify-center mb-5 bg-zinc-100 rounded-t-lg"
          style={{ minHeight: '200px' }}
        >
          <div 
            className="flex items-center justify-center"
            style={{ width: '266px', height: '224px' }}
          >
            {/* Circular skeleton for Pokemon sprite */}
            <Skeleton className="w-32 h-32 rounded-full" />
          </div>
        </div>
        
        {/* Pokemon information skeleton section */}
        <div className="px-3 pb-3 flex flex-col flex-1">
          {/* Pokemon name skeleton */}
          <div className="px-2 mb-1">
            <Skeleton className="h-7 w-3/4" />
          </div>
          
          {/* Pokemon ID skeleton */}
          <div className="px-2 mb-10">
            <Skeleton className="h-5 w-16" />
          </div>
          
          {/* Type badges skeleton - positioned at bottom */}
          <div className="px-2 flex gap-3 flex-wrap mt-auto mb-4">
            <Skeleton className="h-6 w-16 rounded-sm" />
            <Skeleton className="h-6 w-20 rounded-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PokemonCardSkeleton