import { encodeQuery } from '@/helpers/search'
import { errorMessages } from './errors'

const queryLastFM = async (query: string): Promise<unknown[]> => {
  if (query === '') {
    return []
  }

  const encodedQuery = encodeQuery(query)

  let res
  if (process.env.NODE_ENV === 'development') {
    res = await fetch(`http://localhost:42069/api/lastfm/search/${encodedQuery}`)
  } else {
    res = await fetch(`https://octagon-moon-9u5g9.ondigitalocean.app/api/lastfm/search/${encodedQuery}`)
  }

  if (!res) {
    throw new Error(errorMessages.NoConnection)
  }

  if (res.status !== 200) {
    throw new Error(errorMessages.BadStatusCode)
  }

  const jsonRes = await res.json()

  if (jsonRes.results.albummatches.album.length === 0) {
    return []
  }

  return jsonRes.results.albummatches.album
}

export default queryLastFM
