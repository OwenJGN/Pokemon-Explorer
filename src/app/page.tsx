'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'


interface Pokemon {
  name: string
  id: number
  type: PokemonType[]
  sprite: string
  loading: boolean
  url: string
}

interface PokemonType {
  type: {
    name: string
  }
}

interface SimplePokemon {
  name: string
  url: string
}

interface PokemonResponse {
  results: SimplePokemon[]
  next: string | null
  previous: string | null
}

interface DetailedPokemonResponse {
  id: number
  name: string
  types: PokemonType[]
  sprites: {
    front_default: string | null
  }
}

const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-1 border-gray-800 border-t-white`}></div>
  )
}

export default function HomePage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUrl, setCurrentUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20')
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [prevUrl, setPrevUrl] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([])
  const [allPokemonNames, setAllPokemonNames] = useState<SimplePokemon[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [lastSearchTerm, setLastSearchTerm] = useState('')

  const extractPokemonId = (url: string) => {
    const parts = url.split('/')
    return parts[parts.length - 2]
  }

  const fetchPokemonDetails = async (url: string): Promise<Pokemon> => {
    const id = extractPokemonId(url)
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      const data: DetailedPokemonResponse = await response.json()
      
      return {
        name: data.name,
        id: data.id,
        type: data.types,
        sprite: data.sprites.front_default || '',
        loading: false,
        url: url
      }
    } catch (error) {
      console.error(`Error fetching details for Pokemon ${id}:`, error)
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

  const fetchPokemon = async (url: string) => {
    setLoading(true)
    try {
      const response = await fetch(url)
      const data: PokemonResponse = await response.json()
      
      const initialPokemon: Pokemon[] = data.results.map(poke => ({
        name: poke.name,
        id: parseInt(extractPokemonId(poke.url)),
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
        fetchPokemonDetails(poke.url)
      )
      
      const detailedPokemon = await Promise.all(detailedPokemonPromises)
      setPokemon(detailedPokemon)
      
    } catch (error) {
      console.error('Error fetching Pokemon:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPokemon(currentUrl)
  }, [currentUrl])

  useEffect(() => {
      const fetchAllPokemonNames = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
        const data: PokemonResponse = await response.json()
        setAllPokemonNames(data.results)
      } catch (error) {
        console.error('Error fetching all Pokémon names:', error)
      }
    }

    fetchAllPokemonNames()
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

  const formatPokemonId = (id: number) => {
    return id.toString().padStart(4, '0')
  }

  const searchForPokemon = async () => {

    setLastSearchTerm(searchTerm.trim())
    setHasSearched(true)

    if (!searchTerm.trim()) {
      setFilteredPokemon([])
      setIsSearching(false)
      setHasSearched(false)
      setLastSearchTerm('')
      return
    }

    setIsSearching(true)
    
    try {
      const matchingNames = allPokemonNames.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      const limitedMatches = matchingNames.slice(0, 20)

      if (limitedMatches.length === 0) {
        setFilteredPokemon([])
        setIsSearching(false)
        return
      }

      const pokemonDetailsPromises = limitedMatches.map(pokemon => 
        fetchPokemonDetails(pokemon.url)
      )
      
      const detailedPokemon = await Promise.all(pokemonDetailsPromises)
      setFilteredPokemon(detailedPokemon)
      
    } catch (error) {
      console.error('Error searching for Pokémon:', error)
      setFilteredPokemon([])
    }
    setIsSearching(false)
  }

  const getTypeColor = (typeName: string) => {
    const colors: { [key: string]: string } = {
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      grass: 'bg-green-500',
      electric: 'bg-yellow-500',
      psychic: 'bg-pink-500',
      ice: 'bg-cyan-500',
      dragon: 'bg-purple-500',
      dark: 'bg-gray-800',
      fairy: 'bg-pink-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-600',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      bug: 'bg-green-400',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      steel: 'bg-gray-500',
      normal: 'bg-gray-400'
    }
    return colors[typeName] || 'bg-gray-400'
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Pokémon Browser</h1>
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  const pokemonToDisplay = filteredPokemon.length > 0 ? filteredPokemon: pokemon

  return (
    <div className="container mx-auto p-4">
      
      <h1 className="text-3xl font-bold mb-6 text-center">Pokémon Browser</h1>
      <h2 className="text-l mb-6 text-center"> Search and find Pokémon</h2>

      <div className="mb-6 max-w-md mx-auto">
      <Input 
        placeholder="Find Pokémon" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <Button
        onClick={searchForPokemon}
        disabled={isSearching}
        variant='default'
      >
         {isSearching ? "Searching..." : "Search"}
      </Button>
      </div>

      <div className="mb-4">
        {hasSearched && filteredPokemon.length > 0 ? (
          <h3 className="text-xl font-semibold">
            Search Results for '{lastSearchTerm}'
            {filteredPokemon.length === 20 && " (showing first 20 results)"}
          </h3>
        ) : hasSearched && filteredPokemon.length === 0 && !isSearching ? (
          <h3 className="text-xl font-semibold">
            No Pokémon found for "{lastSearchTerm}"
          </h3>
        ) : (
          <h3 className="text-xl font-semibold">Explore Pokémon</h3>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {pokemonToDisplay.map((poke) => {
          const pokeId = extractPokemonId(poke.url)
          return (
            <Link key={poke.name} href={`/pokemon/${pokeId}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                {poke.loading ? (
                  <>
                    <CardHeader>
                      <CardTitle className="capitalize">{poke.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500">Opening Pokéball...</div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-3">
                      {poke.sprite && (
                        <img src={poke.sprite} alt={poke.name} className="w-20 h-20" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold capitalize mb-2">{poke.name}</h3>
                    <p className="text-sm font-medium ">ID: #{formatPokemonId(poke.id)}</p>
                    <div className="flex gap-1 mt-2 flex-wrap ">
                      {poke.type.map((type, index) => (
                        <span 
                          key={index}
                          className={`px-2 py-1 text-xs text-white rounded-full capitalize ${getTypeColor(type.type.name)}`}
                        >
                          {type.type.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <Button 
          onClick={handlePrevious} 
          disabled={!prevUrl}
          variant="outline"
        >
          Previous
        </Button>
        
        <Button 
          onClick={handleNext} 
          disabled={!nextUrl}
          variant="outline"
        >
          Next
        </Button>
      </div>

      <div className="text-l mb-6 text-center py-25">
        Thank you for using Pokémon Browser!
      </div>
    </div>
  )
}