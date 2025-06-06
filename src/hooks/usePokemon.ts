import { useState, useEffect } from 'react'
import { Pokemon, SimplePokemon } from '@/lib/types/pokemon'
import { 
  fetchPokemonList, 
  createPokemonFromDetails,
  fetchAllPokemonNames 
} from '@/lib/api/pokemon'
import { POKEMON_PER_PAGE, POKEMON_API_BASE_URL } from '@/lib/constants/pokemon'

export const usePokemon = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUrl, setCurrentUrl] = useState(`${POKEMON_API_BASE_URL}/pokemon?limit=${POKEMON_PER_PAGE}`)
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [prevUrl, setPrevUrl] = useState<string | null>(null)
  const [allPokemonNames, setAllPokemonNames] = useState<SimplePokemon[]>([])

  const fetchPokemon = async (url: string) => {
    setLoading(true)
    try {
      const data = await fetchPokemonList(url)
      
      const initialPokemon: Pokemon[] = data.results.map(poke => ({
        name: poke.name,
        id: parseInt(poke.url.split('/').slice(-2, -1)[0]),
        type: [],
        sprite: '',
        loading: true,
        url: poke.url
      }))

      setPokemon(initialPokemon)
      setNextUrl(data.next)
      setPrevUrl(data.previous)
      setLoading(false)

      const detailedPokemonPromises = data.results.map(poke => 
        createPokemonFromDetails(poke.url)
      )
      
      const detailedPokemon = await Promise.all(detailedPokemonPromises)
      setPokemon(detailedPokemon)
      
    } catch (error) {
      console.error('Error fetching Pokémon:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPokemon(currentUrl)
  }, [currentUrl])

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