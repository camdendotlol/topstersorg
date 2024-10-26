import { defineStore } from 'pinia'
import { BackgroundTypes, type Chart, type ChartItem, type Layout, type TieredSize, type TitlePosition } from './types'

export interface State {
  chart: Chart
  popupText: string | null
}

export const initialState: {
  popupText: null | string
  chart: Chart
} = {
  popupText: null,
  chart: {
    title: '',
    items: Array.from({ length: 144 }).fill(null) as null[],
    size: {
      x: 5,
      y: 5,
    },
    background: {
      type: BackgroundTypes.Color,
      value: '#000000',
      img: null,
    },
    showNumbers: false,
    showTitles: true,
    gap: 20,
    font: 'monospace',
    textColor: '#ffffff',
    shadows: true,
    layout: 'grid',
    titlePosition: 'right',
    tieredSize: 'medium',
  },
}

// Image elements are stored in localStorage as empty objects ({})
// so we need to fill in the img elements when a chart first loads.
function hydrateImages(chart: Chart) {
  return {
    ...chart,
    background: chart.background.type === 'image'
      ? {
          ...chart.background,
          img: (() => {
            const img = new Image()
            img.src = chart.background.value
            return img
          })(),
        }
      : chart.background,
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
    changeBackgroundColor(newColor: string) {
      this.chart = {
        ...this.chart,
        background: {
          type: BackgroundTypes.Color,
          value: newColor,
          img: null,
        },
      }
    },
    setBackgroundImage(url: string) {
      const image = new Image()
      image.src = url
      this.chart = {
        ...this.chart,
        background: {
          type: BackgroundTypes.Image,
          value: url,
          img: image,
        },
      }
    },
    setBackgroundType(type: BackgroundTypes) {
      this.chart = {
        ...this.chart,
        background: {
          ...this.chart.background,
          type,
        },
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
    setLayout(newValue: Layout) {
      this.chart = { ...this.chart, layout: newValue }
    },
    setTitlePosition(newValue: TitlePosition) {
      this.chart = { ...this.chart, titlePosition: newValue }
    },
    setTieredSize(newValue: TieredSize) {
      this.chart = { ...this.chart, tieredSize: newValue }
    },
    setEntireChart(payload: Chart) {
      this.chart = hydrateImages(payload)
    },
    setBooleanField(field: string, newValue: boolean) {
      this.chart = { ...this.chart, [field]: newValue }
    },
    setStringField(field: string, newValue: string) {
      this.chart = { ...this.chart, [field]: newValue }
    },
    reset() {
      this.chart = { ...initialState.chart }
    },
  },
})
