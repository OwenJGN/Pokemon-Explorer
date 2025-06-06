export interface PokemonType {
    type: {
      name: string
    }
  }
  
  export interface PokemonStat {
    base_stat: number
    stat: {
      name: string
    }
  }
  
  export interface PokemonAbility {
    ability: {
      name: string
    }
  }
  
  export interface Pokemon {
    name: string
    id: number
    type: PokemonType[]
    sprite: string
    loading: boolean
    url: string
  }
  
  export interface SimplePokemon {
    name: string
    url: string
  }
  
  export interface PokemonResponse {
    results: SimplePokemon[]
    next: string | null
    previous: string | null
  }
  
  export interface DetailedPokemonResponse {
    id: number
    name: string
    types: PokemonType[]
    sprites: {
      front_default: string | null
    }
  }
  
  export interface PokemonDetail {
    id: number
    name: string
    height: number
    weight: number
    sprites: {
      front_default: string | null
    }
    types: PokemonType[]
    stats: PokemonStat[]
    abilities: PokemonAbility[]
    base_experience: number
  }