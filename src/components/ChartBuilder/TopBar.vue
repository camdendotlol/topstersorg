<template>
  <div id="top-bar">
    <div class="switcher-menu">
      <button
        @click="deleteCurrentChart"
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
      @click="saveChart"
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
import getChart from '../../api/chartGen'
import { initialState, State } from '../../store'
import { BIconFileEarmarkArrowDown, BIconArrowRepeat } from 'bootstrap-icons-vue'
import Switcher from './Switcher.vue'
import { getStoredCharts, setStoredCharts } from '../../helpers/localStorage'
import { StoredChart } from '@/types'

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
    async saveChart () {
      this.loading = true

      const chart = await getChart(this.chart)
      const url = window.URL.createObjectURL(chart)

      // TypeScript doesn't know the navigator.share types yet.
      // So let's just make it stop being annoying.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typescriptAnnoying: any = navigator

      // If on a mobile browser, use the native share functionality.
      // Otherwise, use the normal download trick.
      if (typescriptAnnoying.canShare) {
        const files = [
          new File(
            [chart],
            'chart.jpg',
            {
              type: 'image/jpeg',
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
        const a = document.createElement('a')

        a.style.display = 'none'
        a.href = url
        a.download = 'chart.jpg'

        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        window.URL.revokeObjectURL(url)

        this.loading = false
      }
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
    }
  },
  computed: mapState({
    chart: state => (state as State).chart
  })
})
</script>

<style>
#top-bar {
  width: calc(100vw - 420px);
  height: 40px;
  background: #AAE5CA;
  position: relative;
  display: block;
  top: 0;
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
    width: 100vw;
    border-radius: 0;
  }
}
</style>
