<script setup lang="ts">
import { onMounted } from 'vue'
import { initializeFirstRun } from '../helpers/chart'
import {
  appendChart,
  chartMigrations,
  getActiveChart,
  getActiveChartUuid,
  localStorageMigrations,
  setActiveChart,
  updateStoredChart,
} from '../helpers/localStorage'
import { useStore } from '../store'

const store = useStore()

onMounted(() => {
  localStorageMigrations()
  chartMigrations()

  const activeChart = getActiveChart()

  if (activeChart) {
    store.setEntireChart(activeChart.data)
  }
  else {
    initializeFirstRun()
    store.setEntireChart(getActiveChart().data)
  }
})

store.$subscribe((mutation, state) => {
  const activeChartUuid = getActiveChartUuid()
  const activeChart = getActiveChart()

  if (activeChart) {
    const updatedChart = {
      ...activeChart,
      data: state.chart,
    }

    updateStoredChart(updatedChart, activeChartUuid)
  }
  else {
    const newUuid = appendChart({
      timestamp: new Date().getTime(),
      data: state.chart,
    })

    setActiveChart(newUuid)
  }
})
</script>

<template>
  <slot />
</template>
