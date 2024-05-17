import { encodeQuery } from '../helpers/search'
import type { MovieResult, TVResult } from '../types'
import { errorMessages } from './errors'

const queryTmdb = async (url: string): Promise<Array<MovieResult | TVResult>> => {
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

export const tmdbMovieSearch = async (query: string): Promise<MovieResult[]> => {
  if (query === '') {
    return []
  }

  const encodedQuery = encodeQuery(query)

  const url = `${import.meta.env.VITE_BACKEND_URL}/api/tmdb/search/movie/${encodedQuery}`

  return await queryTmdb(url) as MovieResult[]
}

export const tmdbTVSearch = async (query: string): Promise<TVResult[]> => {
  if (query === '') {
    return []
  }

  const encodedQuery = encodeQuery(query)

  const url = `${import.meta.env.VITE_BACKEND_URL}/api/tmdb/search/tv/${encodedQuery}`

  return await queryTmdb(url) as TVResult[]
}
