import { useState } from 'react'
import { Pokemon, SimplePokemon } from '@/lib/types/pokemon'
import { createPokemonFromDetails } from '@/lib/api/pokemon'
import { MAX_SEARCH_RESULTS } from '@/lib/constants/pokemon'

export const usePokemonSearch = (allPokemonNames: SimplePokemon[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [lastSearchTerm, setLastSearchTerm] = useState('')
  const [returnsResults, setReturnsResults] = useState(false)

  const searchForPokemon = async () => {
    setLastSearchTerm(searchTerm.trim())
    setHasSearched(true)
    
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
      const matchingNames = allPokemonNames.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      const limitedMatches = matchingNames.slice(0, MAX_SEARCH_RESULTS)

      if (limitedMatches.length === 0) {
        setFilteredPokemon([])
        setIsSearching(false)
        setReturnsResults(false)
        return
      }
      
      setReturnsResults(true)

      const pokemonDetailsPromises = limitedMatches.map(pokemon => 
        createPokemonFromDetails(pokemon.url)
      )
      
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