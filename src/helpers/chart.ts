// Functions for filling in the chart.

import { Chart } from '@/types'

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
