<script setup lang="ts">
import { onMounted, computed, ref, Ref } from 'vue'
import { useStore } from '../../store'
import generateChart from 'topster'
import { BackgroundTypes, Chart, ChartItem, StoredChart } from '../../types'
import { getCanvasInfo, insertPlaceholder, isDragAndDropEvent, isDroppable, isTouchEvent } from './lib'
import { getScaledDimensions } from 'topster/dist/lib'
import { getStoredCharts, setStoredCharts } from '../../helpers/localStorage'
import updateWithShim from '../../helpers/shim'

// Topsters 3 supports drag and drop for both mouse and touch events.
type InteractionEvent = MouseEvent | TouchEvent

const imagesStillLoading: Ref<boolean> = ref(true)

const grabbedItem: Ref<{
  originalIndex: number,
  itemObject: ChartItem
} | null> = ref(null)

const canvas: Ref<HTMLCanvasElement> = ref(null)

// We need to store the most recent touch position because the touchend event doesn't provide coordinates.
const lastTouch: Ref<{ x: number, y: number }> = ref({
  x: 0,
  y: 0
})

const lastMousePosition: Ref<{ x: number, y: number }> = ref({
  x: 0,
  y: 0
})

const store = useStore()

const drawingCtx = computed(() => {
  const ctx = canvas.value.getContext('2d')
  if (!ctx) {
    return null
  }

  return ctx
})

store.subscribe((mutation, state) => {
  if (mutation.type === 'setBackgroundImage') {
    state.chart.background.img.onload = () => {
      renderChart()
    }
  }
  imagesStillLoading.value = true
  renderChart()
})

onMounted(() => {
  if (!canvas.value) {
    throw new Error('Couldn\'t find canvas. Something must have gone wrong with page loading, please refresh.')
  }

  const savedCharts: StoredChart[] = getStoredCharts()
  const activeChart = savedCharts.find(chart => chart.currentlyActive === true)

  if (activeChart) {
    const updatedChart = updateWithShim(activeChart.data)
    if (updatedChart.background.type === BackgroundTypes.Image) {
      const bgImg = new Image()
      bgImg.src = updatedChart.background.value
      bgImg.onload = () => {
        renderChart()
      }
      updatedChart.background.img = bgImg
    }

    hydrateImages(updatedChart)
    store.commit('setEntireChart', updatedChart)
  }

  renderChart()
})

// Put the image elements into each item and set the onload callback.
// This is needed when loading a chart from storage, where the
// HTML image elements are not saved.
const hydrateImages = async (chart: Chart) => {
  // Keep track of whether all images have loaded.
  // We can ignore requests to hydrate when they're all loaded in.
  // Then at the bottom of this function, we call a final chart render
  // to make sure the finished images are rendered on the canvas.
  if (!imagesStillLoading.value) {
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
        renderChart()
      }
      // handle 404 errors, etc.
      item.coverImg.onerror = () => {
        img.src = '/not_found.jpg'
      }
    }
  }

  const allImagesLoaded = itemsToLoad.filter(item => item?.coverImg.complete).length === itemsToLoad.length
  if (allImagesLoaded) {
    imagesStillLoading.value = false
    renderChart()
  }
}

const renderChart = () => {
  // The image will be stored in localStorage as an empty object :(
  // This fills it back in as an img element if that happens.
  if (store.state.chart.background.type === BackgroundTypes.Image && store.state.chart.background.img?.src) {
    const bgImg = new Image()
    bgImg.src = store.state.chart.background.value
    store.state.chart.background.img = bgImg
  }

  hydrateImages(store.state.chart)

  if (!canvas.value) {
    return console.log('The canvas doesn\'nt exist! Maybe it tried to re-render after being unmounted.')
  }

  generateChart(
    canvas.value,
    store.state.chart
  )

  // Insert placeholders for empty squares
  store.state.chart.items.slice(0, store.state.chart.size.x * store.state.chart.size.y).forEach((item, index) => {
    if (!item) {
      insertPlaceholder(drawingCtx.value, store.state.chart, index)
    }
  })

  saveToLocalStorage(store.state.chart)
}

