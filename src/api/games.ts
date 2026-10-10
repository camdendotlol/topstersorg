import type { SearchResult } from '../types'
import queryBackendSearch from './search'

async function queryGames(query: string): Promise<SearchResult[]> {
  return await queryBackendSearch('games/search', query)
}

export default queryGames
