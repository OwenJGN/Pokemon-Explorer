import { Card, CardContent } from '@/components/ui/card'

interface PokemonDetailDescriptionProps {
  description: string
}

/**
 * Pokemon description display component for detail pages
 */
const PokemonDetailDescription = ({ description }: PokemonDetailDescriptionProps) => {
  // Don't render anything if no description is available
  if (!description) return null

  return (
    <div className="flex justify-center mb-6">
      <div className="w-full max-w-[1160px] h-auto max-h-[133px]">
        {/* Light grey card background for description section */}
        <Card className="h-full bg-[#F5F4F4]">
          <CardContent className="p-6 h-full">
            <div className="flex items-center gap-4 h-full">

              {/* Decorative Pokeball icon */}
              <div className="ml-6 w-23 h-23 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <img 
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cherish-ball.png"
                  alt="Cherish Ball"
                  className="w-30 h-30 object-contain"
                />
              </div>
              
              {/* Pokemon description text */}
              <p className="leading-relaxed flex-1 p-6">{description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PokemonDetailDescription