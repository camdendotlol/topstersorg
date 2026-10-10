import type { SearchResult } from '../types'
import { errorMessages } from './errors'

async function queryBackendSearch(path: string, query: string): Promise<SearchResult[]> {
  if (query === '') {
    return []
  }

  const encodedQuery = encodeURIComponent(query)

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${path}/${encodedQuery}`)

  if (!res) {
    throw new Error(errorMessages.NoConnection)
  }

  if (res.status !== 200) {
    throw new Error(errorMessages.BadStatusCode)
  }

  return await res.json()
}

export default queryBackendSearch
