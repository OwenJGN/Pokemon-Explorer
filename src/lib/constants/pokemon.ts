/**
 * Pokemon API configuration constants
 */

/** Base URL for all Pokemon API requests */
export const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2'

/** Number of Pokemon to display per page in the main grid */
export const POKEMON_PER_PAGE = 12

/** Maximum number of search results to display to prevent UI overload */
export const MAX_SEARCH_RESULTS = 12

/** 
 * Limit for fetching all Pokemon names for search functionality
 * Set high enough to include all current Pokemon 
 */
export const ALL_POKEMON_LIMIT = 2000