import { Pokemon } from '@/lib/types/pokemon'
import PokemonCard from './PokemonCard'

interface PokemonGridProps {
  pokemon: Pokemon[]
}

/**
 * Responsive grid layout component for displaying Pokemon cards
 * Handles both paginated API results and search results
 */
const PokemonGrid = ({ pokemon }: PokemonGridProps) => {
  return (
    <div className="w-full flex justify-center mb-8">
      {/* Responsive grid with column counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl">
        {pokemon.map((poke) => (
          // Each Pokemon gets its own card with unique key
          <PokemonCard key={poke.name} pokemon={poke} />
        ))}
      </div>
    </div>
  )
}

export default PokemonGrid