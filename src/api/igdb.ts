import { errorMessages } from './errors'
import { IgdbItem } from '@/types'
import { encodeQuery } from '@/helpers/search'

const queryIGDB = async (query: string): Promise<IgdbItem[]> => {
  if (query === '') {
    return []
  }

  const encodedQuery = encodeQuery(query)

  const res = await fetch(`${process.env.VUE_APP_BACKEND_URL}/api/igdb/search/${encodedQuery}`)

  if (!res) {
    throw new Error(errorMessages.NoConnection)
  }

  if (res.status !== 200) {
    throw new Error(errorMessages.BadStatusCode)
  }

  const jsonRes = await res.json()

  return jsonRes
}

export default queryIGDB
