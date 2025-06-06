/**
 * TypeScript interfaces for Pokemon API data structures
 */

/** Pokemon type information (e.g., grass, poison, fire) */
export interface PokemonType {
    type: {
      name: string
    }
  }
  
  /** Pokemon base stat information (HP, Attack, Defense, etc.) */
  export interface PokemonStat {
    base_stat: number
    stat: {
      name: string
    }
  }
  
  /** Pokemon ability information */
  export interface PokemonAbility {
    ability: {
      name: string
    }
  }
  
  /** 
   * Main Pokemon interface used throughout the application
   * Combines API data with loading states for UI updates
   */
  export interface Pokemon {
    name: string
    id: number
    type: PokemonType[]
    sprite: string
    loading: boolean    
    url: string        
  }
  
  /** 
   * Simplified Pokemon interface for name lists
   * Used primarily for search functionality and initial data loading
   */
  export interface SimplePokemon {
    name: string
    url: string
  }
  
  /** 
   * API response structure for paginated Pokemon lists
   * Includes navigation URLs for pagination functionality
   */
  export interface PokemonResponse {
    results: SimplePokemon[]
    next: string | null      // URL for next page
    previous: string | null  // URL for previous page
  }
  
  /** 
   * API response structure for individual Pokemon basic details
   * Used when fetching sprite and type information for cards
   */
  export interface DetailedPokemonResponse {
    id: number
    name: string
    types: PokemonType[]
    sprites: {
      front_default: string | null
    }
  }
  
  /** 
   * Complete Pokemon detail interface for individual Pokemon pages
   * Contains all information needed for the detailed view
   */
  export interface PokemonDetail {
    id: number
    name: string
    height: number           // In decimeters (API format)
    weight: number          // In hectograms (API format)
    sprites: {
      front_default: string | null
    }
    types: PokemonType[]
    stats: PokemonStat[]
    abilities: PokemonAbility[]
    base_experience: number
    species: {
      url: string           // URL to fetch species-specific data
    }
  }
  
  /** 
   * Pokemon species data structure from separate API endpoint
   * Contains description text, category, and gender information
   */
  export interface PokemonSpecies {
    flavor_text_entries: Array<{
      flavor_text: string
      language: {
        name: string
      }
    }>
    genera: Array<{
      genus: string          
      language: {
        name: string
      }
    }>
    gender_rate: number     // -1 = genderless, 0 = male only, 8 = female only, etc.
  }