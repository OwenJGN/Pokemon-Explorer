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

// Configure Inter font from the Figma design
const inter = Inter({
  subsets: ['latin'],
  weight: ['600'], 
  variable: '--font-inter',
})

export default function HomePage() {

  // Main hook for fetching and paginating through Pokémon lists from API
  const {
    pokemon,
    loading,
    nextUrl,
    prevUrl,
    allPokemonNames,
    handleNext,
    handlePrevious
  } = usePokemon()

  // Search functionality hook - handles filtering through all available Pokémon with pagination
  const {
    searchTerm,
    setSearchTerm,
    isSearching,
    filteredPokemon,
    hasSearched,
    lastSearchTerm,
    returnsResults,
    searchForPokemon,
    totalResults,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    handleSearchNext,
    handleSearchPrevious
  } = usePokemonSearch(allPokemonNames)

  // Determine which Pokémon to display and which navigation to show
  const isInSearchMode = hasSearched && returnsResults
  const isEmptySearchResult = hasSearched && !returnsResults
  
  // Show different content based on mode
  const pokemonToDisplay = isInSearchMode ? filteredPokemon : (isEmptySearchResult ? [] : pokemon)
  
  // Determine which navigation handlers to use
  const navigationHandlers = isInSearchMode 
    ? {
        onNext: handleSearchNext,
        onPrevious: handleSearchPrevious,
        hasNext: hasNextPage,
        hasPrevious: hasPreviousPage
      }
    : {
        onNext: handleNext,
        onPrevious: handlePrevious,
        hasNext: !!nextUrl,
        hasPrevious: !!prevUrl
      }

  return (
    <div className={`${inter.className} min-h-screen flex flex-col bg-white`}>
      
      {/* Page header with title and subtitle */}
      <Header 
        title="Pokémon Browser" 
        subtitle="Search and find Pokémon" 
      />
      
      <Separator />

      {/* Main content container with centred layout */}
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8">
          
          {/* Search section - allows users to search through all available Pokémon */}
          <PokemonSearch
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={searchForPokemon}
            isSearching={isSearching}
            hasSearched={hasSearched}
            lastSearchTerm={lastSearchTerm}
            resultCount={filteredPokemon.length}
            totalResults={totalResults}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        
          {/* Conditional rendering: show loading spinner or Pokémon grid */}
          {loading || isSearching ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <LoadingSpinner size="lg" />
              </div>
            </div>
          ) : (
            <PokemonGrid pokemon={pokemonToDisplay}/>
          )}

          {/* Navigation buttons - only show when not in empty search result state */}
          {!loading && !isSearching && !isEmptySearchResult && (
            <div className="flex justify-center">
              <NavigationButtons
                onPrevious={navigationHandlers.onPrevious}
                onNext={navigationHandlers.onNext}
                hasPrevious={navigationHandlers.hasPrevious}
                hasNext={navigationHandlers.hasNext}
              />
            </div>
          )}
          
        </div>

      <Separator />
      <Footer />
    </div>
  )
}