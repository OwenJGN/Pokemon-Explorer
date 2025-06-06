'use client'

import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Separator from '@/components/layout/Separator'
import PokemonSearch from '@/components/pokemon/PokemonSearch'
import PokemonGrid from '@/components/pokemon/PokemonGrid'
import NavigationButtons from '@/components/common/NavigationButtons'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { usePokemon } from '@/hooks/usePokemon'
import { usePokemonSearch } from '@/hooks/usePokemonSearch'
import { MAX_SEARCH_RESULTS } from '@/lib/constants/pokemon'

const inter = Inter({
  subsets: ['latin'],
  weight: ['600'], 
  variable: '--font-inter',
})

export default function HomePage() {
  const {
    pokemon,
    loading,
    nextUrl,
    prevUrl,
    allPokemonNames,
    handleNext,
    handlePrevious
  } = usePokemon()

  const {
    searchTerm,
    setSearchTerm,
    isSearching,
    filteredPokemon,
    hasSearched,
    lastSearchTerm,
    returnsResults,
    searchForPokemon
  } = usePokemonSearch(allPokemonNames)



  const pokemonToDisplay = filteredPokemon.length > 0 ? filteredPokemon : pokemon

  return (
    <div className={`${inter.className} min-h-screen flex flex-col bg-white`}>
      <Header 
        title="Pokémon Browser" 
        subtitle="Search and find Pokémon" 
      />
      
      <Separator />

      {/* Main Content Container*/}
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8">
          
          {/* Search Section */}
          <PokemonSearch
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={searchForPokemon}
            isSearching={isSearching}
            hasSearched={hasSearched}
            lastSearchTerm={lastSearchTerm}
            resultCount={filteredPokemon.length}
            maxResults={MAX_SEARCH_RESULTS}
          />
        
          { loading ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <LoadingSpinner size="lg" />
              </div>
            </div>
          ) : (
          <PokemonGrid pokemon={pokemonToDisplay}/>
          )}

          {/* Navigation Buttons*/}
            {(!hasSearched || (hasSearched && !returnsResults)) && (
              <div className="flex justify-center">
                <NavigationButtons
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  hasPrevious={!!prevUrl}
                  hasNext={!!nextUrl}
                />
              </div>
          )}
          
        </div>

      <Separator />
      <Footer />
    </div>
  )
}