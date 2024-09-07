<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
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

  hydrateImages(store.chart)

  generateChart(
    canvas.value,
    store.chart,
  )

  // Insert placeholders for empty squares
  store.chart.items.slice(0, store.chart.size.x * store.chart.size.y).forEach((item, index) => {
    if (!item) {
      insertPlaceholder(drawingCtx.value, store.chart, index)
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
