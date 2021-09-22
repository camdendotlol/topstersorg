import { errorMessages } from './errors'
import { IgdbItem } from '@/types'

const queryIGDB = async (query: string): Promise<IgdbItem[]> => {
  if (query === '') {
    return []
  }

  let res
  if (process.env.NODE_ENV === 'development') {
    res = await fetch(`http://localhost:42069/api/igdb/search/${query}`)
  } else {
    res = await fetch(`https://octagon-moon-9u5g9.ondigitalocean.app/api/igdb/search/${query}`)
  }

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