const saveToLocalStorage = (chart: Chart) => {
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
}

const checkDroppability = (event: InteractionEvent | DragEvent) => {
  const canvasInfo = getCanvasInfo(canvas.value, store.state.chart)

  const droppable = isDroppable(
    canvasInfo,
    store.state.chart,
    getInteractionCoords(event, { x: canvas.value.offsetLeft, y: canvas.value.offsetTop })
  )

  if (droppable) {
    return true
  } else {
    return false
  }
}

const drawImageAtMouse = (image: HTMLImageElement, coords: { x: number, y: number }) => {
  if (!drawingCtx.value) {
    throw new Error('Canvas context not found, the canvas must have loaded incorrectly.')
  }

  const canvasInfo = getCanvasInfo(canvas.value, store.state.chart)
  const scaledDimensions = getScaledDimensions(image, 260)

  // Dividing by the scale ratio to get the canvas's original pixel size back.
  drawingCtx.value.drawImage(
    image,
    // Subtract half the image size from each coordinate, so image is centered on the mouse.
    Math.floor((coords.x / canvasInfo.scaleRatio) - (scaledDimensions.width / 2)),
    Math.floor((coords.y / canvasInfo.scaleRatio) - (scaledDimensions.height / 2)),
    scaledDimensions.width,
    scaledDimensions.height
  )
}

const updateCursor = (event: InteractionEvent) => {
  const isSelectable = checkDroppability(event)
  const touchEvent = isTouchEvent(event)

  if (!touchEvent) {
    const canvasOffset = { x: canvas.value.offsetLeft, y: canvas.value.offsetTop }
    lastMousePosition.value = {
      x: (event as MouseEvent).clientX - canvasOffset.x + window.scrollX,
      y: (event as MouseEvent).clientY - canvasOffset.y + window.scrollY
    }
    if (isSelectable) {
      document.body.style.cursor = 'pointer'
    } else if (!isSelectable && !grabbedItem.value) {
      document.body.style.cursor = 'default'
    }
  }

  if (isTouchEvent(event) && event.type !== 'touchend') {
    lastTouch.value = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }

    const coords = getInteractionCoords(event, { x: canvas.value.offsetLeft, y: canvas.value.offsetTop })
    const canvasDimensions = canvas.value.getBoundingClientRect()

    if (
      coords.x < 0 ||
      coords.x > canvasDimensions.width ||
      coords.y < 0 ||
      coords.y > canvasDimensions.height
    ) {
      resetCursor(event)
    }
  }

  if (grabbedItem.value) {
    document.body.style.cursor = 'grab'
    // If we don't re-render, the dragged item from the previous frame remains visible and
    // it looks like that old Windows 95 bug with the window movement artifacts.
    renderChart()
    insertPlaceholder(drawingCtx.value, store.state.chart, grabbedItem.value.originalIndex)

    const coords = getInteractionCoords(event, { x: canvas.value.offsetLeft, y: canvas.value.offsetTop })
    drawImageAtMouse(grabbedItem.value.itemObject.coverImg, coords)
  }
}

const resetCursor = (event: InteractionEvent) => {
  document.body.style.cursor = 'default'

  if (grabbedItem.value) {
    // Remove the item from the chart.
    // This is so users can remove an item by dragging it off the chart.
    store.commit('addItem', {
      item: null,
      index: grabbedItem.value.originalIndex
    })
  }

  dropItem(event)

  grabbedItem.value = null

  // Clear the placeholder for the dragged item
  renderChart()
}

