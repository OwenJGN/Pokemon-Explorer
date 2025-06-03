'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Pokemon {
  name: string
  url: string
}

interface PokemonResponse {
  results: Pokemon[]
  next: string | null
  previous: string | null
}

export default function HomePage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUrl, setCurrentUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20')
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [prevUrl, setPrevUrl] = useState<string | null>(null)

  const fetchPokemon = async (url: string) => {
    setLoading(true)
    try {
      const response = await fetch(url)
      const data: PokemonResponse = await response.json()
      
      setPokemon(data.results)
      setNextUrl(data.next)
      setPrevUrl(data.previous)
    } catch (error) {
      console.error('Error fetching Pokemon:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPokemon(currentUrl)
  }, [currentUrl])

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

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Pokémon Explorer</h1>
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Pokémon Explorer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {pokemon.map((poke) => (
          <Card key={poke.name} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="capitalize">{poke.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Click to view details</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center">
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
    </div>
  )
}