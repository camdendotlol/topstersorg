<template>
  <div>
    <select
      name="chart-switcher"
      id="chart-switcher"
      @change="changeChart"
    >
      <option
        v-for="(chart, index) in this.charts"
        :value="chart.timestamp"
        :key="index"
        :selected="chart.currentlyActive ? true : false"
      >
        {{ chart.name ? chart.name : `Untitled (${new Date(chart.timestamp).toUTCString()})` }}
      </option>
    </select>
  </div>
</template>

<script lang='ts'>
import { getStoredCharts, setStoredCharts } from '@/helpers/localStorage'
import { StoredChart } from '@/types'
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import { State } from '../../store'
import { addImgElements } from '../../helpers/chart'

export default defineComponent({
  methods: {
    updateChartList () {
      const storedCharts = getStoredCharts()
      this.charts = storedCharts
    },
    changeChart (event: Event) {
      // Using the Unix timestamp as a unique ID here
      const id = parseInt((event.target as HTMLFormElement).value)
      const savedCharts = getStoredCharts()

      // Clear the currentlyActive flag on all other charts
      const otherChartsInactive = savedCharts.map(savedChart => {
        if (savedChart.timestamp === id) {
          return { ...savedChart, currentlyActive: true }
        } else {
          return { ...savedChart, currentlyActive: false }
        }
      })

      const savedChartData = otherChartsInactive.find(chart => chart.timestamp === id)

      if (!savedChartData) {
        return null
      }

      setStoredCharts(otherChartsInactive)

      const chartToSwitchTo = addImgElements(savedChartData.data)

      this.$store.commit('setEntireChart', chartToSwitchTo)
    }
  },
  data (): { charts: StoredChart[] } {
    return {
      charts: []
    }
  },
  computed: {
    ...mapState({
      chartState: state => (state as State).chart
    })
  },
  watch: {
    chartState () {
      this.updateChartList()
    }
  }
})
</script>

<style>
#chart-switcher {
  width: 140px;
}
</style>
