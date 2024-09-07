import { errorMessages } from './errors'

async function queryOpenLibrary(query: string): Promise<unknown[]> {
  // Don't spam OL servers with an empty query
  if (query === '') {
    return []
  }

  const encodedQuery = encodeURIComponent(query)

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
