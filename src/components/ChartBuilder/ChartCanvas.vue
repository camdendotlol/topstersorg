<template>
  <canvas
    id="chart-canvas"
    @mousemove="updateCursor"
    @mouseleave="resetCursor"
    @mousedown="pickUpItem"
    @mouseup="dropItem"
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

export default defineComponent({
  mounted () {
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
      const canvasElement = document.getElementById('chart-canvas') as HTMLCanvasElement

      generateChart(
        canvasElement,
        this.chart
      )

      // Insert placeholders for empty squares
      this.chart.items.slice(0, this.chart.size.x * this.chart.size.y).forEach((item, index) => {
        if (!item) {
          insertPlaceholder(canvasElement, this.chart, index)
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
      const canvas = document.getElementById('chart-canvas') as HTMLCanvasElement

      const canvasInfo = getCanvasInfo(canvas, this.chart)

      const droppable = isDroppable(
        canvasInfo,
        this.chart,
        this.getMouseCoords(event, { x: canvas.offsetLeft, y: canvas.offsetTop })
      )

      if (droppable) {
        return true
      } else {
        return false
      }
    },
    updateCursor (event: MouseEvent) {
      const isSelectable = this.checkDroppability(event)

      if (isSelectable) {
        document.body.style.cursor = 'pointer'
      } else {
        document.body.style.cursor = 'default'
      }
    },
    resetCursor (event: MouseEvent) {
      document.body.style.cursor = 'default'
      this.dropItem(event)
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
      const canvas = document.getElementById('chart-canvas') as HTMLCanvasElement
      const canvasInfo = getCanvasInfo(canvas, this.chart)

      const mouseCoords = this.getMouseCoords(event, { x: canvas.offsetLeft, y: canvas.offsetTop })

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

      const canvas = document.getElementById('chart-canvas') as HTMLCanvasElement

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
      insertPlaceholder(canvas, this.chart, itemIndex)
    },
    dropItem (event: MouseEvent) {
      // Ignore if the spot doesn't contain a movable item
      if (!this.checkDroppability(event) || !this.grabbedItem) {
        return null
      }

      const newIndex = this.getItemIndexFromCoords(event)

      this.$store.commit('insertItem', {
        item: this.grabbedItem.itemObject,
        oldIndex: this.grabbedItem.originalIndex,
        newIndex: newIndex
      })

      this.grabbedItem = null

      this.renderChart()
    }
  },
  data (): {
      // wow this is really ugly but hey, it's typed
      // eslint complains if I change the formatting from this
      grabbedItem: {
          originalIndex: number,
          itemObject: ChartItem
        } | null
        } {
    return {
      grabbedItem: null
    }
  },
  watch: {
    chart () {
      this.renderChart()
    }
  },
  computed: mapState({
    chart: state => (state as State).chart
  })
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
