<script setup lang="ts">
import Konva from 'konva'
import { onMounted, ref } from 'vue'
import { useStore } from '../../../store'
import updateWithShim from '../../../helpers/shim'
import { BackgroundTypes, Chart, StoredChart } from '../../../types'
import { getStoredCharts, setStoredCharts } from '../../../helpers/localStorage'

const store = useStore()

const ITEM_SIZE = 360

const chartLayer = ref(null)

const chartTitleMargin = store.state.chart.title === '' ? 0 : 60

const maxItemTitleWidth = 0

const pixelDimensions = ref({
  // room for each cell + gap between cells + margins
  x: (store.state.chart.size.x * (ITEM_SIZE + store.state.chart.gap)) + store.state.chart.gap + maxItemTitleWidth,
  y: (store.state.chart.size.y * (ITEM_SIZE + store.state.chart.gap)) + store.state.chart.gap + chartTitleMargin
})

store.subscribe(() => {
  pixelDimensions.value = {
    x: (store.state.chart.size.x * (ITEM_SIZE + store.state.chart.gap)) + store.state.chart.gap + maxItemTitleWidth,
    y: (store.state.chart.size.y * (ITEM_SIZE + store.state.chart.gap)) + store.state.chart.gap + chartTitleMargin
  }
})

const chartLayerConfig = ref({
  x: 100,
  y: 100,
  cornerRadius: 10,
  height: pixelDimensions.value.y,
  width: pixelDimensions.value.x,
  scale: {
    x: 0.2,
    y: 0.2
  },
  fill: 'gray'
})

const chartItemConfig = {
  x: 100,
  y: 100,
  cornerRadius: 5,
  draggable: true,
  dragBoundFunc: (pos) => {
    return ({
      x: Math.round(pos.x / 30) * 30,
      y: Math.round(pos.y / 30) * 30
    })
  },
  shadowEnabled: true,
  shadowColor: 'black',
  shadowBlur: 10,
  shadowOffset: { x: 20, y: 20 },
  shadowOpacity: 0.5,
  width: ITEM_SIZE,
  height: ITEM_SIZE
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

const hydrateImages = () => {
  store.state.chart.items.filter(Boolean).forEach((item) => {
    if (!item.coverImg.onload) {
      const img = new Image()
      img.src = item.coverURL
      item.coverImg = img

      item.coverImg.onload = () => {
        const img = new Konva.Image({
          ...chartItemConfig,

          image: item.coverImg
        })

        if (chartLayer.value && chartLayer.value.getNode) {
          chartLayer.value.getNode().add(img)
        }
      }
    }
  })

  saveToLocalStorage(store.state.chart)
}

onMounted(() => {
  const savedCharts: StoredChart[] = getStoredCharts()
  const activeChart = savedCharts.find(chart => chart.currentlyActive === true)

  if (activeChart) {
    const updatedChart = updateWithShim(activeChart.data)
    if (updatedChart.background.type === BackgroundTypes.Image) {
      const bgImg = new Image()
      bgImg.src = updatedChart.background.value
      bgImg.onload = () => {
        hydrateImages()
      }
      updatedChart.background.img = bgImg
    }

    hydrateImages()
    console.log(updatedChart)
    store.commit('setEntireChart', updatedChart)
  }

  hydrateImages()
})

store.subscribe(() => {
  hydrateImages()
})

</script>

<template>
  <v-layer ref="chartLayer">
    <v-rect :config="chartLayerConfig"></v-rect>
  </v-layer>
</template>

<style scoped>
</style>
