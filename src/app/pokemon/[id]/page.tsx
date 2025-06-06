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

const inter = Inter({
    subsets: ['latin'],
    weight: ['600'], 
    variable: '--font-inter',
  })
  
  interface PageProps {
    params: Promise<{
      id: string
    }>
  }
  
  export default function PokemonDetailPage({ params }: PageProps) {
    const useParams = use(params)
    const pokeId = useParams.id
  
    const {
      pokemon,
      description,
      category,
      gender,
      weaknesses,
      loading,
      error
    } = usePokemonDetail(pokeId)
  
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
  
    return (
      <div className={`${inter.className} min-h-screen flex flex-col bg-white`}>
        <PokemonDetailHeader />
        
        <PokemonDetailImage pokemon={pokemon} />
        
        <div className="max-w-10xl mx-auto px-6 pb-8 flex-1 justify-center">
          <PokemonDetailDescription 
            description={description}
           />
          
          <PokemonDetailStats 
            pokemon={pokemon}
            category={category}
            gender={gender}
            weaknesses={weaknesses}
          />
  
          <HomeButton/>
        </div>
        
        <Separator />
        <Footer />
      </div>
    )
  }