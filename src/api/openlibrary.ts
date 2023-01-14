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

// Google Books provides better results, with the following downsides:
// 1. Annoying branding requirements, we'd need to cover the page in Google logos.
// 2. Covers have a little peeling graphic on them to indicate a Google Books preview.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const queryGoogleBooks = async (query: string): Promise<unknown[]> => {
  // Don't spam Google servers with an empty query
  if (query === '') {
    return []
  }

  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)

  if (!res) {
    throw new Error(errorMessages.NoConnection)
  }

  if (res.status !== 200) {
    throw new Error(errorMessages.BadStatusCode)
  }

  const jsonRes = await res.json()

  if (jsonRes.items.length === 0) {
    throw new Error(errorMessages.NoResults)
  }

  return jsonRes.items
}

export default queryOpenLibrary
