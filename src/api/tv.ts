import type { SearchResult } from '../types'
import queryBackendSearch from './search'

async function queryTV(query: string): Promise<SearchResult[]> {
  return await queryBackendSearch('tv/search', query)
}

export default queryTV
