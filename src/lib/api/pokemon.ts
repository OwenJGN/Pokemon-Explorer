import { 
    PokemonResponse, 
    DetailedPokemonResponse, 
    Pokemon, 
    PokemonDetail,
    PokemonSpecies,
    SimplePokemon 
  } from '@/lib/types/pokemon'
  import { POKEMON_API_BASE_URL } from '@/lib/constants/pokemon'
  import { getGenderDisplay, getWeaknessTypes } from '@/lib/utils/pokemon'
  
  /**
   * Extracts Pokemon ID from API URL
   * Pokemon URLs end with /pokemon/ID/ so we extract the second-to-last segment
   */
  export const extractPokemonId = (url: string): string => {
    const parts = url.split('/')
    return parts[parts.length - 2]
  }
  
  /**
   * Formats Pokemon ID with zero-padding for consistent display
   * Converts numeric ID to 4-digit string (e.g., 1 -> "0001")
   */
  export const formatPokemonId = (id: number): string => {
    return id.toString().padStart(4, '0')
  }
  
  /**
   * Fetches paginated list of Pokemon from API
   * Used for main page pagination and navigation
   */
  export const fetchPokemonList = async (url: string): Promise<PokemonResponse> => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon list')
    }
    return response.json()
  }
  
  /**
   * Fetches detailed Pokemon data for individual Pokemon
   * Gets sprites, types, stats, and other card-level information
   */
  export const fetchPokemonDetails = async (pokemonId: string): Promise<DetailedPokemonResponse> => {
    const response = await fetch(`${POKEMON_API_BASE_URL}/pokemon/${pokemonId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon details')
    }
    return response.json()
  }
  
  /**
   * Fetches primary Pokemon data for detail pages
   * Returns complete Pokemon information including stats, abilities, and species data
   */
  export const fetchPokemonDetail = async (pokemonId: string): Promise<PokemonDetail> => {
    const response = await fetch(`${POKEMON_API_BASE_URL}/pokemon/${pokemonId}`)
    if (!response.ok) {
      throw new Error('Pokémon not found')
    }
    return response.json()
  }
  
  /**
   * Fetches Pokemon species data from separate API endpoint
   * Contains description, category, gender rate, and other species-specific info
   */
  export const fetchPokemonSpecies = async (speciesUrl: string): Promise<PokemonSpecies> => {
    const response = await fetch(speciesUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon species data')
    }
    return response.json()
  }
  
  /**
   * Fetches complete list of all Pokemon names for search functionality
   * Uses high limit to ensure we get all available Pokemon
   */
  export const fetchAllPokemonNames = async (): Promise<SimplePokemon[]> => {
    const response = await fetch(`${POKEMON_API_BASE_URL}/pokemon?limit=2000`)
    if (!response.ok) {
      throw new Error('Failed to fetch all Pokémon names')
    }
    const data: PokemonResponse = await response.json()
    return data.results
  }
  
  /**
   * Creates a complete Pokemon object from API URL
   * Combines ID extraction and API fetching
   * Includes error handling for failed requests 
   */
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
      
      // Return fallback Pokemon object for failed requests
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
  
  export { getGenderDisplay, getWeaknessTypes }