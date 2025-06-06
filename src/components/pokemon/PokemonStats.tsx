import { Card, CardContent } from '@/components/ui/card'
import { PokemonDetail } from '@/lib/types/pokemon'
import { capitalise, getStatName, getStatBarWidth } from '@/lib/utils/pokemon'

interface PokemonDetailStatsProps {
  pokemon: PokemonDetail
  category: string
  gender: string
  weaknesses: string[]
}

const PokemonDetailStats = ({ pokemon, category, gender, weaknesses }: PokemonDetailStatsProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 justify-center w-full max-w-[1160px] mx-auto">
      <div className="w-full lg:w-[280px] flex-shrink-0">
        <Card className="h-full">
          <CardContent className="p-6 pt-3">
            <div className="space-y-8 px-4">
              <div>
                <div className="text-xl font-bold mb-1">Height</div>
                <div className="text-lg font-semibold">{(pokemon.height / 10).toFixed(1)}m</div>
              </div>

              <div>
                <div className="text-xl font-bold mb-1">Category</div>
                <div className="text-lg">{category || 'Unknown'}</div>
              </div>

              <div>
                <div className="text-xl font-bold mb-1">Weight</div>
                <div className="text-lg">{(pokemon.weight / 10).toFixed(1)} kg</div>
              </div>

              <div>
                <div className="text-xl font-bold mb-1">Gender</div>
                <div className="text-base">{gender || 'Unknown'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6 flex-1 min-w-0">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 min-w-0 h-auto md:h-[286px]">
            <Card className="h-full">
              <CardContent className="pt-3 px-6 pb-6 h-full">
                <div className="flex flex-col h-full space-y-9 px-5">
                  <div>
                    <div className="text-xl font-semibold mb-3">Type</div>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.types.map((type, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-0.5 font-semibold text-white text-xs rounded-sm capitalize flex items-center justify-center bg-[#181A1B]"
                        >
                          {capitalise(type.type.name)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xl font-semibold mb-3">Weaknesses</div>
                    <div className="flex flex-wrap gap-2">
                      {weaknesses.map((weakness, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-0.5 font-semibold text-white text-xs rounded-sm capitalize flex items-center justify-center bg-[#181A1B]"
                        >
                          {capitalise(weakness)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 min-w-0 h-auto md:h-[286px]">
            <Card className="h-full">
              <CardContent className="pt-3 px-6 pb-6 ml-4 h-full">
                <div className="h-full flex flex-col">
                  <div className="text-xl font-semibold mb-3">Ability</div>
                  <div className="text-md font-semibold">
                    {capitalise(pokemon.abilities[0]?.ability.name || 'Unknown')}
                  </div>
                  <div className="text-md text-gray-700 italic">
                    Powers up {pokemon.types[0]?.type.name || 'grass'}-type moves when the Pokémon's HP is low.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full h-auto lg:h-[324px]">
          <Card className="h-full">
            <CardContent className="p-6 h-full ml-4">
              <div className="flex flex-col justify-center h-full space-y-4 lg:space-y-4">
                {pokemon.stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-20">
                    <div className="w-40 text-lg font-medium text-left flex-shrink-0">
                      {getStatName(stat.stat.name)}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-black h-4 rounded-full transition-all duration-300"
                        style={{ width: `${getStatBarWidth(stat.base_stat)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PokemonDetailStats