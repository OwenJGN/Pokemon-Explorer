import { useState, useEffect } from 'react'
import { PokemonDetail } from '@/lib/types/pokemon'
import { 
  fetchPokemonDetails, 
  fetchPokemonSpecies,
  getWeaknessTypes,
  getGenderDisplay 
} from '@/lib/api/pokemon'

interface UsePokemonDetailReturn {
  pokemon: PokemonDetail | null
  description: string
  category: string
  gender: string
  weaknesses: string[]
  loading: boolean
  error: string | null
}

/**
 * Pokemon detail data hook for individual Pokemon pages
 * Fetches and processes multiple API endpoints to gather complete Pokemon information
 * Combines basic Pokemon data with species-specific details like description and gender
 */
export const usePokemonDetail = (pokemonId: string): UsePokemonDetailReturn => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  
  // Species specific data from separate API endpoint
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  
  // Calculated data based on Pokemon types
  const [weaknesses, setWeaknesses] = useState<string[]>([])
  
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Process Pokemon species data to extract human readable information
   */
  const processSpeciesData = (speciesData: any) => {
    // Find English description from available flavor text entries
    const englishEntry = speciesData.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'en'
    )
    if (englishEntry) {
      // Clean up API text formatting and Pokemon name casing
      const cleanedText = englishEntry.flavor_text
        .replace(/\f/g, ' ')                    // Remove form feed characters
        .replace(/POKéMON/g, 'Pokémon')         // Fix accent in Pokemon name
        .replace(/POKEMON/g, 'Pokémon')         // Fix all caps Pokemon references
      setDescription(cleanedText)
    }
    
    // Extract Pokemon category (e.g., "Seed Pokémon" -> "Seed")
    const englishGenus = speciesData.genera.find(
      (genus: any) => genus.language.name === 'en'
    )
    if (englishGenus) {
      setCategory(englishGenus.genus.replace(' Pokémon', ''))
    }
    
    // Convert numerical gender rate to human-readable format
    setGender(getGenderDisplay(speciesData.gender_rate))
  }

  /**
   * Main data fetching function that coordinates multiple API calls
   * Fetches basic Pokemon data, then species data, then calculates weaknesses
   */
  const fetchPokemonData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch primary Pokemon data (stats, types, abilities, etc.)
      const pokemonData = await fetchPokemonDetails(pokemonId)
      setPokemon(pokemonData)

      // Fetch species-specific data (description, category, gender info)
      const speciesData = await fetchPokemonSpecies(pokemonData.species.url)
      processSpeciesData(speciesData)

      // Calculate type weaknesses based on Pokemon's types
      const calculatedWeaknesses = getWeaknessTypes(pokemonData.types)
      setWeaknesses(calculatedWeaknesses)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch Pokémon')
    } finally {
      setLoading(false)
    }
  }

  // Trigger data fetching when Pokemon ID changes
  useEffect(() => {
    if (pokemonId) {
      fetchPokemonData()
    }
  }, [pokemonId])

  return {
    pokemon,
    description,
    category,
    gender,
    weaknesses,
    loading,
    error
  }
}