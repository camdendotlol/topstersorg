import { encodeQuery } from '../helpers/search'
import { LastfmChartResponseItem, LastfmDataType, Period } from '../types'
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

export const getLastfmChart = async (username: string, type: LastfmDataType, period?: Period): Promise<LastfmChartResponseItem[]> => {
  if (username === '') {
    return []
  }

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/lastfm/user/top?` + new URLSearchParams({
      user: encodeQuery(username),
      type,
      period: period ? encodeQuery(period) : ''
    })
  )

  if (!res) {
    throw new Error(errorMessages.NoConnection)
  }

  if (res.status !== 200) {
    throw new Error(errorMessages.BadStatusCode)
  }

  const jsonRes = await res.json()
  return jsonRes
}

export default queryLastFM
