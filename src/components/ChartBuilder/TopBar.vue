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
      <button
        @click="importTopsters2Charts"
      >
        Import from Topsters 2
      </button>
      <input
        type="file"
        style="display: none"
        ref="importTopsters2"
        accept="application/json"
        @change="importTopsters2ChartsPicked"/>
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
import { initialState, State } from '../../store'
import { BIconFileEarmarkArrowDown, BIconArrowRepeat } from 'bootstrap-icons-vue'
import Switcher from './Switcher.vue'
import { getStoredCharts, setStoredCharts } from '../../helpers/localStorage'
import { BackgroundTypes, StoredChart, ChartItem } from '@/types'
import { addImgElements, downloadChart, initializeFirstRun } from '@/helpers/chart'
import pako from 'pako'

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
      await downloadChart(this.chart)
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
    },
    importTopsters2Charts () {
      (this.$refs.importTopsters2 as HTMLFormElement).click()
    },
    importTopsters2ChartsPicked (event: Event) {
      if (event.target === null) return
      const files = (event.target as HTMLInputElement).files
      if (files === null) return
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        try {
          // Parse JSON file
          const charts = JSON.parse(fileReader.result as string)[0]
          const options = JSON.parse(charts.options)

          // Import each chart
          const textDecoder = new TextDecoder()
          const storedCharts = getStoredCharts()
          const failed = []
          for (const chart of Object.entries(options.charts)) {
            let prefix = chart[0] + '-'
            if (prefix === 'cards-') prefix = ''
            const name = chart[1] as string

            try {
              const custom = JSON.parse(charts[prefix + 'custom'])
              const size = charts[prefix + 'size']
              const chartSize = { x: 3, y: 3 }
              switch (size) {
                case '25': // Collage
                  chartSize.x = custom.columns
                  chartSize.y = custom.rows
                  break
                case '40': // Top 40
                  chartSize.x = 5
                  chartSize.y = 8
                  break
                case '42': // Top 42
                  chartSize.x = 6
                  chartSize.y = 7
                  break
                case '100': // Top 100
                  chartSize.x = 10
                  chartSize.y = 10
                  break
                default: // This should not happen, but set it to the max size just in case
                  chartSize.x = 12
                  chartSize.y = 12
                  break
              }

              // Get background and parse if it's an image
              let background = charts[prefix + 'background']
              let backgroundImg = null
              if (!background.startsWith('#')) {
                try {
                  // Parse URL
                  const imgURL = background.match(/url\("(.+?)"\)/)
                  if (imgURL === null) throw new Error()
                  background = imgURL[1]
                  backgroundImg = new Image()
                  backgroundImg.src = background
                } catch (e) {
                  // Invalid URL format, set background color to black as fallback
                  background = '#000000'
                }
              }

              // Chart cards are compressed with zlib + encoded with base64
              const chartCards = charts[prefix + 'cards'] // Get base64 string
              const cardsCompressed = Uint8Array.from(atob(chartCards.substring(1, chartCards.length - 1)), c => c.charCodeAt(0)) // Convert base64 to bytes
              const cardsDecompressed = textDecoder.decode(pako.inflate(cardsCompressed)) // Decompress and convert to text
              const cards = JSON.parse(cardsDecompressed) // Parse cards

              // Create chart items
              const items: Array<ChartItem | null> = []
              for (const card of cards) {
                // Empty card
                if (card.src === '') {
                  items.push(null)
                  continue
                }

                // Create item image
                const img = new Image()
                img.src = card.src

                // Create item
                const item: ChartItem = {
                  title: card.title,
                  coverURL: card.src,
                  coverImg: img
                }
                items.push(item)
              }

              // Create new chart
              const newChart: StoredChart = {
                timestamp: new Date().getTime(),
                name: name,
                data: {
                  title: '',
                  items: items,
                  size: chartSize,
                  background: {
                    type: background.startsWith('#') ? BackgroundTypes.Color : BackgroundTypes.Image,
                    value: background,
                    img: backgroundImg
                  },
                  shadows: custom.shadowed,
                  showNumbers: charts[prefix + 'numbered'] === 'true',
                  showTitles: charts[prefix + 'titled'] === 'true',
                  gap: custom.padding * 5,
                  font: custom.fontFamily
                },
                currentlyActive: false
              }

              storedCharts.push(newChart)
            } catch (e) {
              console.error(e)
              failed.push(name)
            }
          }

          if (failed.length > 0) {
            alert('Failed to import the following charts: ' + failed.join(', '))
          } else {
            alert('Charts imported successfully!')
          }

          setStoredCharts(storedCharts)
          this.$store.commit('setEntireChart', storedCharts.filter((chart) => chart.currentlyActive)[0].data) // Force update, possibly a better way of doing this?
        } catch (e) {
          console.error(e)
          alert('The file selected is not a valid Topsters 2 backup: ' + e)
        }
      })

      fileReader.readAsText(files[0])
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
  background: var(--green-bg);
  position: absolute;
  display: block;
  top: 0;
  left: 450px;
  border-radius: 0 0 8px 8px;
  margin: 0 auto;
  padding: 0;
  gap: 50px;
  color: white;
  box-shadow: 0 1px 2px var(--dark-blue);
}

.download-button {
  height: 30px;
  margin-right: 20px;
  width: 120px;
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
  color: var(--dark-blue);
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

  .download-button {
    display: none;
  }
}
</style>
