export const ping = async (): Promise<void> => {
  let url
  if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:42069/api/meta/ping'
  } else {
    url = 'https://octagon-moon-9u5g9.ondigitalocean.app/api/meta/ping'
  }

  await fetch(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ referrer: document.referrer })
    }
  )
}
