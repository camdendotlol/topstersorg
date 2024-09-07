<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import generateChart from '../../chartgen'
import { useStore } from '../../store'
import { BackgroundTypes } from '../../types'
import { insertPlaceholder } from './lib'
import type { Chart } from '../../types'

const canvas: Ref<HTMLCanvasElement> = ref(null)

const store = useStore()

const drawingCtx = computed(() => {
  const ctx = canvas.value.getContext('2d')
  if (!ctx) {
    return null
  }

  return ctx
})

store.watch(state => state.chart, () => {
  if (store.state.chart.background.type === 'image' && !store.state.chart.background.img.complete) {
    store.state.chart.background.img.onload = () => {
      renderChart()
    }
  }

  renderChart()
})

onMounted(() => {
  if (!canvas.value) {
    throw new Error('Couldn\'t find canvas. Something must have gone wrong with page loading, please refresh.')
  }

  if (store.state.chart) {
    if (store.state.chart.background.type === BackgroundTypes.Image) {
      const bgImg = new Image()
      bgImg.src = store.state.chart.background.value
      bgImg.onload = () => {
        renderChart()
      }
      store.state.chart.background.img = bgImg
    }

    hydrateImages(store.state.chart)
  }
})

// Put the image elements into each item and set the onload callback.
// This lets the chart know to re-render when an image finishes loading.
function hydrateImages(chart: Chart) {
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

  hydrateImages(store.state.chart)

  generateChart(
    canvas.value,
    store.state.chart,
  )

  // Insert placeholders for empty squares
  store.state.chart.items.slice(0, store.state.chart.size.x * store.state.chart.size.y).forEach((item, index) => {
    if (!item) {
      insertPlaceholder(drawingCtx.value, store.state.chart, index)
    }
  })
}
</script>

<template>
  <canvas
    id="chart-canvas"
    ref="canvas"
  />
</template>

<style scoped>
#chart-canvas {
  border-radius: 6px;
  touch-action: none;
}

canvas {
  max-width: 95%;
  max-height: 85dvh;
  margin: auto;
  margin-top: 50px;
}

@media screen and (max-width: 1000px) {
  canvas {
    max-width: 98%;
  }
}
</style>
