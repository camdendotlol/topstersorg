<script setup lang="ts">
import { ref, Ref } from 'vue'
import { getStoredCharts, setStoredCharts } from '../../helpers/localStorage'
import { BackgroundTypes, StoredChart, ChartItem, Period, LastfmChartResponseItem } from '../../types'
import { initialState, useStore } from '../../store'
import pako from 'pako'
import { getLastfmChart } from '../../api/lastfm'
import { createNewChart, periodHeaders } from '../../helpers/chart'

const store = useStore()

const topsters2ImportRef: Ref<HTMLInputElement> = ref(null)

const lastFmUsername: Ref<HTMLInputElement> = ref(null)
const lastFmPeriodDropdown: Ref<HTMLSelectElement> = ref(null)

const importTopsters2Charts = (e) => {
  e.preventDefault()
  topsters2ImportRef.value.click()
}

const importTopsters2ChartsPicked = (event: Event) => {
  if (event.target === null) return
  const files = (event.target as HTMLInputElement).files
  if (files === null) return
  const fileReader = new FileReader()
  fileReader.addEventListener('load', () => {
    try {
      // Topsters 2 exports have their charcodes shifted up
      // 17 points, and then are encoded in base64. This
      // may have been a response to our import feature lol
      const unshifted = atob((fileReader.result as string)
        .split('')
        .map(char => String.fromCharCode(char.charCodeAt(0) - 17))
        .join(''))

      // Parse JSON file
      const charts = JSON.parse(unshifted)[0]
      const options = JSON.parse(charts.options)

      // Import each chart
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

          const textDecoder = new TextDecoder()

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
            name,
            data: {
              title: '',
              items,
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
      // Force update, possibly a better way of doing this?
      store.commit('setEntireChart', storedCharts.filter((chart) => chart.currentlyActive)[0].data)
    } catch (e) {
      console.error(e)
      alert('The file selected is not a valid Topsters 2 backup: ' + e)
    }
  })

  fileReader.readAsText(files[0])
}

const importLastFmChart = async () => {
  const username = lastFmUsername.value.value

  if (!username) return null

  const periodDropdown = lastFmPeriodDropdown.value
  const period = periodDropdown.options[periodDropdown.selectedIndex].value as Period

  let results: LastfmChartResponseItem[]

  try {
    results = await getLastfmChart(username, 'albums', period)
  } catch {
    alert('Something went wrong when downloading your Last.fm data! Is your username spelled correctly?')
    return null
  }
  const missingCovers: string[] = []

  const filtered = results.filter((item: LastfmChartResponseItem) => {
    const coverURL = item.image.find((i) => i.size === 'extralarge')['#text']

    if (coverURL === '') {
      missingCovers.push(`${item.artist.name} - ${item.name}`)
      return false
    }

    return true
  })

  const newItems: ChartItem[] = filtered.map((item: LastfmChartResponseItem) => {
    const coverURL = item.image.find((i) => i.size === 'extralarge')['#text']
    const coverImg = new Image()
    coverImg.src = coverURL

    return {
      title: item.name,
      creator: item.artist.name,
      coverImg,
      coverURL
    }
  })

  createNewChart(`${username}'s ${periodHeaders[period]} Chart`)

  const getSize = (length) => {
    for (let i = 1; i <= 10; i++) {
      if (length < (i * i)) {
        return {
          x: i,
          y: i
        }
      }
    }

    return {
      x: 10,
      y: 10
    }
  }

  store.commit('setEntireChart', {
    ...initialState.chart,
    title: `${username}'s ${periodHeaders[period]} Chart`,
    items: newItems,
    size: getSize(newItems.length)
  })

  if (missingCovers.length > 0) {
    alert(
      `Couldn't add the following albums because they're missing cover art on Last.fm:\n\n${missingCovers.join('\n\n')}`
    )
  }
}
</script>

<template>
  <div class="container">
    <p>Imported data will be added to a new chart.</p>
    <form
      id="lastFmImportChart"
      @submit.prevent="importLastFmChart"
    >
      <h2>Last.fm</h2>
      <div class="form-item">
        <label for="lastfm-username">
          Username
        </label>
        <input
          type="text"
          ref="lastFmUsername"
          id="lastFmUsername"
          name="lastFmUsername"
          placeholder="username"
          required
        />
      </div>
      <div class="form-item">
        <label for="lastFmPeriodDropdown">
          Period
        </label>
        <select
          id="lastFmPeriodDropdown"
          name="lastFmPeriodDropdown"
          ref="lastFmPeriodDropdown"
        >
          <option value="overall">Overall</option>
          <option value="7day">7 day</option>
          <option value="1month">1 month</option>
          <option value="3month">3 month</option>
          <option value="6month">6 month</option>
          <option value="12month">12 month</option>
        </select>
      </div>
      <button
        type="submit"
        id="lastfmImportButton"
        class="import-button"
      >
        Import from Last.fm
      </button>
    </form>
    <div id="topsters2ImportForm">
      <form>
        <h2>Topsters 2</h2>
        <button
          class="import-button"
          @click="importTopsters2Charts"
        >
          Import file from Topsters 2
        </button>
        <input
          type="file"
          style="display: none"
          ref="topsters2ImportRef"
          accept="application/json"
          @change="importTopsters2ChartsPicked"
        />
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  display: flex;
  gap: 20px;
  flex-flow: column;
 }

 h2 {
   margin-top: 0;
 }

 p {
   margin: 0;
 }

 .import-button {
   max-width: 200px;
   align-self: center;
 }

 #topsters2ImportForm {
  text-align: center;
 }

 #topsters2ImportForm button {
   max-width: 240px;
 }

#lastFmImportChart {
  display: flex;
  flex-flow: column;
  gap: 10px;
 }

 .form-item {
   display: grid;
   grid-template-columns: 1fr 1fr;
   align-items: center;
 }

</style>
