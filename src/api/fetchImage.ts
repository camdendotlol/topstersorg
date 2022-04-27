const fetchImageURL = async (url: string): Promise<string> => {
  let blob

  // If the origin site has CORS * headers, we're all set!
  // Otherwise we need to go through our CORS proxy.
  try {
    const directData = await fetch(url)
    blob = await directData.blob()
  } catch (e) {
    const proxyURL = `${process.env.VUE_APP_BACKEND_URL}/api/proxy`
    const proxyData = await fetch(proxyURL,
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
