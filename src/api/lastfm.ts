import { errorMessages } from './errors'

// TODO: handling for LastFM API fetches
const queryLastFM = async (query: string): Promise<unknown[]> => {
  if (query === '') {
    return []
  }

  let res
  if (process.env.NODE_ENV === 'development') {
    res = await fetch(`http://localhost:42069/api/lastfm/search/${query}`)
  } else {
    res = await fetch(`https://octagon-moon-9u5g9.ondigitalocean.app/api/lastfm/search/${query}`)
  }

  if (!res) {
    throw new Error(errorMessages.NoConnection)
  }

  if (res.status !== 200) {
    throw new Error(errorMessages.BadStatusCode)
  }

  const jsonRes = await res.json()

  return jsonRes.results.albummatches.album
}

export default queryLastFM