const getInteractionCoords = (
  event: InteractionEvent,
  canvasOffset: { x: number, y: number }
) => {
  if (isTouchEvent(event)) {
    if (event.type === 'touchend') {
      return {
        x: lastTouch.value.x - canvasOffset.x + window.scrollX,
        y: lastTouch.value.y - canvasOffset.y + window.scrollY
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
}

// Calculate the index of the chart item in the chart array from its position on the chart
const getItemIndexFromCoords = (event: InteractionEvent) => {
  const canvasInfo = getCanvasInfo(canvas.value, store.state.chart)

  const interactionCoords = getInteractionCoords(event, { x: canvas.value.offsetLeft, y: canvas.value.offsetTop })

  const titleHeight = store.state.chart.title ? 60 * canvasInfo.scaleRatio : 0

  // Gets the coordinates on the chart (i.e. 4x3, not pixels)
  const xCoord = Math.floor(interactionCoords.x / (canvasInfo.scaledItemSize + canvasInfo.scaledGap))
  const yCoord = Math.floor((interactionCoords.y - titleHeight) / (canvasInfo.scaledItemSize + canvasInfo.scaledGap))

  // All we need is the index in the chart.items array
  const itemsAbove = yCoord * store.state.chart.size.x
  return itemsAbove + xCoord
}

const pickUpItem = (event: InteractionEvent) => {
  // Ignore if the spot doesn't contain a movable item
  if (!checkDroppability(event)) {
    return null
  }

  const itemIndex = getItemIndexFromCoords(event)
  const item = store.state.chart.items[itemIndex]

  // This will trigger when the user tries to drag an empty placeholder slot
  if (!item) {
    return null
  }

  if (isTouchEvent(event)) {
    lastTouch.value = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }
  }

  grabbedItem.value = {
    originalIndex: itemIndex,
    itemObject: item
  }

  updateCursor(event)

  renderChart()

  // Cover up the original spot since we're moving it
  insertPlaceholder(drawingCtx.value, store.state.chart, itemIndex)

  // Draw the item at the center of the mouse cursor
  const coords = getInteractionCoords(event, { x: canvas.value.offsetLeft, y: canvas.value.offsetTop })
  drawImageAtMouse(grabbedItem.value.itemObject.coverImg, coords)
}

const dropHTMLItem = (event: DragEvent) => {
  const item = event.dataTransfer?.getData('application/json')

  if (!item) {
    return null
  }

  dropItem(event)
}

const dropCanvasItem = (event: InteractionEvent) => {
  if (!grabbedItem.value) {
    return null
  }

  dropItem(event)
}

const dropItem = (event: InteractionEvent | DragEvent) => {
  // If the spot doesn't contain a movable item, just put the item back where it came from.
  if (!checkDroppability(event)) {
    grabbedItem.value = null
    renderChart()
    return null
  }

  const newIndex = getItemIndexFromCoords(event)

  if (isDragAndDropEvent(event)) {
    const item = JSON.parse(event.dataTransfer?.getData('application/json') || 'null')
    if (!item) {
      return null
    }
    store.commit('addItem', {
      item,
      index: newIndex
    })
  } else {
    if (!grabbedItem.value) {
      return null
    }

    if (!store.state.chart.items[newIndex]) {
      // If the selected slot is empty, just
      // 1) move the item there
      store.commit('addItem', {
        item: grabbedItem.value.itemObject,
        index: newIndex
      })
      // 2) and remove it from its old spot
      store.commit('addItem', {
        item: null,
        index: grabbedItem.value.originalIndex
      })
    } else {
      // If there's an item in the new slot, adjust the array
      // without deleting anything.
      store.commit('moveItem', {
        item: grabbedItem.value.itemObject,
        oldIndex: grabbedItem.value.originalIndex,
        newIndex
      })
    }
  }

  grabbedItem.value = null

  // Gets rid of the 'grab' cursor now that we're not holding the item anymore.
  updateCursor(event)

  renderChart()
}

const allowDragAndDrop = (event: DragEvent) => {
  event.preventDefault()
}

</script>

<template>
  <canvas
    id="chart-canvas"
    ref="canvas"
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
