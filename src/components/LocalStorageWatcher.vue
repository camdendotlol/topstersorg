<script setup lang="ts">
import { appendChart, getActiveChart, getActiveChartUuid, setActiveChart, updateStoredChart } from '../helpers/localStorage'
import { useStore } from '../store'

const store = useStore()

store.subscribe((_mutation, state) => {
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
})
</script>

<template>
  <slot></slot>
</template>
