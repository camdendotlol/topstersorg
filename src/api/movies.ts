import type { SearchResult } from '../types'
import queryBackendSearch from './search'

async function queryMovies(query: string): Promise<SearchResult[]> {
  return await queryBackendSearch('movies/search', query)
}

export default queryMovies
