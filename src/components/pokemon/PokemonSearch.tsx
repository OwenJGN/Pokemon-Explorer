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
  totalResults?: number
  currentPage?: number
  totalPages?: number
}

/**
 * Search interface component 
 * Provides real-time search functionality for finding specific Pokemon with pagination info
 */
const PokemonSearch = ({
  searchTerm,
  onSearchTermChange,
  onSearch,
  isSearching,
  hasSearched,
  lastSearchTerm,
  resultCount,
  totalResults,
  currentPage,
  totalPages
}: PokemonSearchProps) => {
  
  /**
   * Dynamic title generation based on current search state
   * Provides feedback about search results with pagination info
   */
  const getTitle = () => {
    
    // Show search results with pagination info
    if (hasSearched && resultCount > 0 && totalResults  && currentPage && totalPages) {
      if(resultCount === 1){
        return `Search Results for '${lastSearchTerm}'`
      }
      return `Search Results for '${lastSearchTerm}' (${totalResults} total results - Page ${currentPage} of ${totalPages})`
    }
    // Show no results message for unsuccessful searches
    if (hasSearched && resultCount === 0 && !isSearching) {
      return `No Pokémon found for "${lastSearchTerm}"`
    }
    // Default browse mode title
    return "Explore Pokémon"
  }

  return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full max-w-6xl mb-8 gap-4">
        {/* Dynamic title section showing current context */}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold">{getTitle()}</h3>
        </div>
      
        {/* Search input and button section */}
        <div className="flex gap-2 w-full sm:w-auto min-w-0 sm:min-w-80">        
          <Input 
            placeholder="Find Pokémon" 
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="flex-1"
          />

          {/* Search button with loading state feedback */}
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