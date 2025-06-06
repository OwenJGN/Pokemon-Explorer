import { PokemonDetail } from '@/lib/types/pokemon'
import { formatPokemonId, capitalise } from '@/lib/utils/pokemon'

interface PokemonDetailImageProps {
  pokemon: PokemonDetail
}

/**
 * Hero section component for Pokemon detail pages featuring Pokemon image
 * Combines Pokemon sprite, name, and ID
 */
const PokemonDetailImage = ({ pokemon }: PokemonDetailImageProps) => {
  return (
    <>
      {/* Dark background section with positioned circular image container */}
      <div className="bg-[#18181B33] w-full relative" style={{ height: '200px' }}>
        {/* Circular container that extends below the background */}
        <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: '150px' }}>
          <div className="w-48 h-48 bg-[#FAFAFA] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            {/* Pokemon sprite with fallback for missing images */}
            {pokemon.sprites.front_default ? (
              <img 
                src={pokemon.sprites.front_default} 
                alt={pokemon.name}
                className="w-50 h-50 object-contain"
              />
            ) : (
              // Fallback placeholder for Pokemon without sprites
              <div className="w-36 h-36 bg-gray-200 rounded-full"></div>
            )}
          </div>
        </div>
      </div>

      {/* Pokemon name and ID section with proper spacing for overlapping image */}
      <div className="text-center pt-38 pb-8">
        <h2 className="text-3xl font-bold mb-2">
          {/* Capitalised Pokemon name with formatted ID number */}
          {capitalise(pokemon.name)} 
          <span style={{color: '#71717A'}}> {formatPokemonId(pokemon.id)}</span>
        </h2>
      </div>
    </>
  )
}

export default PokemonDetailImage