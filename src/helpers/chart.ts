// Functions for filling in the chart.

import { initialState } from '@/store'
import { Chart } from '@/types'
import { setStoredCharts } from './localStorage'

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
