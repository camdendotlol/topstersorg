<script setup lang='ts'>
import { getActiveChartUuid, getStoredCharts, getUuids, setActiveChart } from '../../helpers/localStorage'
import { StoredCharts } from '../../types'
import { Ref, ref } from 'vue'
import { useStore } from '../../store'
import { addImgElements } from '../../helpers/chart'

const store = useStore()

const activeChartUuid: Ref<string> = ref(getActiveChartUuid())
const charts: Ref<StoredCharts> = ref(getStoredCharts())
const chartUuids: Ref<string[]> = ref(getUuids())

store.watch(state => state.chart, () => {
  updateChartList()
})

const sortUuids = (uuidArr: string[]) => (
  uuidArr.toSorted((a, b) => charts.value[b].timestamp - charts.value[a].timestamp)
)

const updateChartList = () => {
  activeChartUuid.value = getActiveChartUuid()
  charts.value = getStoredCharts()
  chartUuids.value = sortUuids(getUuids())
}

const changeChart = (event: Event) => {
  const uuid = (event.target as HTMLFormElement).value

  const newActiveChart = setActiveChart(uuid)

  const chartToSwitchTo = addImgElements(newActiveChart.data)

  activeChartUuid.value = uuid

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
        v-for="(uuid, index) in chartUuids"
        :value="uuid"
        :key="index"
        :selected="uuid === activeChartUuid"
      >
        {{ charts[uuid]?.name ? charts[uuid]?.name : `Untitled (${new Date(charts[uuid]?.timestamp).toUTCString()})` }}
      </option>
    </select>
  </div>
</template>

<style>
#chart-switcher {
  width: 140px;
}
</style>
