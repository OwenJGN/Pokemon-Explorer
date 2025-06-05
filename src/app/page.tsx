'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['600'], 
  variable: '--font-inter',
});

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
  const [currentUrl, setCurrentUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=12')
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

      const limitedMatches = matchingNames.slice(0, 12)

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
    return 'bg-gray-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
              <h1 className="text-3xl font-bold mb-6 text-center">Pokémon Browser</h1>
              <LoadingSpinner size="lg" />
          </div>
        </div>

        {/* Separator */}
        <div className="py-8">
          <div className="w-full h-px bg-gray-300"></div>
        </div>
        
        {/* Body */}
        <div className="flex-1 min-h-96"></div>
        
        {/* Separator - 194px */}
        <div className="py-8">
          <div className="w-full h-px bg-gray-300"></div>
        </div>
        
        
        {/* Footer - 244px */}
        <div className="py-16 text-center">
          <p>Thank you for using Pokémon Browser!</p>
        </div>
      </div>
    )
  }

  const pokemonToDisplay = filteredPokemon.length > 0 ? filteredPokemon: pokemon

  return (
      <div className={'${inter.className} min-h-screen flex flex-col mx-auto bg-white max-w-full'}>
      
      {/* Header Section*/}
      <div
        className="flex flex-col items-center justify-center py-16">
        <h1 className="text-4xl md:text-6xl font-semibold text-center mb-4">
          Pokémon Browser
        </h1>
        <h2 className="text-xl md:text-3xl font-semibold text-center text-zinc-500"> 
          Search and find Pokémon
        </h2>
      </div>

      {/* First Separator */}
      <div className="py-8">
        <div className="w-full h-px bg-gray-300"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8">

        {/* Search Section and Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full max-w-6xl mb-8 gap-4">
          <div className="flex-1">
            {hasSearched && filteredPokemon.length > 0 ? (
              <h3 className="text-xl font-semibold">
                Search Results for '{lastSearchTerm}'
                {filteredPokemon.length === 12 && " (showing first 12 results)"}
              </h3>
            ) : hasSearched && filteredPokemon.length === 0 && !isSearching ? (
              <h3 className="text-xl font-semibold">
                No Pokémon found for "{lastSearchTerm}"
              </h3>
            ) : (
              <h3 className="text-xl font-semibold">Explore Pokémon</h3>
            )}
          </div>
        
        <div className="flex gap-2 w-full sm:w-auto min-w-0 sm:min-w-80">        
          <Input 
            placeholder="Find Pokémon" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={searchForPokemon}
            disabled={isSearching}
            variant='default'
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
          </div>
        </div>
      
      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-8">
        {pokemonToDisplay.map((poke) => {
          const pokeId = extractPokemonId(poke.url)
          return (
            <Link key={poke.name} href={`/pokemon/${pokeId}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow w-full h-full">
                {poke.loading ? (
                  <>
                    <CardHeader>
                      <CardTitle className="capitalize text-sm">{poke.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-gray-500">Opening Pokéball...</div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="pt-4 px-3 pb-3 h-full flex flex-col">
                    <div 
                      className="flex justify-center mb-3 bg-zinc-100"
                      style={{ minHeight: '200px' }}
                    >
                      {poke.sprite && (
                        <img src={poke.sprite} 
                        alt={poke.name} 
                        className="object contain" 
                        style={{ width: '18.47vw', height: '15.56vw' }}
                        />
                      )}
                    </div>
                    <h3 className="text-lg font-bold capitalize mb-1">{poke.name}</h3>
                    <p className="text-xs font-medium mb-2">ID: #{formatPokemonId(poke.id)}</p>
                    <div className="flex gap-1 flex-wrap mt-auto">
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

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <Button 
            onClick={handlePrevious} 
            disabled={!prevUrl}
            variant="default"
            className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            &#8592; Back
          </Button>
          
          <Button 
            onClick={handleNext} 
            disabled={!nextUrl}
            variant="default"
            className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            Next &#8594;
          </Button>
        </div>
      </div>

      {/* Second Separator - 194px */}
      <div className="py-8">
        <div className="w-full h-px bg-gray-300"></div>
      </div>

      {/* Footer Section - 244px height */}
      <div className="py-16 text-center">
        <p className="text-lg">Thank you for using Pokémon Browser!</p>
      </div>
    </div>
  )
}