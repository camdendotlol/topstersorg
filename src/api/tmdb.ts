import { errorMessages } from './errors'
import type { MovieResult, TVResult } from '../types'

async function queryTmdb(url: string): Promise<Array<MovieResult | TVResult>> {
  const res = await fetch(url)

  if (!res) {
    throw new Error(errorMessages.NoConnection)
  }

  if (res.status !== 200) {
    throw new Error(errorMessages.BadStatusCode)
  }

  const jsonRes = await res.json()

  if (jsonRes.total_results === 0) {
    return []
  }

  return jsonRes.results
}

export async function tmdbMovieSearch(query: string): Promise<MovieResult[]> {
  if (query === '') {
    return []
  }

  const encodedQuery = encodeURIComponent(query)

  const url = `${import.meta.env.VITE_BACKEND_URL}/api/tmdb/search/movie/${encodedQuery}`

  return await queryTmdb(url) as MovieResult[]
}

export async function tmdbTVSearch(query: string): Promise<TVResult[]> {
  if (query === '') {
    return []
  }

  const encodedQuery = encodeURIComponent(query)

  const url = `${import.meta.env.VITE_BACKEND_URL}/api/tmdb/search/tv/${encodedQuery}`

  return await queryTmdb(url) as TVResult[]
}
