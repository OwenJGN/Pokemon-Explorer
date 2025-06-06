import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pokemon } from '@/lib/types/pokemon'
import { extractPokemonId, formatPokemonId } from '@/lib/api/pokemon'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface PokemonCardProps {
  pokemon: Pokemon
}

/**
 * Determines background colour for Pokemon type badges
 * Special handling for poison and grass types, default for others
 */
const getTypeColor = (typeName: string) => {
 return typeName === 'poison' || typeName === 'grass' ? '#18181BCC' : '#181A1B'
}

/**
 * Individual Pokemon card component for grid display
 * Clickable card that navigates to detailed Pokemon view
 * Features Pokemon image, name, ID, and type badges
 */
const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  // Extract Pokemon ID from API URL for navigation routing
  const pokeId = extractPokemonId(pokemon.url)

  // Show loading state while Pokemon details are being fetched
  if (pokemon.loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
              <LoadingSpinner size="lg" />
          </div>
      </div>
    )
  }

  return (
    // Entire card is wrapped in Link for navigation to detail page
    <Link href={`/pokemon/${pokeId}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow w-full h-full overflow-hidden p-0">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Pokemon image section with fixed dimensions and grey background */}
          <div 
            className="flex justify-center mb-5 bg-zinc-100 rounded-t-lg"
            style={{ minHeight: '200px' }}
          >
            {pokemon.sprite && (
              <img 
                src={pokemon.sprite} 
                alt={pokemon.name} 
                className="object-contain" 
                style={{ width: '266px', height: '224px' }}
              />
            )}
          </div>
          
          {/* Pokemon information section with flexible layout */}
          <div className="px-3 pb-3 flex flex-col flex-1">
            {/* Pokemon name */}
            <h3 className="text-2xl font-semibold capitalize mb-1 px-2">{pokemon.name}</h3>
            
            {/* Pokemon ID */}
            <p className="text-md text-zinc-500 font-semibold mb-10 px-2">#{formatPokemonId(pokemon.id)}</p>
            
            {/* Type badges positioned at bottom of card */}
            <div className="px-2 flex gap-3 flex-wrap mt-auto mb-4">
              {pokemon.type.map((type, index) => (
                <span 
                  key={index}
                  className="px-2.5 py-0.5 font-semibold text-white text-xs rounded-sm capitalize flex items-center justify-center"
                  style={{backgroundColor: getTypeColor(type.type.name)}}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default PokemonCard