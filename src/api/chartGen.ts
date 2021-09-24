import { Chart } from 'topster'
import { errorMessages } from './errors'

const getChart = async (data: Chart) => {
  let url
  if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:42069/api/chart/gen'
  } else {
    url = 'https://octagon-moon-9u5g9.ondigitalocean.app/api/chart/gen'
  }

  const res = await fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!res) {
    throw new Error(errorMessages.NoConnection)
  }

  if (res.status !== 200) {
    throw new Error(errorMessages.BadStatusCode)
  }

  return res.blob()
}

export default getChart
