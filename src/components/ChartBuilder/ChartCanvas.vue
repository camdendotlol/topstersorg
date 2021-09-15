<template>
  <canvas id="chart-canvas">
    If you can see this, it means your browser doesn't support Canvas. Canvas is pretty important for the function of the site! Sorry!
  </canvas>
</template>

<script lang="ts">
import { ChartItem } from '@/types'
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import { State } from '../../store'

export default defineComponent({
  mounted () {
    this.renderChart()
  },
  methods: {
    renderChart () {
      const canvas = document.getElementById('chart-canvas') as HTMLCanvasElement

      const ctx = canvas.getContext('2d')

      canvas.width = this.pixelDimensions.x
      canvas.height = this.pixelDimensions.y

      if (!ctx) {
        throw new Error('Canvas ctx not found')
      }

      ctx.beginPath()
      ctx.fillStyle = this.color
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = 'bold 46pt Courier'
      ctx.fillStyle = '#e9e9e9'
      ctx.textAlign = 'center'
      ctx.fillText(this.title, canvas.width / 2, 70)

      ctx.fillStyle = ('#e9e9e9')

      // height/width of each square cell
      const cellSize = 260

      // gap between cells (pixels)
      const gap = 10
      this.getCoverImages(ctx, cellSize, gap)
    },
    getCoverImages (ctx: CanvasRenderingContext2D, cellSize: number, gap: number) {
      const getScaledDimensions = (img: HTMLImageElement) => {
        let differencePercentage = 1

        if (img.width > cellSize && img.height > cellSize) {
          differencePercentage = Math.min((cellSize / img.width), (cellSize / img.height))
        } else if (img.width > cellSize) {
          differencePercentage = cellSize / img.width
        } else if (img.height > cellSize) {
          differencePercentage = cellSize / img.height
        } else if (img.width < cellSize && img.height < cellSize) {
          differencePercentage = Math.min((cellSize / img.width), (cellSize / img.height))
        }

        return {
          height: Math.floor(img.height * differencePercentage),
          width: Math.floor(img.width * differencePercentage)
        }
      }

      const findCenteringOffset = (dimension: number) => {
        if (dimension < cellSize) {
          return Math.floor((cellSize - dimension) / 2)
        } else {
          return 0
        }
      }

      const insertImage = (item: ChartItem, index: number) => {
        // Don't overflow outside the bounds of the chart
        // This way, items will be saved if the chart is too big for them
        // and the user can just expand the chart and they'll fill in again
        if (index + 1 > this.size.x * this.size.y) {
          return null
        }

        const coords = {
          x: index % this.size.x,
          y: Math.floor(index / this.size.x)
        }

        const dimensions = getScaledDimensions(item.coverImg)

        ctx.drawImage(
          item.coverImg,
          ((coords.x * cellSize) + 55 + (coords.x * gap)) + findCenteringOffset(dimensions.width),
          ((coords.y * cellSize) + 100 + (coords.y * gap)) + findCenteringOffset(dimensions.height),
          dimensions.width,
          dimensions.height
        )
      }

      this.items.forEach((item: ChartItem, index: number) => {
        item.coverImg.onload = () => {
          insertImage(item, index)
        }
        insertImage(item, index)
      })
    }
  },
  watch: {
    title () {
      this.renderChart()
    },
    size () {
      this.renderChart()
    },
    // Vue can't watch arrays directly, so this is a
    // goofy hack to watch the length instead.
    itemCount () {
      this.renderChart()
    },
    color () {
      this.renderChart()
    }
  },
  computed: mapState({
    title: state => (state as State).chart.title,
    size: state => ({
      x: (state as State).chart.size.x,
      y: (state as State).chart.size.y
    }),
    pixelDimensions: state => ({
      // room for each cell + 10px gap between cells + margins
      x: ((state as State).chart.size.x * 270) + 100,
      y: ((state as State).chart.size.y * 270) + 160
    }),
    items: state => (state as State).chart.items,
    itemCount: state => (state as State).chart.items.length,
    color: state => (state as State).chart.color
  })
})

</script>

<style scoped>
#chart-canvas {
  border-radius: 10px;
}

canvas {
  max-width: 90%;
  max-height: 90vh;
}
</style>
