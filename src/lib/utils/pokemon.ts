import { PokemonType } from '@/lib/types/pokemon'

export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(4, '0')}`
}

export const capitalise = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

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

export const getStatBarWidth = (value: number): number => {
  return Math.min((value / 180) * 100, 100)
}

export const getGenderDisplay = (genderRate: number): string => {
  if (genderRate === -1) return 'Genderless'
  if (genderRate === 0) return 'Male only'
  if (genderRate === 8) return 'Female only'
  
  return 'Male / Female'
}

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
  
  const allWeaknesses = new Set<string>()
  types.forEach(type => {
    const weaknesses = weaknessMap[type.type.name] || []
    weaknesses.forEach(weakness => allWeaknesses.add(weakness))
  })
  
  return Array.from(allWeaknesses).slice(0, 4) 
}