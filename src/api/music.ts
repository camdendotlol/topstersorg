import type { Period, SearchResult } from '../types'
import { errorMessages } from './errors'
import queryBackendSearch from './search'

async function queryMusic(query: string): Promise<SearchResult[]> {
  return await queryBackendSearch('music/search', query)
}

export async function getUserTopMusic(username: string, period?: Period): Promise<SearchResult[]> {
  if (username === '') {
    return []
  }

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/music/user/top?${new URLSearchParams({
      user: username,
      period: period ?? '',
    })}`,
  )

  if (!res) {
    throw new Error(errorMessages.NoConnection)
  }

  if (res.status !== 200) {
    throw new Error(errorMessages.BadStatusCode)
  }

  return await res.json()
}

export default queryMusic
