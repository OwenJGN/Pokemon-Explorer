'use client'

import { use } from 'react'
import HomeButton from '@/components/common/HomeButton'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Separator from '@/components/layout/Separator'
import Footer from '@/components/layout/Footer'
import PokemonDetailHeader from '@/components/layout/DetailsPage/Header'
import PokemonDetailImage from '@/components/layout/DetailsPage/PokemonImage'
import PokemonDetailDescription from '@/components/pokemon/PokemonDescription'
import PokemonDetailStats from '@/components/pokemon/PokemonStats'
import { usePokemonDetail } from '@/hooks/usePokemonDetail'
import { Inter } from 'next/font/google'

// Configure Inter font to match Figma styling
const inter = Inter({
    subsets: ['latin'],
    weight: ['600'], 
    variable: '--font-inter',
  })
  
  // Define the expected props structure for this page component
  interface PageProps {
    params: Promise<{
      id: string
    }>
  }
  
  export default function PokemonDetailPage({ params }: PageProps) {
    // Extract the Pokemon ID from URL parameters using React's `use` hook
    const useParams = use(params)
    const pokeId = useParams.id
  
    // Main hook for fetching detailed Pokemon data including species information
    const {
      pokemon,
      description,
      category,
      gender,
      weaknesses,
      loading,
      error
    } = usePokemonDetail(pokeId)
  
    // Loading state - show spinner while fetching Pokemon data
    if (loading) {
      return (
        <div className={`${inter.className} min-h-screen flex flex-col bg-white`}>
          <PokemonDetailHeader />
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
          <HomeButton />
          <Separator />
          <Footer />
        </div>
      )
    }
  
    // Error state - display error message if Pokemon fetch fails
    if (error) {
      return (
        <div className={`${inter.className} min-h-screen flex flex-col bg-white`}>
          <PokemonDetailHeader />
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Error: {error}</h1>
          </div>
          <HomeButton />
          <Separator />
          <Footer />
        </div>
      )
    }
  
    // No Pokemon found state - handles cases where ID doesn't match any Pokemon
    if (!pokemon) {
      return (
        <div className={`${inter.className} min-h-screen flex flex-col bg-white`}>
          <PokemonDetailHeader />
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">No Pokémon found</h1>
          </div>
          <HomeButton />
          <Separator />
          <Footer />
        </div>
      )
    }
  
    // Main content render - displays complete Pokemon detail information
    return (
      <div className={`${inter.className} min-h-screen flex flex-col bg-white`}>

        {/* Simple header showing app title */}
        <PokemonDetailHeader />
        
        {/* Large Pokemon image with circular background and Pokemon name/ID */}
        <PokemonDetailImage pokemon={pokemon} />
        
        {/* Main content area with description and detailed stats */}
        <div className="max-w-10xl mx-auto px-6 pb-8 flex-1 justify-center">

          {/* Pokemon description text with pokeball icon */}
          <PokemonDetailDescription 
            description={description}
           />
          
          {/* Comprehensive stats display including height, weight, type, abilities, and base stats */}
          <PokemonDetailStats 
            pokemon={pokemon}
            category={category}
            gender={gender}
            weaknesses={weaknesses}
          />
  
          {/* Navigation back to homepage */}
          <HomeButton/>
        </div>
        
        <Separator />
        <Footer />
      </div>
    )
  }