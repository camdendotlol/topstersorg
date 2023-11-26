<script setup lang='ts'>
import { getStoredCharts, setStoredCharts } from '../../helpers/localStorage'
import { StoredChart } from '../../types'
import { Ref, ref } from 'vue'
import { useStore } from '../../store'
import { addImgElements } from '../../helpers/chart'

const store = useStore()

const charts: Ref<StoredChart[]> = ref(null)

store.watch(state => state.chart, () => {
  updateChartList()
})

const updateChartList = () => {
  const storedCharts = getStoredCharts()
  charts.value = storedCharts
}

const changeChart = (event: Event) => {
  // Using the Unix timestamp as a unique ID here
  const id = (event.target as HTMLFormElement).value
  const savedCharts = getStoredCharts()

  // Clear the currentlyActive flag on all other charts
  const otherChartsInactive = savedCharts.map(savedChart => {
    if (savedChart.uuid === id) {
      return { ...savedChart, currentlyActive: true }
    } else {
      return { ...savedChart, currentlyActive: false }
    }
  })

  const savedChartData = otherChartsInactive.find(chart => chart.uuid === id)

  if (!savedChartData) {
    return null
  }

  setStoredCharts(otherChartsInactive)

  const chartToSwitchTo = addImgElements(savedChartData.data)

  store.commit('setEntireChart', chartToSwitchTo)
}
</script>

<template>
  <div>
    <select
      name="chart-switcher"
      id="chart-switcher"
      @change="changeChart"
    >
      <option
        v-for="(chart, index) in charts"
        :value="chart.uuid"
        :key="index"
        :selected="chart.currentlyActive ? true : false"
      >
        {{ chart.name ? chart.name : `Untitled (${new Date(chart.timestamp).toUTCString()})` }}
      </option>
    </select>
  </div>
</template>

<style>
#chart-switcher {
  width: 140px;
}
</style>
