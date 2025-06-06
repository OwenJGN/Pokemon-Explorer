/**
 * Simplified header component specifically for Pokemon detail pages
 */
const PokemonDetailHeader = () => {
    return (
      <div className="bg-white">
        <div className="max-w-10xl mx-auto px-6 py-4">
          <div className="flex justify-center">
            {/* Container matches detail page content width for visual alignment */}
            <div className="w-full max-w-[1160px]">
              {/* Header */}
              <h1 className="text-xl font-semibold">Pokémon Browser</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default PokemonDetailHeader