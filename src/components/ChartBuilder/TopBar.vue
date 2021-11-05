<template>
  <div id="top-bar">
    <div class="switcher-menu">
      <button
        @click="deleteChart"
      >
        -
      </button>
      <Switcher />
      <button
        @click="startNewChart"
      >
        +
      </button>
    </div>
    <button
      v-if="!loading"
      class="download-button"
      @click="downloadChart"
    >
      <BIconFileEarmarkArrowDown id="save-icon" />
      Download
    </button>
    <button
      v-else
      class="download-button"
    >
      <BIconArrowRepeat id="loading-icon" />
      loading...
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import { createDownloadableChart, saveChart } from '../../api/chartGen'
import { initialState, State } from '../../store'
import { BIconFileEarmarkArrowDown, BIconArrowRepeat } from 'bootstrap-icons-vue'
import Switcher from './Switcher.vue'
import { getStoredCharts, setStoredCharts } from '../../helpers/localStorage'
import { StoredChart } from '@/types'
import { addImgElements, initializeFirstRun } from '@/helpers/chart'

export default defineComponent({
  components: {
    Switcher,
    BIconFileEarmarkArrowDown,
    BIconArrowRepeat
  },
  data () {
    return {
      // Keep track of loading so the user knows why it's taking a while.
      // Also, we can prevent the user from spamming the button to generate multiple requests.
      loading: false
    }
  },
  methods: {
    async downloadChart () {
      // TypeScript doesn't know the navigator.share types yet.
      // So let's just make it stop being annoying.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typescriptAnnoying: any = navigator

      this.loading = true

      // Clone the chart data so we don't mutate state
      const chartData = { ...this.chart }
      const downloadableChart = await createDownloadableChart(chartData)

      // If on a mobile browser, use the native share functionality.
      // Otherwise, use the normal download trick.
      if (typescriptAnnoying.canShare) {
        const chartFile = await fetch(downloadableChart.toDataURL())
        const blob = await chartFile.blob()
        const files = [
          new File(
            [blob],
            'chart.png',
            {
              type: 'image/png',
              lastModified: new Date().getTime()
            }
          )
        ]

        typescriptAnnoying.share({
          files,
          title: 'Chart',
          text: 'My topster chart from ostrakon.xyz'
        }).then(this.loading = false)
      } else {
        saveChart(downloadableChart)
      }

      this.loading = false
    },
    startNewChart () {
      const storedCharts = getStoredCharts()

      const newStoredChartsArray = storedCharts.map(chart => chart.currentlyActive ? { ...chart, currentlyActive: false } : chart)

      const newChart: StoredChart = {
        timestamp: new Date().getTime(),
        name: null,
        data: initialState.chart,
        currentlyActive: true
      }

      setStoredCharts([...newStoredChartsArray, newChart])

      this.$store.commit('reset')
    },
    deleteChart () {
      const storedCharts = getStoredCharts()

      const warningPopup = confirm('Are you sure you want to delete this chart? There\'s no way to recover it!')

      if (warningPopup === false) {
        return null
      }

      setStoredCharts(storedCharts.filter(chart => chart.currentlyActive === false))

      const newStoredCharts = getStoredCharts()

      if (newStoredCharts.length < 1) {
        // We've just deleted the only saved chart, so let's re-initialize.
        initializeFirstRun()
        this.$store.commit('reset')
      } else {
        // Fall back to the first chart in the array.
        newStoredCharts[0].currentlyActive = true
        setStoredCharts(newStoredCharts)

        addImgElements(newStoredCharts[0].data)
        this.$store.commit('setEntireChart', newStoredCharts[0].data)
      }
    }
  },
  computed: mapState({
    chart: state => (state as State).chart
  })
})
</script>

<style>
#top-bar {
  width: calc(100% - 500px);
  height: 40px;
  background: #AAE5CA;
  position: absolute;
  display: block;
  top: 0;
  left: 450px;
  border-radius: 0 0 8px 8px;
  margin: 0 auto;
  padding: 0;
  gap: 50px;
  color: white;
  box-shadow: 0 1px 2px #00003f;
}

.download-button {
  height: 30px;
  margin-right: 20px;
  width: 100px;
  bottom: 35px;
  float: right;
  position: relative;
  font-family: "Ubuntu Mono", monospace;
}

#save-icon {
  position: relative;
  top: 2px;
}

#loading-icon {
  position: relative;
  top: 2px;
  animation: rotation 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.switcher-menu {
  width: auto;
  height: 40px;
  color: #00003f;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

@media screen and (max-width: 1000px) {
  #top-bar {
    width: 100%;
    border-radius: 0;
    left: 0;
  }
}
</style>
