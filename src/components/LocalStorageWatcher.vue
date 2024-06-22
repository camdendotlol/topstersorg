<script setup lang="ts">
import { onMounted } from 'vue'
import {
  appendChart,
  getActiveChart,
  getActiveChartUuid,
  localStorageMigrations,
  setActiveChart,
  updateStoredChart
} from '../helpers/localStorage'
import { useStore } from '../store'
import { initializeFirstRun } from '../helpers/chart'

const store = useStore()

onMounted(() => {
  localStorageMigrations()

  const activeChart = getActiveChart()

  if (activeChart) {
    store.commit('setEntireChart', activeChart.data)
  } else {
    initializeFirstRun()
    store.commit('setEntireChart', getActiveChart().data)
  }
})

store.subscribe((mutation, state) => {
  if (mutation.type === 'setEntireChart') {
    store.commit('hydrateImages')
  } else {
    const activeChartUuid = getActiveChartUuid()
    const activeChart = getActiveChart()

    if (activeChart) {
      const updatedChart = {
        ...activeChart,
        data: state.chart
      }

      updateStoredChart(updatedChart, activeChartUuid)
    } else {
      const newUuid = appendChart({
        timestamp: new Date().getTime(),
        data: state.chart
      })

      setActiveChart(newUuid)
    }
  }
})
</script>

<template>
  <slot></slot>
</template>
