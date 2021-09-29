<template>
  <canvas id="chart-canvas">
    If you can see this, it means your browser doesn't support Canvas. Canvas is pretty important for the function of the site! Sorry!
  </canvas>
  <button
    id="save-button"
    @click="saveChart"
  >
    <BIconFileEarmarkArrowDown />
    <br>
    Save
  </button>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { BIconFileEarmarkArrowDown } from 'bootstrap-icons-vue'
import { mapState } from 'vuex'
import { State } from '../../store'
import topster from 'topster'
import getChart from '../../api/chartGen'
import { Chart, SavedChart } from '@/types'

export default defineComponent({
  components: {
    BIconFileEarmarkArrowDown
  },
  mounted () {
    // check for saved chart in local storage
    const savedCharts: SavedChart[] = JSON.parse(localStorage.getItem('charts') || '[]')

    if (savedCharts) {
      const activeChart = savedCharts.find(chart => chart.currentlyActive)
      if (activeChart) {
        for (const item of activeChart.data.items) {
          const img = new Image()
          img.src = item.coverURL
          item.coverImg = img

          // make sure they all load in
          img.onload = () => {
            this.insertChart()
          }
        }
        this.$store.commit('setEntireChart', activeChart.data)
      }
    }

    this.insertChart()
  },
  methods: {
    insertChart () {
      const canvasElement = document.getElementById('chart-canvas') as HTMLCanvasElement

      topster(
        canvasElement,
        this.chart
      )

      this.saveToLocalStorage(this.chart)
    },
    saveToLocalStorage (chart: Chart) {
      const savedCharts: SavedChart[] = JSON.parse(localStorage.getItem('charts') || '[]')

      // if the chart's already saved
      if (savedCharts) {
        const activeChart = savedCharts.find(chart => chart.currentlyActive)
        if (activeChart) {
          const updatedChart = {
            ...activeChart,
            data: chart
          }
          const newChartArray = savedCharts.filter(chart => chart !== activeChart).concat(updatedChart)
          return localStorage.setItem('charts', JSON.stringify(newChartArray))
        }
      }

      // if it's new
      const newChartArray = [
        {
          name: 'first',
          data: chart,
          currentlyActive: true
        }
      ]
      return localStorage.setItem('charts', JSON.stringify(newChartArray))
    },
    async saveChart () {
      const chart = await getChart(this.chart)
      const url = window.URL.createObjectURL(chart)
      const a = document.createElement('a')

      a.style.display = 'none'
      a.href = url
      a.download = 'chart.jpg'

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      window.URL.revokeObjectURL(url)
    }
  },
  watch: {
    title () {
      this.insertChart()
    },
    size () {
      this.insertChart()
    },
    // Vue can't watch arrays directly, so this is a
    // goofy hack to watch the length instead.
    itemCount () {
      this.insertChart()
    },
    color () {
      this.insertChart()
    },
    showTitles () {
      this.insertChart()
    }
  },
  computed: mapState({
    chart: state => (state as State).chart,
    title: state => (state as State).chart.title,
    size: state => ({
      x: (state as State).chart.size.x,
      y: (state as State).chart.size.y
    }),
    items: state => (state as State).chart.items,
    itemCount: state => (state as State).chart.items.length,
    color: state => (state as State).chart.color,
    showTitles: state => (state as State).chart.showTitles
  })
})

</script>

<style scoped>
#chart-canvas {
  border-radius: 10px;
}

#save-button {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  padding: 20px;
  border-radius: 50%;
  border: 2px solid #e9e9e9;
  background: transparent;
  color: #e9e9e9;
  height: 5rem;
  width: 5rem;
  font-size: 0.8rem;
  transition: 0.2s;
}

#save-button:hover {
  cursor: pointer;
  background: #e9e9e9;
  color: #00003f;
}

#save-button svg {
  height: 1.8rem;
  width: 1.8rem;
}

canvas {
  max-width: 90%;
  max-height: 90vh;
}
</style>
