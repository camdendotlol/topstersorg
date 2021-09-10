import { errorMessages } from './errors'

const queryOpenLibrary = async (query: string): Promise<unknown[]> => {
  const res = await fetch(`https://openlibrary.org/search.json?q=${query}`)

  if (!res) {
    throw new Error(errorMessages.NoConnection)
  }

  if (res.status !== 200) {
    throw new Error(errorMessages.BadStatusCode)
  }

  const jsonRes = await res.json()

  if (jsonRes.docs.length === 0) {
    throw new Error(errorMessages.NoResults)
  }

  return jsonRes.docs
}

export default queryOpenLibrary
