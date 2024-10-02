<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import Chart from '../../chartgen/ChartCanvas'
import { getScaledDimensions, setImage } from '../../helpers/chart'
import { useStore } from '../../store'
import { BackgroundTypes } from '../../types'
import { insertPlaceholder, isDragAndDropEvent, isTouchEvent } from './lib'
import type { ChartItem, Chart as ChartType } from '../../types'

const store = useStore()

const canvas: Ref<HTMLCanvasElement> = ref(null)
const chart: Ref<Chart> = ref(null)
const uiCanvas: Ref<HTMLCanvasElement> = ref(null)

function renderInteractionChart() {
  if (chart.value && uiCanvas.value) {
    uiCanvas.value.width = chart.value.canvasInfo.width
    uiCanvas.value.height = chart.value.canvasInfo.height
  }
}

watch(canvas, () => {
  if (canvas.value) {
    chart.value = new Chart(canvas.value)
  }
})

watch(chart, () => {
  if (chart.value) {
    renderInteractionChart()
  }
})

// Topsters 3 supports drag and drop for both mouse and touch events.
type InteractionEvent = MouseEvent | TouchEvent

const grabbedItem: Ref<{
  originalIndex: number
  itemObject: ChartItem
} | null> = ref(null)

// We need to store the most recent touch position because the touchend event doesn't provide coordinates.
const lastTouch: Ref<{ x: number, y: number }> = ref({
  x: 0,
  y: 0,
})

const lastMousePosition: Ref<{ x: number, y: number }> = ref({
  x: 0,
  y: 0,
})

const uiDrawingCtx = computed(() => {
  const ctx = uiCanvas.value.getContext('2d')
  if (!ctx) {
    return null
  }

  return ctx
})

function getIndexByEvent(event: InteractionEvent | DragEvent) {
  return chart.value.getIndexByLocation(getInteractionCoords(event, { x: uiCanvas.value.offsetLeft, y: uiCanvas.value.offsetTop }))
}

function drawImageAtMouse(image: HTMLImageElement, coords: { x: number, y: number }) {
  if (!uiDrawingCtx.value) {
    throw new Error('Canvas context not found, the canvas must have loaded incorrectly.')
  }

  const canvasInfo = chart.value.getScaledCanvasInfo()

  const scaledDimensions = getScaledDimensions(image, 260)

  // Dividing by the scale ratio to get the canvas's original pixel size back.
  uiDrawingCtx.value.drawImage(
    image,
    // Subtract half the image size from each coordinate, so image is centered on the mouse.
    Math.floor((coords.x / canvasInfo.scaleRatio) - (scaledDimensions.width / 2)),
    Math.floor((coords.y / canvasInfo.scaleRatio) - (scaledDimensions.height / 2)),
    scaledDimensions.width,
    scaledDimensions.height,
  )
}

function updateCursor(event: InteractionEvent) {
  const itemIndex = getIndexByEvent(event)

  const touchEvent = isTouchEvent(event)

  if (!touchEvent) {
    const canvasOffset = { x: uiCanvas.value.offsetLeft, y: uiCanvas.value.offsetTop }
    lastMousePosition.value = {
      x: (event as MouseEvent).clientX - canvasOffset.x + window.scrollX,
      y: (event as MouseEvent).clientY - canvasOffset.y + window.scrollY,
    }
    if (itemIndex !== -1 && store.chart.items[itemIndex]) {
      document.body.style.cursor = 'pointer'
    }
    else if (itemIndex === -1 && !grabbedItem.value) {
      document.body.style.cursor = 'default'
    }
  }

  if (isTouchEvent(event) && event.type !== 'touchend') {
    lastTouch.value = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    }

    const coords = getInteractionCoords(event, { x: uiCanvas.value.offsetLeft, y: uiCanvas.value.offsetTop })
    const canvasDimensions = uiCanvas.value.getBoundingClientRect()

    if (
      coords.x < 0
      || coords.x > canvasDimensions.width
      || coords.y < 0
      || coords.y > canvasDimensions.height
    ) {
      resetCursor(event)
    }
  }

  if (grabbedItem.value) {
    document.body.style.cursor = 'grab'
    // If we don't re-render, the dragged item from the previous frame remains visible and
    // it looks like that old Windows 95 bug with the window movement artifacts.
    renderInteractionChart()
    insertPlaceholder(uiDrawingCtx.value, store.chart, grabbedItem.value.originalIndex)

    const coords = getInteractionCoords(event, { x: uiCanvas.value.offsetLeft, y: uiCanvas.value.offsetTop })
    drawImageAtMouse(grabbedItem.value.itemObject.coverImg, coords)
  }
}

function resetCursor(event: InteractionEvent) {
  document.body.style.cursor = 'default'

  if (grabbedItem.value) {
    // Remove the item from the chart.
    // This is so users can remove an item by dragging it off the chart.
    store.addItem({
      item: null,
      index: grabbedItem.value.originalIndex,
    })
  }

  dropItem(event)

  grabbedItem.value = null
}

function getInteractionCoords(event: InteractionEvent, canvasOffset: { x: number, y: number }) {
  if (isTouchEvent(event)) {
    if (event.type === 'touchend') {
      return {
        x: lastTouch.value.x - canvasOffset.x + window.scrollX,
        y: lastTouch.value.y - canvasOffset.y + window.scrollY,
      }
    }
    else {
      return {
        x: event.touches[0].clientX - canvasOffset.x + window.scrollX,
        y: event.touches[0].clientY - canvasOffset.y + window.scrollY,
      }
    }
  }
  else {
    // handle mouse event
    return {
      x: event.clientX - canvasOffset.x + window.scrollX,
      y: event.clientY - canvasOffset.y + window.scrollY,
    }
  }
}

