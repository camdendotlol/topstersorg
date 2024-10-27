import { defineStore } from 'pinia'
import { BackgroundTypes, type Chart, type ChartItem } from './types'

export interface State {
  chart: Chart
  popupText: string | null
}

export const initialState = {
  popupText: null,
  chart: {
    title: '',
    items: Array.from({ length: 144 }).fill(null) as null[],
    size: {
      x: 5,
      y: 5,
    },
    backgroundUrl: '',
    backgroundColor: '#000000',
    backgroundType: BackgroundTypes.Color,
    backgroundImg: null,
    showNumbers: false,
    showTitles: true,
    gap: 20,
    font: 'monospace',
    textColor: '#ffffff',
    shadows: true,
  },
}

// Image elements are stored in localStorage as empty objects ({})
// so we need to fill in the img elements when a chart first loads.
function hydrateImages(chart: Chart) {
  return {
    ...chart,
    backgroundImg: chart.backgroundType === 'image'
      ? (() => {
          const img = new Image()
          img.src = chart.backgroundUrl
          return img
        })()
      : null,
    items: chart.items.map((i) => {
      if (i && i.coverURL) {
        const img = new Image()
        img.src = i.coverURL
        return { ...i, coverImg: img }
      }

      return i
    }),
  }
}

export const useStore = defineStore('store', {
  state() {
    return { ...initialState }
  },
  actions: {
    setPopup(text: string | null) {
      this.popupText = text
    },
    // For overriding the existing item (e.g. adding to a null slot, or removing an item)
    addItem(payload: { item: ChartItem | null, index: number }) {
      const itemsArray = this.chart.items
      itemsArray[payload.index] = payload.item
      this.chart = { ...this.chart, items: [...itemsArray] }
    },
    // For changing the place of a current item
    moveItem(payload: { item: ChartItem, oldIndex: number, newIndex: number }) {
      const itemsArray = [...this.chart.items]

      // Remove the item from its old index
      itemsArray.splice(payload.oldIndex, 1)

      // Add the item at its new index
      itemsArray.splice(payload.newIndex, 0, payload.item)

      this.chart = { ...this.chart, items: [...itemsArray] }
    },
    changeTitle(newTitle: string) {
      this.chart = { ...this.chart, title: newTitle }
    },
    setBackgroundColor(hex: string) {
      this.chart = {
        ...this.chart,
        backgroundColor: hex,
      }
    },
    setBackgroundUrl(url: string) {
      const img = new Image()
      img.src = url
      img.onload = () => {
        this.chart = { ...this.chart, backgroundImg: img }
      }

      this.chart = {
        ...this.chart,
        backgroundUrl: url,
      }
    },
    setBackgroundType(backgroundType: BackgroundTypes) {
      if (backgroundType === BackgroundTypes.Image && this.chart.backgroundUrl) {
        const img = new Image()
        img.src = this.chart.backgroundUrl
        img.onload = () => {
          this.chart = { ...this.chart, backgroundImg: img }
        }
      }

      this.chart = {
        ...this.chart,
        backgroundType,
      }
    },
    setHeight(payload: number) {
      this.chart = { ...this.chart, size: {
        ...this.chart.size,
        y: payload,
      } }
    },
    setWidth(payload: number) {
      this.chart = { ...this.chart, size: {
        ...this.chart.size,
        x: payload,
      } }
    },
    changeGap(newGap: number) {
      this.chart = { ...this.chart, gap: newGap }
    },
    changeFont(newFont: string) {
      this.chart = { ...this.chart, font: newFont }
    },
    changeTextColor(newColor: string) {
      this.chart = { ...this.chart, textColor: newColor }
    },
    toggleTitles(newValue: boolean) {
      this.chart = { ...this.chart, showTitles: newValue }
    },
    toggleNumbers(newValue: boolean) {
      this.chart = { ...this.chart, showNumbers: newValue }
    },
    toggleShadows(newValue: boolean) {
      this.chart = { ...this.chart, shadows: newValue }
    },
    setEntireChart(payload: Chart) {
      this.chart = hydrateImages(payload)
    },
    reset() {
      this.chart = { ...initialState.chart }
    },
  },
})
