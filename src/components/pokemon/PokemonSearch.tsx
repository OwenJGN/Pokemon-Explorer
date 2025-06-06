import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PokemonSearchProps {
  searchTerm: string
  onSearchTermChange: (term: string) => void
  onSearch: () => void
  isSearching: boolean
  hasSearched: boolean
  lastSearchTerm: string
  resultCount: number
  maxResults: number
}

const PokemonSearch = ({
  searchTerm,
  onSearchTermChange,
  onSearch,
  isSearching,
  hasSearched,
  lastSearchTerm,
  resultCount,
  maxResults
}: PokemonSearchProps) => {
  const getTitle = () => {
    if (hasSearched && resultCount > 0) {
      return `Search Results for '${lastSearchTerm}'${resultCount === maxResults ? ` (showing first ${maxResults} results)` : ''}`
    }
    if (hasSearched && resultCount === 0 && !isSearching) {
      return `No Pokémon found for "${lastSearchTerm}"`
    }
    return "Explore Pokémon"
  }

  return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full max-w-6xl mb-8 gap-4">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold">{getTitle()}</h3>
        </div>
      
        <div className="flex gap-2 w-full sm:w-auto min-w-0 sm:min-w-80">        
          <Input 
            placeholder="Find Pokémon" 
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={onSearch}
            disabled={isSearching}
            variant='default'
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>
  )
}

export default PokemonSearch