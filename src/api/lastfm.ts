import { encodeQuery } from '../helpers/search'
import { errorMessages } from './errors'

const queryLastFM = async (query: string): Promise<unknown[]> => {
  if (query === '') {
    return []
  }

  const encodedQuery = encodeQuery(query)

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lastfm/search/${encodedQuery}`)

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
