// Functions for filling in the chart.

import { createDownloadableChart, saveChart } from '@/api/chartGen'
import { initialState } from '@/store'
import { Chart, ChartItem, Result } from '@/types'
import { setStoredCharts } from './localStorage'
import { isBookResult, isGameResult, isMusicResult } from './typeGuards'

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

// To run the first time Ostrakon launches, or when we want to reset everything.
export const initializeFirstRun = (): void => {
  const newChartArray = [
    {
      timestamp: new Date().getTime(),
      name: null,
      data: initialState.chart,
      currentlyActive: true
    }
  ]

  setStoredCharts(newChartArray)
}

export const createChartItem = (item: Result): ChartItem => {
  const setImage = (url: string): HTMLImageElement => {
    const cover = new Image()
    cover.src = url
    return cover
  }

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
  } else {
    throw new Error('Invalid chart item')
  }
}

export const downloadChart = async (chart: Chart): Promise<void> => {
  // TypeScript doesn't know the navigator.share types yet.
  // So let's just make it stop being annoying.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typescriptAnnoying: any = navigator

  // Clone the chart data so we don't mutate state
  const chartData = { ...chart }
  const downloadableChart = await createDownloadableChart(chartData)

  // If on a mobile browser, use the native share functionality.
  // Otherwise, use the normal download trick.
  if (typescriptAnnoying.canShare) {
    let chartFile
    try {
      chartFile = await fetch(downloadableChart.toDataURL())
    } catch (e) {
      window.alert(e)
      throw new Error('ERROROROROR!!!!')
    }

    const blob = await chartFile.blob()
    const files = [
      new File(
        [blob],
        'chart.png',
        {
          type: 'image/png',
          lastModified: new Date().getTime()
        }
      )
    ]

    typescriptAnnoying.share({
      files,
      title: 'Chart',
      text: chartData.title ? chartData.title : 'My topster from https://ostrakon.xyz'
    })
  } else {
    saveChart(downloadableChart)
  }
}
