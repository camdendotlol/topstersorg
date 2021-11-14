import { BackgroundTypes, Chart } from '../types'
import fetchImageURL from './fetchImage'
import generateChart from 'topster'

// Hacky way to make sure all images are loaded in before saving the chart
const fillInItems = async (chart: Chart) => {
  const promises = []

  // Get background image
  if (chart.background.type === BackgroundTypes.Image) {
    const bgImgURL = await fetchImageURL(chart.background.value)
    promises.push(new Promise<void>(resolve => {
      const bgImg = new Image()
      bgImg.src = bgImgURL
      bgImg.onload = () => {
        resolve()
      }
      chart.background.img = bgImg
    }))
  }

  // Get chart item images
  for (const item of chart.items) {
    if (item) {
      const localURL = await fetchImageURL(item.coverURL)
      promises.push(new Promise<void>(resolve => {
        item.coverImg.src = localURL
        item.coverImg.onload = () => {
          resolve()
        }
      }))
    }
  }

  await Promise.all(promises)

  return chart
}

// Create a new canvas to render the final downloadable version.
// This is needed to avoid CORS issues with third-party images.
export const createDownloadableChart = async (data: Chart): Promise<HTMLCanvasElement> => {
  const chartCanvas = document.createElement('canvas')
  const chart = await fillInItems(data)

  // Populate the chart with the items etc.
  generateChart(chartCanvas, chart)

  return chartCanvas
}

// Saves the chart as an image
export const saveChart = (url: string): void => {
  // Download the canvas
  const link = document.createElement('a')
  link.download = 'chart.png'
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
