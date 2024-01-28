import { encodeQuery } from '../helpers/search'
import { errorMessages } from './errors'

const queryOpenLibrary = async (query: string): Promise<unknown[]> => {
  // Don't spam OL servers with an empty query
  if (query === '') {
    return []
  }

  const encodedQuery = encodeQuery(query)

  const res = await fetch(`https://openlibrary.org/search.json?q=${encodedQuery}`)

  if (!res) {
    throw new Error(errorMessages.NoConnection)
  }

  if (res.status !== 200) {
    throw new Error(errorMessages.BadStatusCode)
  }

  const jsonRes = await res.json()

  if (jsonRes.docs.length === 0) {
    return []
  }

  return jsonRes.docs
}

export default queryOpenLibrary
