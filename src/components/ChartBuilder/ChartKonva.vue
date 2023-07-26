<script setup lang="ts">
import { useStore } from '../../store'
import { ref } from 'vue'

const store = useStore()

const scaleFactor = ref(0)
const container = ref(null)

// watch(container, () => {
//   console.log(container.value)
//   scaleFactor.value = container.value && container.value.clientWidth
//     ? pixelDimensions.x / container.value.parentElement.clientWidth
//     : 0
// })

const maxItemTitleWidth = 0

// height/width of each square cell
const CELL_SIZE = 360

const chartTitleMargin = store.state.chart.title === '' ? 0 : 60

const pixelDimensions = {
  // room for each cell + gap between cells + margins
  x: (store.state.chart.size.x * (CELL_SIZE + store.state.chart.gap)) + store.state.chart.gap + maxItemTitleWidth,
  y: (store.state.chart.size.y * (CELL_SIZE + store.state.chart.gap)) + store.state.chart.gap + chartTitleMargin
}

// const getScaleFloat = (parentValue: number, measureValue: number) => (
//   measureValue / parentValue
// )

const configKonva = {
  width: pixelDimensions.x,
  height: pixelDimensions.y,
  scale: {
    x: 0.5,
    y: 0.5
  }
}

const configChartBg = {
  x: 0,
  y: 0,
  width: pixelDimensions.x,
  height: pixelDimensions.y,
  fill: 'gray',
  stroke: 'black',
  strokeWidth: 4
}
</script>

<template>
  <div class="container" ref="container">
    <v-stage :config="configKonva" id="chart-canvas">
      <v-layer>
        <v-rect :config="configChartBg"></v-rect>
      </v-layer>
    </v-stage>
  </div>
</template>

<style scoped>
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

.container {
  max-width: 95%;
  max-height: 85vh;
  margin: auto;
  margin-top: 50px;
  border-radius: 5px;
  height: 100%;
  width: 100%;
}

@media screen and (max-width: 1000px) {
  canvas {
    max-width: 98%;
  }
}
</style>
