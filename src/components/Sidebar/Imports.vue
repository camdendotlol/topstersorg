<template>
  <div id="imports">
    <div class="container">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { getStoredCharts, setStoredCharts } from '../../helpers/localStorage'
import { BackgroundTypes, StoredChart, ChartItem } from '@/types'
import pako from 'pako'

export default defineComponent({
  methods: {
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
  }
})
</script>

<style scoped>
#imports {
  display: flex;
  background: var(--blue-bg);
  margin-top: 0;
  padding: 0;
  border-radius: 0 0 5px 5px;
  text-align: left;
  overflow-y: scroll;
  max-height: 500px;
}

.container {
  width: 100%;
  padding: 10px;
}

</style>
