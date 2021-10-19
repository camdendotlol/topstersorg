<template>
  <canvas
    id="chart-canvas"
    @mousemove="updateCursor"
    @mouseleave="resetCursor"
    @mousedown.left="pickUpItem"
    @mouseup.left="dropItem"
  >
    TODO: text mode charts for accessibility
  </canvas>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import { State } from '../../store'
import generateChart from 'topster'
import { Chart, ChartItem, SavedChart } from '@/types'
import { getCanvasInfo, insertPlaceholder, isDroppable } from './lib'
import { getScaledDimensions } from 'topster/dist/common'

export default defineComponent({
  mounted () {
    const canvas = document.getElementById('chart-canvas')

    if (!canvas) {
      throw new Error('Couldn\'t find canvas. Something must have gone wrong with page loading, please refresh.')
    }

    this.canvas = canvas as HTMLCanvasElement

    // check for saved chart in local storage
    const savedCharts: SavedChart[] = JSON.parse(localStorage.getItem('charts') || '[]')

    if (savedCharts) {
      const activeChart = savedCharts.find(chart => chart.currentlyActive)
      if (activeChart) {
        for (const item of activeChart.data.items) {
          // Make sure the item isn't null
          if (item) {
            const img = new Image()
            img.src = item.coverURL
            item.coverImg = img

            // make sure they all load in
            img.onload = () => {
              this.renderChart()
            }
          }
        }
        this.$store.commit('setEntireChart', activeChart.data)
      }
    }

    this.renderChart()
  },
  methods: {
    renderChart () {
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
      const savedCharts: SavedChart[] = JSON.parse(localStorage.getItem('charts') || '[]')

      // if the chart's already saved
      if (savedCharts) {
        const activeChart = savedCharts.find(chart => chart.currentlyActive)
        if (activeChart) {
          const updatedChart = {
            ...activeChart,
            data: chart
          }
          const newChartArray = savedCharts.filter(chart => chart !== activeChart).concat(updatedChart)
          return localStorage.setItem('charts', JSON.stringify(newChartArray))
        }
      }

      // if it's new
      const newChartArray = [
        {
          name: 'first',
          data: chart,
          currentlyActive: true
        }
      ]
      return localStorage.setItem('charts', JSON.stringify(newChartArray))
    },
    checkDroppability (event: MouseEvent) {
      const canvasInfo = getCanvasInfo(this.canvas, this.chart)

      const droppable = isDroppable(
        canvasInfo,
        this.chart,
        this.getMouseCoords(event, { x: this.canvas.offsetLeft, y: this.canvas.offsetTop })
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
    updateCursor (event: MouseEvent) {
      const isSelectable = this.checkDroppability(event)

      if (isSelectable) {
        document.body.style.cursor = 'pointer'
      } else if (!isSelectable && !this.grabbedItem) {
        document.body.style.cursor = 'default'
      }

      if (this.grabbedItem) {
        document.body.style.cursor = 'grab'
        // If we don't re-render, the dragged item from the previous frame remains visible and
        // it looks like that old Windows 95 bug with the window movement artifacts.
        this.renderChart()
        insertPlaceholder(this.drawingCtx, this.chart, this.grabbedItem.originalIndex)

        const coords = this.getMouseCoords(event, { x: this.canvas.offsetLeft, y: this.canvas.offsetTop })
        this.drawImageAtMouse(this.grabbedItem.itemObject.coverImg, coords)
      }
    },
    resetCursor (event: MouseEvent) {
      document.body.style.cursor = 'default'
      this.dropItem(event)

      if (this.grabbedItem) {
        // Remove the item from the chart.
        // This is so users can remove an item by dragging it off the chart.
        this.$store.commit('addItem', {
          item: null,
          index: this.grabbedItem.originalIndex
        })
      }

      this.grabbedItem = null

      // Clear the placeholder for the dragged item
      this.renderChart()
    },
    getMouseCoords (event: MouseEvent, canvasOffset: { x: number, y: number }) {
      return {
        x: event.clientX - canvasOffset.x,
        y: event.clientY - canvasOffset.y
      }
    },
    // Calculate the index of the chart item in the chart array from its position on the chart
    getItemIndexFromCoords (event: MouseEvent) {
      const canvasInfo = getCanvasInfo(this.canvas, this.chart)

      const mouseCoords = this.getMouseCoords(event, { x: this.canvas.offsetLeft, y: this.canvas.offsetTop })

      const titleHeight = this.chart.title ? 60 * canvasInfo.scaleRatio : 0

      // Gets the coordinates on the chart (i.e. 4x3, not pixels)
      const xCoord = Math.floor(mouseCoords.x / (canvasInfo.scaledItemSize + canvasInfo.scaledGap))
      const yCoord = Math.floor((mouseCoords.y - titleHeight) / (canvasInfo.scaledItemSize + canvasInfo.scaledGap))

      // All we need is the index in the chart.items array
      const itemsAbove = yCoord * this.chart.size.x
      return itemsAbove + xCoord
    },
    pickUpItem (event: MouseEvent) {
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

      this.grabbedItem = {
        originalIndex: itemIndex,
        itemObject: item
      }

      this.renderChart()

      // Cover up the original spot since we're moving it
      insertPlaceholder(this.drawingCtx, this.chart, itemIndex)

      // Draw the item at the center of the mouse cursor
      const coords = this.getMouseCoords(event, { x: this.canvas.offsetLeft, y: this.canvas.offsetTop })
      this.drawImageAtMouse(this.grabbedItem.itemObject.coverImg, coords)
    },
    dropItem (event: MouseEvent) {
      // Ignore if the spot doesn't contain a movable item
      if (!this.checkDroppability(event) || !this.grabbedItem) {
        return null
      }

      const newIndex = this.getItemIndexFromCoords(event)

      if (!this.chart.items[newIndex]) {
        // If the selected slot is empty, just move the item there...
        this.$store.commit('addItem', {
          item: this.grabbedItem.itemObject,
          index: newIndex
        })
        // ...and remove it from its old spot
        this.$store.commit('addItem', {
          item: null,
          index: this.grabbedItem.originalIndex
        })
      } else {
        // If there's an item in the new slot, adjust the array
        // without deleting anything.
        this.$store.commit('insertItem', {
          item: this.grabbedItem.itemObject,
          oldIndex: this.grabbedItem.originalIndex,
          newIndex: newIndex
        })
      }

      this.grabbedItem = null

      // Gets rid of the 'grab' cursor now that we're not holding the item anymore.
      this.updateCursor(event)

      this.renderChart()
    }
  },
  data (): {
      // wow this is really ugly but hey, it's typed
      // eslint complains if I change the formatting from this
      grabbedItem: {
          originalIndex: number,
          itemObject: ChartItem
        } | null,
      canvas: HTMLCanvasElement
      } {
    return {
      grabbedItem: null,
      canvas: document.getElementById('chart-canvas') as HTMLCanvasElement
    }
  },
  watch: {
    chart () {
      this.renderChart()
    }
  },
  computed: {
    drawingCtx (): CanvasRenderingContext2D | null {
      const ctx = this.canvas.getContext('2d', { alpha: false })
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
}

#save-button {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  padding: 20px;
  border-radius: 50%;
  border: 2px solid #e9e9e9;
  background: transparent;
  color: #e9e9e9;
  height: 5rem;
  width: 5rem;
  font-size: 0.8rem;
  transition: 0.2s;
}

#save-button:hover {
  cursor: pointer;
  background: #e9e9e9;
  color: #00003f;
}

#save-button svg {
  height: 1.8rem;
  width: 1.8rem;
}

canvas {
  max-width: calc(100vw - 400px);
  max-height: 90vh;
  margin-top: 20px;
}

@media screen and (max-width: 1000px) {
  canvas {
    max-width: 100%;
  }
}
</style>