function pickUpItem(event: InteractionEvent) {
  const coords = getInteractionCoords(event, { x: uiCanvas.value.offsetLeft, y: uiCanvas.value.offsetTop })

  const itemIndex = chart.value.getIndexByLocation(coords)

  if (itemIndex === -1) {
    return null
  }

  const item = store.chart.items[itemIndex]

  // This will trigger when the user tries to drag an empty placeholder slot
  if (!item) {
    return null
  }

  if (isTouchEvent(event)) {
    lastTouch.value = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    }
  }

  grabbedItem.value = {
    originalIndex: itemIndex,
    itemObject: item,
  }

  updateCursor(event)

  renderInteractionChart()

  // Cover up the original spot since we're moving it
  insertPlaceholder(uiDrawingCtx.value, store.chart, itemIndex)

  // Draw the item at the center of the mouse cursor
  drawImageAtMouse(grabbedItem.value.itemObject.coverImg, coords)
}

function dropHTMLItem(event: DragEvent) {
  const item = event.dataTransfer?.getData('application/json')

  if (!item) {
    return null
  }

  dropItem(event)
}

function dropCanvasItem(event: InteractionEvent) {
  if (!grabbedItem.value) {
    return null
  }

  dropItem(event)
}

function dropItem(event: InteractionEvent | DragEvent) {
  const coords = getInteractionCoords(event, { x: uiCanvas.value.offsetLeft, y: uiCanvas.value.offsetTop })
  const newIndex = chart.value.getIndexByLocation(coords)

  // If the spot doesn't contain a movable item, just put the item back where it came from.
  if (newIndex === -1) {
    grabbedItem.value = null
    renderInteractionChart()
    return null
  }

  if (isDragAndDropEvent(event)) {
    const item = JSON.parse(event.dataTransfer?.getData('application/json') || 'null')

    if (!item) {
      return null
    }

    // The image element doesn't survive the JSON->string->JSON transformation
    item.coverImg = setImage(item.coverURL)

    store.addItem({
      item,
      index: newIndex,
    })
  }
  else {
    if (!grabbedItem.value) {
      return null
    }

    if (!store.chart.items[newIndex]) {
      // If the selected slot is empty, just
      // 1) move the item there

      store.addItem({
        item: grabbedItem.value.itemObject,
        index: newIndex,
      })
      // 2) and remove it from its old spot
      store.addItem({
        item: null,
        index: grabbedItem.value.originalIndex,
      })
    }
    else {
      // If there's an item in the new slot, adjust the array
      // without deleting anything.
      store.moveItem({
        item: grabbedItem.value.itemObject,
        oldIndex: grabbedItem.value.originalIndex,
        newIndex,
      })
    }
  }

  grabbedItem.value = null

  // Gets rid of the 'grab' cursor now that we're not holding the item anymore.
  updateCursor(event)

  renderInteractionChart()
}

function allowDragAndDrop(event: DragEvent) {
  event.preventDefault()
}

const drawingCtx = computed(() => {
  const ctx = canvas.value.getContext('2d')
  if (!ctx) {
    return null
  }

  return ctx
})

watch(() => store.chart, () => {
  if (store.chart.background.type === 'image' && !store.chart.background.img.complete) {
    store.chart.background.img.onload = () => {
      renderChart()
    }
  }

  renderChart()
})

onMounted(() => {
  if (!canvas.value) {
    throw new Error('Couldn\'t find canvas. Something must have gone wrong with page loading, please refresh.')
  }

  if (store.chart) {
    if (store.chart.background.type === BackgroundTypes.Image) {
      const bgImg = new Image()
      bgImg.src = store.chart.background.value
      bgImg.onload = () => {
        renderChart()
      }
      store.chart.background.img = bgImg
    }

    hydrateImages(store.chart)
  }
})

// Put the image elements into each item and set the onload callback.
// This lets the chart know to re-render when an image finishes loading.
function hydrateImages(chart: ChartType) {
  for (const item of chart.items) {
    if (item && !item.coverImg.complete) {
      item.coverImg.onload = () => {
        renderChart()
      }
    }
  }
}

function renderChart() {
  if (!canvas.value) {
    // eslint-disable-next-line no-console
    return console.log('The canvas doesn\'nt exist! Maybe it tried to re-render after being unmounted.')
  }

  if (chart.value) {
    hydrateImages(store.chart)

    chart.value.generateChart(store.chart)

    // Insert placeholders for empty squares
    store.chart.items.slice(0, store.chart.size.x * store.chart.size.y).forEach((item, index) => {
      if (!item) {
        insertPlaceholder(drawingCtx.value, store.chart, index)
      }
    })
  }
}
</script>

<template>
  <div class="canvas-container">
    <canvas
      id="chart-canvas"
      ref="canvas"
    />
    <canvas
      id="interaction-canvas"
      ref="uiCanvas"
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
    />
  </div>
</template>

<style scoped>
.canvas-container {
  display: grid;
}

.canvas-container canvas {
  grid-column: 1;
  grid-row: 1;
}

canvas {
  max-width: 95%;
  max-height: 85dvh;
  margin: auto;
  margin-top: 50px;
  border-radius: 6px;
  touch-action: none;
}

#chart-canvas {
  z-index: 1;
}

#interaction-canvas {
  z-index: 2;
}

@media screen and (max-width: 1000px) {
  canvas {
    max-width: 98%;
  }
}
</style>
