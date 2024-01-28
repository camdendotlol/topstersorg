// Functions related to importing and exporting charts

import pako from 'pako'
import { appendChart, findByUuid, getActiveChart, getActiveChartUuid, getNewestChartUuid, setActiveChart, updateStoredChart } from './localStorage'
import { BackgroundTypes, ChartItem, StoredChart, StoredCharts } from '../types'
import { Store } from 'vuex'
import { State } from '../store'
import { forceRefresh } from './chart'

const downloadChartData = (data: string, title: string) => {
  const blob = new Blob([data])

  const blobUrl = URL.createObjectURL(blob)

  const link = document.createElement('a')

  link.href = blobUrl
  link.download = `${title}.topster`
  document.body.appendChild(link)

  link.click()
  link.remove()
}

export const exportCurrentChart = () => {
  const uuid = getActiveChartUuid()

  const exportObj: StoredCharts = {
    [uuid]: getActiveChart()
  }

  const compressed = btoa(pako.deflate(JSON.stringify(exportObj)).toString())

  downloadChartData(compressed, exportObj[uuid].data.title)
}

export const parseUploadedText = (text: string) => {
  const uintArray = Uint8Array.from(atob(text).split(',').map(num => parseInt(num)))

  const textDecoder = new TextDecoder()

  return textDecoder.decode(pako.inflate(uintArray))
}

export const importChart = async (event: Event, store: Store<State>) => {
  const files = (event.target as HTMLInputElement).files

  try {
    const text = await files[0].text()
    const results = parseUploadedText(text)
    const json = JSON.parse(results) as StoredCharts

    const newChartUuid = Object.keys(json)[0]
    const existingChart = findByUuid(newChartUuid)
    const newChart = json[newChartUuid]

    let overwriteConsent = false

    if (existingChart) {
      if (window.confirm('This chart already exists locally. Do you want to overwrite it?')) {
        overwriteConsent = true
        updateStoredChart(newChart, newChartUuid)
        setActiveChart(newChartUuid)
        forceRefresh(store)
      }
    } else {
      overwriteConsent = true
      appendChart(newChart, newChartUuid)
      setActiveChart(newChartUuid)
      forceRefresh(store)
    }

    if (overwriteConsent) {
      alert(`"${newChart.data.title}" imported successfully!`)
    }
  } catch (e) {
    console.error(e)
    alert(`Failed to import charts: ${e}`)
  }
}

export const importTopsters2 = (event: Event, store: Store<State>) => {
  if (event.target === null) return
  const files = (event.target as HTMLInputElement).files
  if (files === null) return
  const fileReader = new FileReader()
  fileReader.addEventListener('load', () => {
    try {
      // Topsters 2 exports have their charcodes shifted up
      // 17 points, and then are encoded in base64. This
      // may have been a response to our import feature lol.
      const unshifted = atob((fileReader.result as string)
        .split('')
        .map(char => String.fromCharCode(char.charCodeAt(0) - 17))
        .join(''))

      // Parse JSON file
      const charts = JSON.parse(unshifted)[0]
      const options = JSON.parse(charts.options)

      // Import each chart
      const newCharts: StoredChart[] = []
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
            }
          }

          newCharts.push(newChart)
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

      newCharts.forEach(ch => appendChart(ch))

      // Set the newly imported chart to currently active
      setActiveChart(getNewestChartUuid())
      forceRefresh(store)
    } catch (e) {
      console.error(e)
      alert('The file selected is not a valid Topsters 2 backup: ' + e)
    }
  })

  fileReader.readAsText(files[0])
}
