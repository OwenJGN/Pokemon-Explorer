import { useState } from 'react'
import { Pokemon, SimplePokemon } from '@/lib/types/pokemon'
import { createPokemonFromDetails } from '@/lib/api/pokemon'
import { MAX_SEARCH_RESULTS } from '@/lib/constants/pokemon'

/**
 * Pokemon search functionality hook
 * Provides real time search through all available Pokemon with result limiting
 */
export const usePokemonSearch = (allPokemonNames: SimplePokemon[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([])
  
  // Track search history for displaying result context
  const [hasSearched, setHasSearched] = useState(false)
  const [lastSearchTerm, setLastSearchTerm] = useState('')
  const [returnsResults, setReturnsResults] = useState(false)

  /**
   * Main search function that filters Pokemon by name and fetches detailed data
   * Handles empty searches, result limiting, and loading states
   */
  const searchForPokemon = async () => {

    // Store search term for result display context
    setLastSearchTerm(searchTerm.trim())
    setHasSearched(true)
    
    // Handle empty search - reset to browse mode
    if (!searchTerm.trim()) {
      setFilteredPokemon([])
      setIsSearching(false)
      setHasSearched(false)
      setReturnsResults(false)
      setLastSearchTerm('')
      return
    }

    setIsSearching(true)
    
    try {
      // Client-side filtering of Pokemon names (case-insensitive partial match)
      const matchingNames = allPokemonNames.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      // Limit results to prevent overwhelming the UI and API
      const limitedMatches = matchingNames.slice(0, MAX_SEARCH_RESULTS)

      // Handle no matches case
      if (limitedMatches.length === 0) {
        setFilteredPokemon([])
        setIsSearching(false)
        setReturnsResults(false)
        return
      }
      
      setReturnsResults(true)

      // Fetch detailed data for matching Pokemon in parallel
      const pokemonDetailsPromises = limitedMatches.map(pokemon => 
        createPokemonFromDetails(pokemon.url)
      )
      
      // Wait for all Pokemon details to load
      const detailedPokemon = await Promise.all(pokemonDetailsPromises)
      setFilteredPokemon(detailedPokemon)
      
    } catch (error) {
      console.error('Error searching for Pokémon:', error)
      setFilteredPokemon([])
    }
    setIsSearching(false)
  }

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    filteredPokemon,
    hasSearched,
    returnsResults,
    lastSearchTerm,
    searchForPokemon
  }
}