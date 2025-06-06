import { useState, useEffect } from 'react'
import { Pokemon, SimplePokemon } from '@/lib/types/pokemon'
import { 
  fetchPokemonList, 
  createPokemonFromDetails,
  fetchAllPokemonNames 
} from '@/lib/api/pokemon'
import { POKEMON_PER_PAGE, POKEMON_API_BASE_URL } from '@/lib/constants/pokemon'

/**
 * Main Pokemon data management hook for the homepage
 * Handles paginated fetching of Pokemon from the API with navigation controls
 * Also maintains a complete list of all Pokemon names for search functionality
 */
export const usePokemon = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  
  // Track current API endpoint for pagination
  const [currentUrl, setCurrentUrl] = useState(`${POKEMON_API_BASE_URL}/pokemon?limit=${POKEMON_PER_PAGE}`)
  
  // Navigation URLs provided by the API for pagination
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [prevUrl, setPrevUrl] = useState<string | null>(null)
  
  // Complete list of all Pokemon names for search functionality
  const [allPokemonNames, setAllPokemonNames] = useState<SimplePokemon[]>([])

  /**
   * Core function to fetch Pokemon data from a given API endpoint
   * Implements optimistic loading by showing skeleton cards immediately
   * Then fetches detailed data in the background 
   */
  const fetchPokemon = async (url: string) => {
    setLoading(true)
    try {
      
      // First, get the basic Pokemon list from API
      const data = await fetchPokemonList(url)
      
      // Create initial Pokemon objects with loading state for immediate display
      const initialPokemon: Pokemon[] = data.results.map(poke => ({
        name: poke.name,
        id: parseInt(poke.url.split('/').slice(-2, -1)[0]),
        type: [],
        sprite: '',
        loading: true,
        url: poke.url
      }))

      // Set pagination URLs from API response
      setPokemon(initialPokemon)
      setNextUrl(data.next)
      setPrevUrl(data.previous)
      setLoading(false)

      // Fetch detailed data for each Pokemon in parallel 
      const detailedPokemonPromises = data.results.map(poke => 
        createPokemonFromDetails(poke.url)
      )
      
      // Update with complete Pokemon data including sprites and types
      const detailedPokemon = await Promise.all(detailedPokemonPromises)
      setPokemon(detailedPokemon)
      
    } catch (error) {
      console.error('Error fetching Pokémon:', error)
      setLoading(false)
    }
  }

  // Fetch Pokemon data whenever the current URL changes (pagination)
  useEffect(() => {
    fetchPokemon(currentUrl)
  }, [currentUrl])

  // Load complete Pokemon name list once for search functionality
  useEffect(() => {
    const loadAllPokemonNames = async () => {
      try {
        const names = await fetchAllPokemonNames()
        setAllPokemonNames(names)
      } catch (error) {
        console.error('Error fetching all Pokémon names:', error)
      }
    }

    loadAllPokemonNames()
  }, [])

  // Navigation handlers for pagination controls
  const handleNext = () => {
    if (nextUrl) {
      setCurrentUrl(nextUrl)
    }
  }

  const handlePrevious = () => {
    if (prevUrl) {
      setCurrentUrl(prevUrl)
    }
  }

  return {
    pokemon,
    loading,
    nextUrl,
    prevUrl,
    allPokemonNames,
    handleNext,
    handlePrevious
  }
}