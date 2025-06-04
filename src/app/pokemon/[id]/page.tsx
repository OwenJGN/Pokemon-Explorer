'use client'

import { useState, useEffect, use } from 'react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

interface PokemonType {
  type: {
    name: string
  }
}

interface PokemonStat {
  base_stat: number
  stat: {
    name: string
  }
}

interface PokemonAbility {
  ability: {
    name: string
  }
}

interface PokemonDetail {
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

export default function DisplayDetails({params}: PageProps){
    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const useParams = use(params)
    const pokeId = useParams.id
    const fetchPokemonDetail = async () =>{
        setLoading(true)

        try{
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`)

            if(!response.ok){
                throw new Error('Pokémon not found')
            }
            const data: PokemonDetail = await response.json();
            setPokemon(data)
        
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch Pokémon')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPokemonDetail() 
    }, [pokeId])

    if (loading) {
        return <div>Loading Pokemon details...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!pokemon) {
        return <div>No Pokemon found</div>
    }

    const formatPokemonId = (id: number) => {
        return id.toString().padStart(4, '0')
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Pokemon Details</h1>
            
            <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
                <h2>Basic Information</h2>
                <p><strong>#</strong> {formatPokemonId(pokemon.id)}</p>
                <p><strong>Name:</strong> {pokemon.name}</p>
                <p><strong>Height:</strong> {pokemon.height / 10} meters</p>
                <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
                <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>
            </div>

            <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
                <h2>Pokemon Image</h2>
                {pokemon.sprites.front_default ? (
                    <img 
                        src={pokemon.sprites.front_default} 
                        alt={pokemon.name}
                        style={{ width: '150px', height: '150px' }}
                    />
                ) : (
                    <p>No image available</p>
                )}
            </div>

            <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
                <h2>Types</h2>
                {pokemon.types.length > 0 ? (
                    <ul>
                        {pokemon.types.map((typeInfo, index) => (
                            <li key={index}>
                                <strong>Type {index + 1}:</strong> {typeInfo.type.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No types found</p>
                )}
            </div>

            <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
                <h2>Abilities</h2>
                {pokemon.abilities.length > 0 ? (
                    <ul>
                        {pokemon.abilities.map((abilityInfo, index) => (
                            <li key={index}>
                                <strong>Ability {index + 1}:</strong> {abilityInfo.ability.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No abilities found</p>
                )}
            </div>

            <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
                <h2>Base Stats</h2>
                {pokemon.stats.length > 0 ? (
                    <div>
                        {pokemon.stats.map((statInfo, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <p>
                                    <strong>{statInfo.stat.name}:</strong> {statInfo.base_stat}
                                </p>
                                <div style={{ 
                                    background: '#f0f0f0', 
                                    width: '200px', 
                                    height: '20px', 
                                    position: 'relative' 
                                }}>
                                    <div style={{ 
                                        background: '#4CAF50', 
                                        height: '100%', 
                                        width: `${(statInfo.base_stat / 200) * 100}%` 
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No stats found</p>
                )}
            </div>
        </div>
    )
}