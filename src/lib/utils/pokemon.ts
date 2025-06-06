import { PokemonType } from '@/lib/types/pokemon'

/**
 * Formats Pokemon ID with zero-padding and hash prefix for display
 * Converts numeric ID to consistent 4-digit format (e.g., 1 -> #0001)
 */
export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(4, '0')}`
}

/**
 * Capitalises the first letter of a string
 * Used for Pokemon names, types, and other text that should be sentence case
 */
export const capitalise = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Converts API stat names to human readable display names
 * Maps technical stat names to user friendly labels
 */
export const getStatName = (statName: string): string => {
  const statMap: { [key: string]: string } = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Special Attack',
    'special-defense': 'Special Defense',
    'speed': 'Speed'
  }
  return statMap[statName] || capitalise(statName)
}

/**
 * Calculates progress bar width percentage for stat visualisation
 * Scales Pokemon base stats (typically 1-180) to percentage for progress bars
 * Caps at 100% to prevent overflow in the UI
 */
export const getStatBarWidth = (value: number): number => {
  return Math.min((value / 180) * 100, 100)
}

/**
 * Converts Pokemon API gender rate to human-readable format
 * Gender rate is expressed as eighths (0-8) with special values
 */
export const getGenderDisplay = (genderRate: number): string => {
  if (genderRate === -1) return 'Genderless'    
  if (genderRate === 0) return 'Male only'      
  if (genderRate === 8) return 'Female only'    
  
  // For rates 1-7, Pokemon can be both male and female
  return 'Male / Female'
}

/**
 * Calculates type weaknesses based on Pokemon's types
 * Uses simplified weakness chart for display purposes
 * Returns up to 4 weakness types to keep UI manageable
 */
export const getWeaknessTypes = (types: PokemonType[]): string[] => {
  const weaknessMap: { [key: string]: string[] } = {
    grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
    poison: ['ground', 'psychic'],
    fire: ['water', 'ground', 'rock'],
    water: ['electric', 'grass'],
    electric: ['ground'],
    psychic: ['bug', 'ghost', 'dark'],
    ice: ['fire', 'fighting', 'rock', 'steel'],
    dragon: ['ice', 'dragon', 'fairy'],
    dark: ['fighting', 'bug', 'fairy'],
    fairy: ['poison', 'steel'],
    normal: ['fighting'],
    fighting: ['flying', 'psychic', 'fairy'],
    flying: ['electric', 'ice', 'rock'],
    ground: ['water', 'grass', 'ice'],
    rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
    bug: ['fire', 'flying', 'rock'],
    ghost: ['ghost', 'dark'],
    steel: ['fire', 'fighting', 'ground']
  }
  
  // Collect all unique weaknesses from Pokemon's types
  const allWeaknesses = new Set<string>()
  types.forEach(type => {
    const weaknesses = weaknessMap[type.type.name] || []
    weaknesses.forEach(weakness => allWeaknesses.add(weakness))
  })
  
  // Limit to 4 weaknesses for UI display purposes
  return Array.from(allWeaknesses).slice(0, 4) 
}