<template>
    <canvas
      id="chart-canvas"
      ref="chart-canvas"
      @mousemove="updateCursor"
      @mouseleave="resetCursor"
      @mousedown.left="pickUpItem"
      @mouseup.left="dropCanvasItem"
      @dragover="allowDragAndDrop"
      @drop="dropHTMLItem"
      @touchstart="pickUpItem"
      @touchmove="updateCursor"
      @touchend="dropItem"
      @touchleave="resetCursor"
    >
      TODO: text mode charts for accessibility
    </canvas>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import { State } from '../../store'
import generateChart from 'topster'
import { BackgroundTypes, Chart, ChartItem, StoredChart } from '@/types'
import { getCanvasInfo, insertPlaceholder, isDragAndDropEvent, isDroppable, isTouchEvent } from './lib'
import { getScaledDimensions } from 'topster/dist/lib'
import { getStoredCharts, setStoredCharts } from '@/helpers/localStorage'
import updateWithShim from '@/helpers/shim'

// Topsters 3 supports drag and drop for both mouse and touch events.
type InteractionEvent = MouseEvent | TouchEvent

export default defineComponent({
  mounted () {
    const canvas = this.$refs['chart-canvas']

    if (!canvas) {
      throw new Error('Couldn\'t find canvas. Something must have gone wrong with page loading, please refresh.')
    }

    this.canvas = canvas as HTMLCanvasElement

    const savedCharts: StoredChart[] = getStoredCharts()
    const activeChart = savedCharts.find(chart => chart.currentlyActive === true)

    if (activeChart) {
      const updatedChart = updateWithShim(activeChart.data)
      if (updatedChart.background.type === BackgroundTypes.Image) {
        const bgImg = new Image()
        bgImg.src = updatedChart.background.value
        bgImg.onload = () => {
          this.renderChart()
        }
        updatedChart.background.img = bgImg
      }

      this.hydrateImages(updatedChart)
      this.$store.commit('setEntireChart', updatedChart)
    }

    this.renderChart()
  },
  methods: {
    // Put the image elements into each item and set the onload callback.
    // This is needed when loading a chart from storage, where the
    // HTML image elements are not saved.
    async hydrateImages (chart: Chart) {
      // Keep track of whether all images have loaded.
      // We can ignore requests to hydrate when they're all loaded in.
      // Then at the bottom of this function, we call a final chart render
      // to make sure the finished images are rendered on the canvas.
      if (!this.imagesStillLoading) {
        return null
      }

      // We only need to load visible items.
      const itemsToLoad = chart.items.slice(0, chart.size.x * chart.size.y).filter(item => item !== null) as ChartItem[]

      for (const item of itemsToLoad) {
        // Images from storage will be empty objects
        if (!item.coverImg.addEventListener) {
          const img = new Image()
          img.src = item.coverURL
          item.coverImg = img
          // make sure they all load in
          item.coverImg.onload = () => {
            this.renderChart()
          }
        }
      }

      const allImagesLoaded = itemsToLoad.filter(item => item?.coverImg.complete).length === itemsToLoad.length
      if (allImagesLoaded) {
        this.imagesStillLoading = false
        this.renderChart()
      }
    },
    renderChart () {
      // The image will be stored in localStorage as an empty object :(
      // This fills it back in as an img element if that happens.
      if (this.chart.background.type === BackgroundTypes.Image && !this.chart.background.img?.src) {
        const bgImg = new Image()
        bgImg.src = this.chart.background.value
        bgImg.onload = () => {
          this.renderChart()
        }
        this.chart.background.img = bgImg
      }

      this.hydrateImages(this.chart)

      generateChart(
        this.canvas,
        this.chart
      )

      // Insert placeholders for empty squares
      this.chart.items.slice(0, this.chart.size.x * this.chart.size.y).forEach((item, index) => {
        if (!item) {
          insertPlaceholder(this.drawingCtx, this.chart, index)
        }
      })

      this.saveToLocalStorage(this.chart)
    },
    saveToLocalStorage (chart: Chart) {
      const savedCharts = getStoredCharts()

      const activeChart = savedCharts.find(chart => chart.currentlyActive)

      if (!activeChart) {
        const newChartArray = [
          {
            timestamp: new Date().getTime(),
            name: null,
            data: chart,
            currentlyActive: true
          }
        ]

        return setStoredCharts(newChartArray)
      }

      const updatedChart = {
        ...activeChart,
        data: chart
      }

      const updatedArray = savedCharts.map(savedChart => {
        if (savedChart.currentlyActive) {
          return updatedChart
        } else {
          return savedChart
        }
      })

      setStoredCharts(updatedArray)
    },
    checkDroppability (event: InteractionEvent | DragEvent) {
      const canvasInfo = getCanvasInfo(this.canvas, this.chart)

      const droppable = isDroppable(
        canvasInfo,
        this.chart,
        this.getInteractionCoords(event, { x: this.canvas.offsetLeft, y: this.canvas.offsetTop })
      )

      if (droppable) {
        return true
      } else {
        return false
      }
    },
    drawImageAtMouse (image: HTMLImageElement, coords: { x: number, y: number }) {
      if (!this.drawingCtx) {
        throw new Error('Canvas context not found, the canvas must have loaded incorrectly.')
      }

      const canvasInfo = getCanvasInfo(this.canvas, this.chart)
      const scaledDimensions = getScaledDimensions(image, 260)

      // Dividing by the scale ratio to get the canvas's original pixel size back.
      this.drawingCtx.drawImage(
        image,
        // Subtract half the image size from each coordinate, so image is centered on the mouse.
        Math.floor((coords.x / canvasInfo.scaleRatio) - (scaledDimensions.width / 2)),
        Math.floor((coords.y / canvasInfo.scaleRatio) - (scaledDimensions.height / 2)),
        scaledDimensions.width,
        scaledDimensions.height
      )
    },
    updateCursor (event: InteractionEvent) {
      const isSelectable = this.checkDroppability(event)
      const touchEvent = isTouchEvent(event)

      if (!touchEvent) {
        const canvasOffset = { x: this.canvas.offsetLeft, y: this.canvas.offsetTop }
        this.lastMousePosition = {
          x: (event as MouseEvent).clientX - canvasOffset.x + window.scrollX,
          y: (event as MouseEvent).clientY - canvasOffset.y + window.scrollY
        }
        if (isSelectable) {
          document.body.style.cursor = 'pointer'
        } else if (!isSelectable && !this.grabbedItem) {
          document.body.style.cursor = 'default'
        }
      }

      if (isTouchEvent(event) && event.type !== 'touchend') {
        this.lastTouch = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        }

        const coords = this.getInteractionCoords(event, { x: this.canvas.offsetLeft, y: this.canvas.offsetTop })
        const canvasDimensions = this.canvas.getBoundingClientRect()

        if (
          coords.x < 0 ||
          coords.x > canvasDimensions.width ||
          coords.y < 0 ||
          coords.y > canvasDimensions.height
        ) {
          this.resetCursor(event)
        }
      }

      if (this.grabbedItem) {
        document.body.style.cursor = 'grab'
        // If we don't re-render, the dragged item from the previous frame remains visible and
        // it looks like that old Windows 95 bug with the window movement artifacts.
        this.renderChart()
        insertPlaceholder(this.drawingCtx, this.chart, this.grabbedItem.originalIndex)

        const coords = this.getInteractionCoords(event, { x: this.canvas.offsetLeft, y: this.canvas.offsetTop })
        this.drawImageAtMouse(this.grabbedItem.itemObject.coverImg, coords)
      }
    },
    resetCursor (event: InteractionEvent) {
      document.body.style.cursor = 'default'

      if (this.grabbedItem) {
        // Remove the item from the chart.
        // This is so users can remove an item by dragging it off the chart.
        this.$store.commit('addItem', {
          item: null,
          index: this.grabbedItem.originalIndex
        })
      }

      this.dropItem(event)

      this.grabbedItem = null

      // Clear the placeholder for the dragged item
      this.renderChart()
    },
    getInteractionCoords (event: InteractionEvent, canvasOffset: { x: number, y: number }) {
      if (isTouchEvent(event)) {
        if (event.type === 'touchend') {
          return {
            x: this.lastTouch.x - canvasOffset.x + window.scrollX,
            y: this.lastTouch.y - canvasOffset.y + window.scrollY
          }
        } else {
          return {
            x: event.touches[0].clientX - canvasOffset.x + window.scrollX,
            y: event.touches[0].clientY - canvasOffset.y + window.scrollY
          }
        }
      } else {
        // handle mouse event
        return {
          x: event.clientX - canvasOffset.x + window.scrollX,
          y: event.clientY - canvasOffset.y + window.scrollY
        }
      }
    },
    // Calculate the index of the chart item in the chart array from its position on the chart
    getItemIndexFromCoords (event: InteractionEvent) {
      const canvasInfo = getCanvasInfo(this.canvas, this.chart)

      const interactionCoords = this.getInteractionCoords(event, { x: this.canvas.offsetLeft, y: this.canvas.offsetTop })

      const titleHeight = this.chart.title ? 60 * canvasInfo.scaleRatio : 0

      // Gets the coordinates on the chart (i.e. 4x3, not pixels)
      const xCoord = Math.floor(interactionCoords.x / (canvasInfo.scaledItemSize + canvasInfo.scaledGap))
      const yCoord = Math.floor((interactionCoords.y - titleHeight) / (canvasInfo.scaledItemSize + canvasInfo.scaledGap))

      // All we need is the index in the chart.items array
      const itemsAbove = yCoord * this.chart.size.x
      return itemsAbove + xCoord
    },
    pickUpItem (event: InteractionEvent) {
      // Ignore if the spot doesn't contain a movable item
      if (!this.checkDroppability(event)) {
        return null
      }

      const itemIndex = this.getItemIndexFromCoords(event)
      const item = this.chart.items[itemIndex]

      // This will trigger when the user tries to drag an empty placeholder slot
      if (!item) {
        return null
      }

      if (isTouchEvent(event)) {
        this.lastTouch = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        }
      }

      this.grabbedItem = {
        originalIndex: itemIndex,
        itemObject: item
      }

      this.updateCursor(event)

      this.renderChart()

      // Cover up the original spot since we're moving it
      insertPlaceholder(this.drawingCtx, this.chart, itemIndex)

      // Draw the item at the center of the mouse cursor
      const coords = this.getInteractionCoords(event, { x: this.canvas.offsetLeft, y: this.canvas.offsetTop })
      this.drawImageAtMouse(this.grabbedItem.itemObject.coverImg, coords)
    },
    dropHTMLItem (event: DragEvent) {
      const item = event.dataTransfer?.getData('application/json')

      if (!item) {
        return null
      }

      this.dropItem(event)
    },
    dropCanvasItem (event: InteractionEvent) {
      if (!this.grabbedItem) {
        return null
      }

      this.dropItem(event)
    },
    dropItem (event: InteractionEvent | DragEvent) {
      // If the spot doesn't contain a movable item, just put the item back where it came from.
      if (!this.checkDroppability(event)) {
        this.grabbedItem = null
        this.renderChart()
        return null
      }

      const newIndex = this.getItemIndexFromCoords(event)

      if (isDragAndDropEvent(event)) {
        const item = JSON.parse(event.dataTransfer?.getData('application/json') || 'null')
        if (!item) {
          return null
        }
        this.$store.commit('addItem', {
          item,
          index: newIndex
        })
      } else {
        if (!this.grabbedItem) {
          return null
        }

        if (!this.chart.items[newIndex]) {
          // If the selected slot is empty, just
          // 1) move the item there
          this.$store.commit('addItem', {
            item: this.grabbedItem.itemObject,
            index: newIndex
          })
          // 2) and remove it from its old spot
          this.$store.commit('addItem', {
            item: null,
            index: this.grabbedItem.originalIndex
          })
        } else {
          // If there's an item in the new slot, adjust the array
          // without deleting anything.
          this.$store.commit('moveItem', {
            item: this.grabbedItem.itemObject,
            oldIndex: this.grabbedItem.originalIndex,
            newIndex: newIndex
          })
        }
      }

      this.grabbedItem = null

      // Gets rid of the 'grab' cursor now that we're not holding the item anymore.
      this.updateCursor(event)

      this.renderChart()
    },
    allowDragAndDrop (event: DragEvent) {
      event.preventDefault()
    }
  },
  data (): {
      // wow this is really ugly but hey, it's typed
      // eslint complains if I change the formatting from this
      grabbedItem: {
          originalIndex: number,
          itemObject: ChartItem
        } | null,
      canvas: HTMLCanvasElement,
      lastTouch: { x: number, y: number },
      lastMousePosition: { x: number, y: number },
      imagesStillLoading: boolean
      } {
    return {
      grabbedItem: null,
      canvas: this.$refs['chart-canvas'] as HTMLCanvasElement,
      // We need to store the most recent touch position because the touchend event doesn't provide coordinates.
      lastTouch: { x: 0, y: 0 },
      lastMousePosition: { x: 0, y: 0 },
      imagesStillLoading: true
    }
  },
  watch: {
    chart () {
      this.imagesStillLoading = true
      this.renderChart()
    }
  },
  computed: {
    drawingCtx (): CanvasRenderingContext2D | null {
      const ctx = (this.$refs['chart-canvas'] as HTMLCanvasElement).getContext('2d')
      if (!ctx) {
        return null
      }

      return ctx
    },
    ...mapState({
      chart: state => (state as State).chart
    })
  }
})

</script>

<style scoped>
#chart-canvas {
  border-radius: 5px;
  touch-action: none;
}

#save-button {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  padding: 20px;
  border-radius: 50%;
  border: 2px solid var(--off-white);
  background: transparent;
  color: var(--off-white);
  height: 5rem;
  width: 5rem;
  font-size: 0.8rem;
  transition: 0.2s;
}

#save-button:hover {
  cursor: pointer;
  background: var(--off-white);
  color: var(--dark-blue);
}

#save-button svg {
  height: 1.8rem;
  width: 1.8rem;
}

canvas {
  max-width: 95%;
  max-height: 85vh;
  margin: auto;
  margin-top: 50px;
}

@media screen and (max-width: 1000px) {
  canvas {
    max-width: 98%;
  }
}
</style>
