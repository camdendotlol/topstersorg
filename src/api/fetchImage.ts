const fetchImageURL = async (url: string): Promise<string> => {
  let blob

  // If the origin site has CORS * headers, we're all set!
  // Otherwise we need to go through our CORS proxy.
  try {
    const directData = await fetch(url)
    blob = await directData.blob()
  } catch (e) {
    const octagonURL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:42069/api/proxy'
      : 'https://octagon-moon-9u5g9.ondigitalocean.app/api/proxy'
    const proxyData = await fetch(octagonURL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url
        })
      })

    blob = await proxyData.blob()
  }

  const localUrl = URL.createObjectURL(blob)
  return localUrl
}

export default fetchImageURL
