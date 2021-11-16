import { MovieResult, TVResult } from '@/types'
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

  let url
  if (process.env.NODE_ENV === 'development') {
    url = `http://localhost:42069/api/tmdb/search/movie/${query}`
  } else {
    url = `https://octagon-moon-9u5g9.ondigitalocean.app/api/tmdb/search/movie/${query}`
  }

  return await queryTmdb(url) as MovieResult[]
}

export const tmdbTVSearch = async (query: string): Promise<TVResult[]> => {
  if (query === '') {
    return []
  }

  let url
  if (process.env.NODE_ENV === 'development') {
    url = `http://localhost:42069/api/tmdb/search/tv/${query}`
  } else {
    url = `https://octagon-moon-9u5g9.ondigitalocean.app/api/tmdb/search/tv/${query}`
  }

  return await queryTmdb(url) as TVResult[]
}
