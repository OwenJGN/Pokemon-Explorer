# Pokémon Explorer Application

A responsive Next.js application that fetches data from the PokéAPI and displays it in an intuitive interface following a specific Figma design. Users can browse through Pokémon lists, search for specific Pokémon by name, and view  detailed information about each Pokémon.
## Project Setup & Running Instructions

### Prerequisites
- **Node.js**: Version 16.8 or higher (required for Next.js 14+)
- **Package Manager**: npm (comes with Node.js) or yarn
- **Browser**: Modern browser with JavaScript enabled

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/OwenJGN/Pokemon-Explorer.git
   cd pokemon-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or if you prefer yarn
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser
   
## Design and Component Decisions

### Component Architecture
The application follows a component structure with clear separation of concerns and single responsibility principles:

#### **Layout Components** (`/components/layout/`)
- **Header.tsx**: Reusable page header with configurable title and subtitle 
- **Footer.tsx**: Simple footer component with customisable messaging
- **Separator.tsx**: Visual spacing component for section division
- **DetailsPage/**: Specialised layout components for the Pokémon detail view
  - **Header.tsx**: Simplified header for detail pages matching the Figma design
  - **PokemonImage.tsx**: Hero section with circular image container and overlapping layout

#### **Pokémon Components** (`/components/pokemon/`)
- **PokemonCard.tsx**: Individual card component with hover states and navigation
- **PokemonGrid.tsx**: Responsive grid layout that adapts from 1-4 columns based on screen size
- **PokemonSearch.tsx**: Search interface with title generation and result context
- **PokemonStats.tsx**: Complex stats display with progress bars and organised sections
- **PokemonDescription.tsx**: Description card with decorative Pokéball icon

#### **Common/Utility Components** (`/components/common/`)
- **LoadingSpinner.tsx**: Configurable spinner 
- **NavigationButtons.tsx**: Pagination controls with disabled state handling
- **HomeButton.tsx**: Consistent navigation back to homepage
- **PokemonCardSkeleton.tsx**: Skeleton loading state that exactly matches card layout

#### **Custom Hooks** (`/hooks/`)
- **usePokemon.ts**: Core data fetching and pagination logic
- **usePokemonDetail.ts**: Detailed Pokémon data coordination
- **usePokemonSearch.ts**: Search functionality with pagination

I think that these design choices best follow best practices to the extent that I know it.

### shadcn/ui Component Selection Rationale

I selected shadcn/ui components based on their alignment with the Figma design requirements:

#### **Card Components**
- **Why chosen**: The Figma design shows clear card based layouts with shadows and rounded corners
- **Implementation**: Used for both Pokémon cards and detail page sections
- **Customisation**: Extended with custom styling for the grey background in description sections

#### **Button Components**
- **Why chosen**: Provided the exact styling patterns needed (black backgrounds, hover states, disabled states)
- **Variants used**: 
  - `default` for primary actions (Next/Previous, Search)
  - `ghost` for subtle interactions
  - Custom styling for specific design requirements

#### **Input Components**
- **Why chosen**: Clean input styling that matches the search field in Figma
- **Features**: Built in focus states, placeholder styling, and responsive design

#### **Skeleton Components**
- **Why chosen**: Enables smooth loading transitions whilst maintaining layout 
- **Implementation**: Custom skeleton that exactly mirrors the PokemonCard layout

### Design Interpretations and Decisions

#### **Typography Choices**
- **Primary Font**: Inter at 600 weight to match the Figma design
- **Font Hierarchy**: Careful sizing from 4xl headers down to sm badge text

#### **Colour Palette Implementation**
- **Background**: Clean white (#FFFFFF) as specified in Figma
- **Cards**: Light grey (#F5F4F4) for description cards
- **Type Badges**: Dark backgrounds (#18181B, #181A1B) with special handling for poison/grass types
- **Interactive Elements**: Black (#000000) for primary actions with hover states

#### **Responsive Design Strategy**
- **Mobile First**: Started with single column layouts and expanded upward
- **Breakpoints**: Utilised Tailwind's responsive prefixes (sm:, md:, lg:)
- **Detail Pages**: Maintained readability across all screen sizes with flexible layouts

All of the design decisions were based on the Figma and I think that it adheres almost perfectly to the design given, even looking at small details like spacing between elements.

## State Management Approach

### Architecture
I chose a pragmatic state management approach that scales with the application's complexity whilst avoiding over engineering:

#### **Local State with useState**
```typescript
// Simple component state for UI interactions
const [searchTerm, setSearchTerm] = useState('')
const [loading, setLoading] = useState(true)
const [currentUrl, setCurrentUrl] = useState(initialUrl)
```

**Reason**: For straightforward states like form inputs, loading flags, and UI toggles, React's built in useState provides performance and simplicity.

#### **Custom Hooks for Complex Logic**
```typescript
// Encapsulating related state and logic
export const usePokemon = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  // ... coordinated state management
}
```

**Benefits**:
- **Separation of Concerns**: Logic separated from UI components
- **Reusability**: Hooks can be shared across components
- **Testing**: Logic can be tested independently of UI
- **Readability**: Components focus purely on rendering

#### **State Organisation Strategy**

**Global Application State**:
- `allPokemonNames`: Fetched once and shared across components for search
- Navigation URLs: Managed centrally for consistent pagination

**Feature Specific State**:
- Search results and pagination: Contained within `usePokemonSearch`
- Detail view data: Isolated in `usePokemonDetail`
- Main list data: Managed by `usePokemon`

**Component Level State**:
- Form inputs, modal states, temporary UI flags

### Why Not Redux?
Given the application's scope, additional state management libraries would introduce unnecessary complexity. The current approach provides:
- **Performance**: No unnecessary re-renders or complex subscriptions
- **Simplicity**: Easy to understand and maintain
- **Bundle Size**: No additional dependencies
- **Type Safety**: Full TypeScript integration without extra configuration

## API Interaction Strategy

### Multi-Layered Architecture
I designed a robust API interaction system that handles the PokéAPI's data structure:

#### **Layer 1: Pure API Functions** (`/lib/api/pokemon.ts`)
```typescript
export const fetchPokemonDetail = async (pokemonId: string): Promise<PokemonDetail> => {
  const response = await fetch(`${POKEMON_API_BASE_URL}/pokemon/${pokemonId}`)
  if (!response.ok) {
    throw new Error('Pokémon not found')
  }
  return response.json()
}
```

**Responsibilities**:
- Raw HTTP requests with error handling
- Data transformation and validation
- URL construction and ID extraction
- Response format standardisation

#### **Layer 2: Custom Hooks** (State Management)
```typescript
export const usePokemonDetail = (pokemonId: string) => {
  // Coordinates multiple API calls
  // Manages loading and error states
  // Processes and combines data from different endpoints
}
```

**Responsibilities**:
- Orchestrating multiple API calls
- Managing async state transitions
- Error boundary implementation
- Data combining and processing

#### **Layer 3: Components** (UI Integration)
Components consume hooks and handle presentation logic without direct API interaction.

### Key Design Decisions

#### **Optimistic Loading Strategy**
```typescript
// Show skeleton cards immediately
const initialPokemon: Pokemon[] = data.results.map(poke => ({
  name: poke.name,
  id: parseInt(poke.url.split('/').slice(-2, -1)[0]),
  type: [],
  sprite: '',
  loading: true, // Enable skeleton display
  url: poke.url
}))

// Then fetch detailed data
const detailedPokemon = await Promise.all(detailedPokemonPromises)
```

**Benefits**:
- Immediate visual feedback
- Perceived performance improvement
- Layout stability during loading

#### **Parallel Request Processing**
```typescript
const detailedPokemonPromises = data.results.map(poke => 
  createPokemonFromDetails(poke.url)
)
const detailedPokemon = await Promise.all(detailedPokemonPromises)
```

**Advantages**:
- Multiple Pokémon details fetched simultaneously
- Reduced total loading time
- Better user experience

#### **Error Handling Strategy**
- **Graceful Degradation**: Failed individual Pokémon requests don't break the entire page
- **Fallback Data**: Provide basic information even when detailed fetches fail
- **User Feedback**: Clear error messages without technical jargon
- **Retry Logic**: Implicit retry through user navigation

### API Endpoints Utilised

1. **`/pokemon?limit=12&offset=X`** - Paginated Pokémon lists for main browsing
2. **`/pokemon/{id}`** - Individual Pokémon details (stats, types, abilities, sprites)
3. **`/pokemon-species/{id}`** - Species information (descriptions, categories, gender rates)
4. **`/pokemon?limit=2000`** - Complete name list for search functionality

### Data Transformation Pipeline
```typescript
// Raw API data → Standardised interface → UI-ready format
PokéAPI Response → Pokemon interface → Rendered component
```

This ensures consistent data shapes throughout the application and isolates components from API changes.

## Challenges Encountered & Solutions

### Challenge 1: Learning Next.js/React and (Type/Java)script
**Problem**: Although had a good base knowledge of javascript, I hadn't used it much before only for building simple web applications. Addtionally I had never used Next.js or React before so that also took a bit of learning.

**Solution**: To try with what I do know and when I reach a barrier I look it up in the documentation or a youtube tutorial, which helped me build on my knowledge through out and I wasn't overwhelemed with information.

**Result**: A responsive, efficient applicaton that adheres to the Figma and uses the best practices.

### Challenge 2: Complex Data Structure Coordination
**Problem**: The PokéAPI's architecture splits Pokémon information across multiple endpoints. Basic details (stats, types, sprites) are in `/pokemon/{id}`, whilst descriptions, categories, and gender information are in `/pokemon-species/{id}`. The species endpoint URL is only available after fetching the basic data, creating a chain. Additionally, some data requires processing (gender rates are numeric codes, descriptions contain formatting characters).

**Technical Details**: 
- Gender rates are expressed as eighths (-1 for genderless, 0 for male-only, 8 for female-only)
- Descriptions contain `\f` form feed characters that need cleaning
- Species URLs are dynamic and can't be predicted

**Solution Implementation**:
```typescript
export const usePokemonDetail = (pokemonId: string) => {
  const fetchPokemonData = async () => {
    try {
      // Step 1: Fetch basic Pokémon data
      const pokemonData = await fetchPokemonDetail(pokemonId)
      setPokemon(pokemonData)

      // Step 2: Use species URL from basic data
      const speciesData = await fetchPokemonSpecies(pokemonData.species.url)
      processSpeciesData(speciesData)

      // Step 3: Calculate derived data
      const calculatedWeaknesses = getWeaknessTypes(pokemonData.types)
      setWeaknesses(calculatedWeaknesses)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch Pokémon')
    }
  }
}
```

**Result**: A user experience where all related data appears together, despite being sourced from multiple API endpoints.

### Challenge 3: Search Performance with Large Datasets
**Problem**: The PokéAPI contains over 1000 Pokémon, and implementing real-time search presented several performance challenges:
- Fetching all Pokémon details upfront would require 1000+ API calls
- Real time filtering needed to be instantaneous
- Search results needed pagination to remain manageable

**Solution Architecture**:
```typescript
// Phase 1: Lightweight name fetching
const fetchAllPokemonNames = async (): Promise<SimplePokemon[]> => {
  const response = await fetch(`${POKEMON_API_BASE_URL}/pokemon?limit=2000`)
  return response.data.results // Only names and URLs
}

// Phase 2: Client side filtering
const searchForPokemon = async () => {
  const matchingNames = allPokemonNames.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Phase 3: Paginated detail fetching
  const startIndex = currentPage * POKEMON_PER_PAGE
  const pageResults = matchingNames.slice(startIndex, startIndex + POKEMON_PER_PAGE)
  
  const detailedPokemon = await Promise.all(
    pageResults.map(pokemon => createPokemonFromDetails(pokemon.url))
  )
}
```

**Performance Optimisations**:
- **Single bulk fetch**: All names loaded once on app initialisation
- **Instant filtering**: Client side search through cached names
- **Lazy loading**: Only fetch details for visible results
- **Pagination**: Limit concurrent API calls

**Result**: Search feels instantaneous whilst maintaining efficient resource usage.

## Bonus Feature Implementation

### Loading State Indicators

#### **Skeleton Loading System**
- **Implementation**: Custom skeleton components that exactly match the final content layout
- **Behaviour**: Instant display preventing layout shifts, smooth transition to real content
- **User Benefit**: Perceived performance improvement and visual stability

#### **Multi-Level Loading States**
```typescript
// Page-level loading for initial loads
if (loading) return <LoadingSpinner size="lg" />

// Component-level loading for individual cards
if (pokemon.loading) return <PokemonCardSkeleton />

// Search-specific loading with context
{isSearching ? "Searching..." : "Search"}
```

#### **Progress Indication**
- **Search Loading**: Button text changes and disabled state during search operations
- **Navigation Loading**: Disabled states on pagination buttons during transitions
- **Detail Loading**: Full page spinner with error boundaries

### Pokémon Images

#### **Sprite Integration Strategy**
- **Source**: Official sprites from PokéAPI (`sprites.front_default`)
- **Optimisation**: Proper sizing and `object-contain` for consistent display
- **Performance**: Images loaded as part of the progressive loading strategy

#### **Fallback Handling**
```typescript
{pokemon.sprites.front_default ? (
  <img 
    src={pokemon.sprites.front_default} 
    alt={pokemon.name}
    className="w-50 h-50 object-contain"
  />
) : (
  <div className="w-36 h-36 bg-gray-200 rounded-full"></div>
)}
```

#### **Visual Design Integration**
- **Card Layout**: Images properly sized within the grey header section
- **Detail Pages**: Large circular containers with shadow effects matching Figma
- **Responsive**: Images scale appropriately across device sizes

### Search Functionality

#### **Real-Time Search Implementation**
```typescript
const searchForPokemon = async () => {
  // Instant client-side filtering
  const matchingNames = allPokemonNames.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Progressive result loading
  await loadSearchPage(matchingNames, 0)
}
```

#### **Search Result Pagination**
- **Performance**: Large result sets broken into manageable pages
- **Context**: Clear indication of result count and current page
- **Navigation**: Same pagination controls work for both browse and search modes

#### **Search Performance Considerations (Debouncing etc.)**
- **Button-Triggered Search Design**: Following the Figma specification, search is executed via button click rather than real time typing, eliminating the need for debouncing whilst giving users explicit control over search execution
- **Memory Management**: Maintaining 2000+ Pokémon names in memory (~50KB) vs repeated API calls for each search operation
  
#### **Search State Management**
- **History**: Maintains last search term for result context
- **URL Persistence**: Could be extended to maintain search state in URL

#### **User Experience Features**
- **Partial Matching**: Supports substring matching (e.g., "char" finds "Charmander")
- **Instant Feedback**: Immediate response to search button clicks
- **Clear Results**: Distinct display for search results vs. browse mode

### Additional Enhancements

#### **Type Weakness Calculation**
```typescript
export const getWeaknessTypes = (types: PokemonType[]): string[] => {
  const weaknessMap: { [key: string]: string[] } = {
    grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
    fire: ['water', 'ground', 'rock'],
    // ... comprehensive type chart
  }
  
  const allWeaknesses = new Set<string>()
  types.forEach(type => {
    weaknessMap[type.type.name]?.forEach(weakness => 
      allWeaknesses.add(weakness)
    )
  })
  
  return Array.from(allWeaknesses).slice(0, 4)
}
```

#### **Error Handling & User Feedback**
- **API Errors**: Graceful degradation with user friendly messages
- **Network Issues**: Proper error boundaries and retry capabilities
- **Missing Data**: Fallback content for incomplete API responses
- **404 Handling**: Clear messaging for non-existent Pokémon IDs

## Self-Reflection & Potential Improvements

### What I'm Most Proud Of

#### **UI Design**
The UI design has been extremely scrutinised based on the Figma and because of this it has come out with a UI design that perfectly matches the design. I am most proud of this because I was going very into deatil with how the final UI should look (e.g., using the correct fonts, making sure the colour are the exact hex colours, making sure the spacing between elements are exactly the same).

### **Learning Curve
During this task I had a big learning curve to overcome (with React, Next.js etc) but I was in the end able to produce an efficient and responsive application using all of my knowledge and leveraging the tools I had (Documentation, Youtube, Code Academy etc) when I was stuck on a problem.

#### **Search Architecture**
The search implementation represents the most sophisticated technical achievement in this project. The challenge was creating a search experience that feels instant whilst handling a dataset of 1000+ Pokémon efficiently.

**Technical Excellence**:
- **Hybrid Approach**: Client side filtering for speed, server side detail fetching for accuracy
- **Performance Optimisation**: Single bulk name fetch followed by paginated detail loading

**Code Quality**:
```typescript
// Clean separation of concerns
const { searchTerm, filteredPokemon, handleSearchNext } = usePokemonSearch(allPokemonNames)

// Reusable components
<NavigationButtons
  onNext={isInSearchMode ? handleSearchNext : handleNext}
  hasNext={isInSearchMode ? hasNextPage : !!nextUrl}
/>
```

#### **Progressive Loading System**
The skeleton loading implementation demonstrates attention to user experience details. Rather than showing empty states or generic spinners, the application maintains visual continuity throughout the loading process.

#### **Overall
I am proud of the final product and will be extending this application beyond the requirements of this task in the future, knowing I have a lot more knowledge of the frameworks and Typescript from this.

### Given More Time, I Would Implement...

#### **1. Advanced Search & Filtering**

**Features**:
- Multi type filtering with AND/OR logic
- Stat range sliders
- Generation based filtering
- Saved search presets

#### **2. Progressive Web App Features**

**Capabilities**:
- Offline browsing of previously viewed Pokémon
- Home screen installation
- Background sync for favourites
- Push notifications for new features

#### **3. Comprehensive Testing**
```typescript
// Unit tests for utilities
describe('formatPokemonId', () => {
  it('should format single digit IDs with leading zeros', () => {
    expect(formatPokemonId(1)).toBe('#0001')
  })
})

// Integration tests for hooks
renderHook(() => usePokemonSearch(mockPokemonNames))

// E2E tests for user flows
test('user can search for and view Pokémon details', async () => {
  // ... Cypress/Playwright test
})
```

#### **4. Data Persistence Layer**
```typescript
// Favourites system with localStorage
const useFavourites = () => {
  const [favourites, setFavourites] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('pokemon-favourites') || '[]')
  )
  
  const toggleFavourite = (pokemonId: string) => {
    const updated = favourites.includes(pokemonId)
      ? favourites.filter(id => id !== pokemonId)
      : [...favourites, pokemonId]
    
    setFavourites(updated)
    localStorage.setItem('pokemon-favourites', JSON.stringify(updated))
  }
}
```

### Architecture Scalability
The current implementation provides an excellent foundation for these enhancements:

- **Modular Components**: Easy to extend without breaking existing functionality
- **Custom Hooks**: New features can be added as additional hooks
- **Type Safety**: TypeScript ensures safe refactoring and feature additions
- **API Layer**: Abstracted to accommodate new endpoints or caching strategies

The codebase demonstrates production ready patterns that scale well feature expansion whilst maintaining code quality and user experience standards.

## Technical Stack & Dependencies

### Core Technologies
- **Framework**: Next.js 14+ with App Router (React 18+)
- **Language**: TypeScript 5+ 
- **Styling**: Tailwind CSS 3+ 
- **UI Components**: shadcn/ui 
- **Icons**: Lucide React 

### API Integration
- **Fetch API**: Native browser fetch for HTTP requests
- **PokéAPI**: RESTful API providing comprehensive Pokémon data
- **Error Handling**: Custom error boundaries and fallback states
