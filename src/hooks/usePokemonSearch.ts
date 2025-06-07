import { useState } from 'react'
import { Pokemon, SimplePokemon } from '@/lib/types/pokemon'
import { createPokemonFromDetails } from '@/lib/api/pokemon'
import { POKEMON_PER_PAGE } from '@/lib/constants/pokemon'

/**
 * Pokemon search functionality hook with pagination support
 * Provides real time search through all available Pokemon with paginated results
 */
export const usePokemonSearch = (allPokemonNames: SimplePokemon[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([])
  
  // Track search history for displaying result context
  const [hasSearched, setHasSearched] = useState(false)
  const [lastSearchTerm, setLastSearchTerm] = useState('')
  const [returnsResults, setReturnsResults] = useState(false)
  
  // Pagination state for search results
  const [allMatchingNames, setAllMatchingNames] = useState<SimplePokemon[]>([])
  const [currentSearchPage, setCurrentSearchPage] = useState(0)
  const [totalSearchResults, setTotalSearchResults] = useState(0)

  /**
   * Calculate pagination info for search results
   */
  const getSearchPaginationInfo = () => {
    const totalPages = Math.ceil(totalSearchResults / POKEMON_PER_PAGE)
    const hasNextPage = currentSearchPage < totalPages - 1
    const hasPreviousPage = currentSearchPage > 0
    
    return {
      totalPages,
      hasNextPage,
      hasPreviousPage,
      currentPage: currentSearchPage + 1,
      totalResults: totalSearchResults
    }
  }

  /**
   * Load a specific page of search results
   */
  const loadSearchPage = async (matchingNames: SimplePokemon[], pageIndex: number) => {
    setIsSearching(true)
    
    try {
      
      // Calculate the slice of results for this page
      const startIndex = pageIndex * POKEMON_PER_PAGE
      const endIndex = startIndex + POKEMON_PER_PAGE
      const pageResults = matchingNames.slice(startIndex, endIndex)

      // Fetch detailed data for this page of Pokemon
      const pokemonDetailsPromises = pageResults.map(pokemon => 
        createPokemonFromDetails(pokemon.url)
      )
      
      const detailedPokemon = await Promise.all(pokemonDetailsPromises)
      setFilteredPokemon(detailedPokemon)
      
    } catch (error) {
      console.error('Error loading search page:', error)
      setFilteredPokemon([])
    }
    
    setIsSearching(false)
  }

  /**
   * Main search function that filters Pokemon by name and sets up pagination
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
      setAllMatchingNames([])
      setCurrentSearchPage(0)
      setTotalSearchResults(0)
      return
    }

    setIsSearching(true)
    
    try {
      // Client-side filtering of Pokemon names (case-insensitive partial match)
      const matchingNames = allPokemonNames.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      // Handle no matches case
      if (matchingNames.length === 0) {
        setFilteredPokemon([])
        setIsSearching(false)
        setReturnsResults(false)
        setAllMatchingNames([])
        setCurrentSearchPage(0)
        setTotalSearchResults(0)
        return
      }
      
      setReturnsResults(true)
      setAllMatchingNames(matchingNames)
      setCurrentSearchPage(0) // Reset to first page
      setTotalSearchResults(matchingNames.length)

      // Load the first page of results
      await loadSearchPage(matchingNames, 0)
      
    } catch (error) {
      console.error('Error searching for Pokémon:', error)
      setFilteredPokemon([])
      setAllMatchingNames([])
      setCurrentSearchPage(0)
      setTotalSearchResults(0)
    }
  }

  /**
   * Navigate to next page of search results
   */
  const handleSearchNext = async () => {
    const { hasNextPage } = getSearchPaginationInfo()
    if (hasNextPage && allMatchingNames.length > 0) {
      const nextPage = currentSearchPage + 1
      setCurrentSearchPage(nextPage)
      await loadSearchPage(allMatchingNames, nextPage)
    }
  }

  /**
   * Navigate to previous page of search results
   */
  const handleSearchPrevious = async () => {
    const { hasPreviousPage } = getSearchPaginationInfo()
    if (hasPreviousPage && allMatchingNames.length > 0) {
      const prevPage = currentSearchPage - 1
      setCurrentSearchPage(prevPage)
      await loadSearchPage(allMatchingNames, prevPage)
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    filteredPokemon,
    hasSearched,
    returnsResults,
    lastSearchTerm,
    searchForPokemon,
    ...getSearchPaginationInfo(),
    handleSearchNext,
    handleSearchPrevious
  }
}