import { useState, useEffect } from 'react'
import { PokemonDetail } from '@/lib/types/pokemon'
import { 
  fetchPokemonDetail, 
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

export const usePokemonDetail = (pokemonId: string): UsePokemonDetailReturn => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [weaknesses, setWeaknesses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const processSpeciesData = (speciesData: any) => {
    const englishEntry = speciesData.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'en'
    )
    if (englishEntry) {
      const cleanedText = englishEntry.flavor_text
        .replace(/\f/g, ' ')
        .replace(/POKéMON/g, 'Pokémon')
        .replace(/POKEMON/g, 'Pokémon')
      setDescription(cleanedText)
    }
    
    const englishGenus = speciesData.genera.find(
      (genus: any) => genus.language.name === 'en'
    )
    if (englishGenus) {
      setCategory(englishGenus.genus.replace(' Pokémon', ''))
    }
    
    setGender(getGenderDisplay(speciesData.gender_rate))
  }

  const fetchPokemonData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const pokemonData = await fetchPokemonDetail(pokemonId)
      setPokemon(pokemonData)

      const speciesData = await fetchPokemonSpecies(pokemonData.species.url)
      processSpeciesData(speciesData)

      const calculatedWeaknesses = getWeaknessTypes(pokemonData.types)
      setWeaknesses(calculatedWeaknesses)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch Pokémon')
    } finally {
      setLoading(false)
    }
  }

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