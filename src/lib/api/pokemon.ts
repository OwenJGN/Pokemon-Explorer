import { 
    PokemonResponse, 
    DetailedPokemonResponse, 
    Pokemon, 
    PokemonDetail,
    SimplePokemon 
  } from '@/lib/types/pokemon'
  import { POKEMON_API_BASE_URL } from '@/lib/constants/pokemon'
  
  export const extractPokemonId = (url: string): string => {
    const parts = url.split('/')
    return parts[parts.length - 2]
  }
  
  export const formatPokemonId = (id: number): string => {
    return id.toString().padStart(4, '0')
  }
  
  export const fetchPokemonList = async (url: string): Promise<PokemonResponse> => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon list')
    }
    return response.json()
  }
  
  export const fetchPokemonDetails = async (pokemonId: string): Promise<DetailedPokemonResponse> => {
    const response = await fetch(`${POKEMON_API_BASE_URL}/pokemon/${pokemonId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon details')
    }
    return response.json()
  }
  
  export const fetchPokemonDetail = async (pokemonId: string): Promise<PokemonDetail> => {
    const response = await fetch(`${POKEMON_API_BASE_URL}/pokemon/${pokemonId}`)
    if (!response.ok) {
      throw new Error('Pokémon not found')
    }
    return response.json()
  }
  
  export const fetchAllPokemonNames = async (): Promise<SimplePokemon[]> => {
    const response = await fetch(`${POKEMON_API_BASE_URL}/pokemon?limit=2000`)
    if (!response.ok) {
      throw new Error('Failed to fetch all Pokémon names')
    }
    const data: PokemonResponse = await response.json()
    return data.results
  }
  
  export const createPokemonFromDetails = async (url: string): Promise<Pokemon> => {
    const id = extractPokemonId(url)
    
    try {
      const data = await fetchPokemonDetails(id)
      
      return {
        name: data.name,
        id: data.id,
        type: data.types,
        sprite: data.sprites.front_default || '',
        loading: false,
        url: url
      }
    } catch (error) {
      console.error(`Error fetching details for Pokémon ${id}:`, error)
      return {
        name: url.split('/').slice(-2, -1)[0] || 'Unknown',
        id: parseInt(id),
        type: [],
        sprite: '',
        loading: false,
        url: url
      }
    }
  }