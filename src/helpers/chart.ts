// Functions for filling in the chart.

import { State, initialState } from '../store'
import { type Chart, type ChartItem, type Result, BackgroundTypes } from '../types'
import { appendChart, getActiveChart, setActiveChart } from './localStorage'
import {
  isBookResult,
  isCustomResult,
  isGameResult,
  isMovieResult,
  isMusicResult,
  isTVResult
} from './typeGuards'
import fetchImageURL from '../api/fetchImage'
import generateChart from 'topster'
import { Store } from 'vuex'

// Add the proper <img> elements into the chart state.
// This is needed when loading a saved chart from localstorage.
export const addImgElements = (chart: Chart): Chart => {
  const itemsWithCovers = chart.items.map(item => {
    if (!item) {
      return null
    }

    const cover = new Image()

    cover.src = item.coverURL
    item.coverImg = cover

    return item
  })

  return {
    ...chart,
    items: itemsWithCovers
  }
}

// To run the first time Topsters.org launches, or when we want to reset everything.
export const initializeFirstRun = (): void => {
  const newUuid = appendChart({
    timestamp: new Date().getTime(),
    data: initialState.chart
  })

  setActiveChart(newUuid)
}

export const setImage = (url: string): HTMLImageElement => {
  const cover = new Image()
  cover.src = url
  return cover
}

export const createChartItem = (item: Result): ChartItem => {
  if (isBookResult(item)) {
    return {
      title: item.title,
      coverImg: setImage(`https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-L.jpg`),
      coverURL: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-L.jpg`,
      creator: item.author_name[0]
    }
  } else if (isMusicResult(item)) {
    const largestImageIndex = item.image.length - 1
    return {
      title: item.name,
      coverImg: setImage(item.image[largestImageIndex]['#text']),
      coverURL: item.image[largestImageIndex]['#text'],
      creator: item.artist
    }
  } else if (isGameResult(item)) {
    return {
      title: item.name,
      coverImg: setImage(item.cover),
      coverURL: item.cover
    }
  } else if (isMovieResult(item)) {
    return {
      title: item.title,
      coverImg: setImage(`https://image.tmdb.org/t/p/w185/${item.poster_path}`),
      coverURL: `https://image.tmdb.org/t/p/w185/${item.poster_path}`
    }
  } else if (isTVResult(item)) {
    return {
      title: item.name,
      coverImg: setImage(`https://image.tmdb.org/t/p/w185/${item.poster_path}`),
      coverURL: `https://image.tmdb.org/t/p/w185/${item.poster_path}`
    }
  } else if (isCustomResult(item)) {
    return {
      title: item.title,
      creator: item.creator,
      coverImg: setImage(item.imageURL),
      coverURL: item.imageURL
    }
  } else {
    throw new Error('Invalid chart item')
  }
}

export const downloadChart = async (chart: Chart): Promise<void> => {
  const chartData = { ...chart }
  const downloadableChart = await createDownloadableChart(chartData)
  const chartURL = downloadableChart.toDataURL()
  saveChartImage(chartURL)
}

// Hacky way to make sure all images are loaded in before saving the chart
const fillInItems = async (chart: Chart) => {
  const promises = []

  // Get background image
  if (chart.background.type === BackgroundTypes.Image && chart.background.value) {
    const bgImgURL = await fetchImageURL(chart.background.value)
    promises.push(new Promise<void>(resolve => {
      const bgImg = new Image()
      bgImg.src = bgImgURL
      bgImg.onload = () => {
        resolve()
      }
      bgImg.onerror = () => {
        console.log(`Error downloading image from ${bgImgURL}`)
        resolve()
      }
      chart.background.img = bgImg
    }))
  }

  const visibleItems = chart.items.slice(0, chart.size.x * chart.size.y)

  // Get chart item images
  for (const item of visibleItems) {
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
const createDownloadableChart = async (data: Chart): Promise<HTMLCanvasElement> => {
  const chartCanvas = document.createElement('canvas')
  const chart = await fillInItems(data)

  // Populate the chart with the items etc.
  generateChart(chartCanvas, chart)

  return chartCanvas
}

// Saves the chart as an image
const saveChartImage = (url: string): void => {
  // Download the canvas
  const link = document.createElement('a')
  link.download = 'chart.png'
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const createNewChart = () => {
  const newUuid = appendChart({
    timestamp: new Date().getTime(),
    data: initialState.chart
  })

  setActiveChart(newUuid)
}

// Forces the chart to re-render from localStorage.
// Useful in situations where we update the charts by
// modifying localStorage directly such as imports.
export const forceRefresh = (store: Store<State>) => {
  const activeChart = getActiveChart()
  store.commit('setEntireChart', activeChart.data)
}

export const periodHeaders = {
  overall: 'All-Time',
  '7day': 'Weekly',
  '1month': 'Monthly',
  '3month': '3 Month',
  '6month': '6 Month',
  '12month': 'Yearly'
}
