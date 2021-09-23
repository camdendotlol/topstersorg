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

      ctx.font = 'bold 46pt monospace'
      ctx.fillStyle = '#e9e9e9'
      ctx.textAlign = 'center'
      ctx.fillText(this.title, canvas.width / 2, 70)

      ctx.fillStyle = ('#e9e9e9')

      // height/width of each square cell
      const cellSize = 260

      // gap between cells (pixels)
      const gap = 10
      this.getCoverImages(ctx, cellSize, gap, canvas)
    },
    getCoverImages (ctx: CanvasRenderingContext2D, cellSize: number, gap: number, canvas: HTMLCanvasElement) {
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

      const insertImage = (item: ChartItem, index: number, coords: { x: number, y: number }) => {
        const dimensions = getScaledDimensions(item.coverImg)

        ctx.drawImage(
          item.coverImg,
          ((coords.x * cellSize) + 55 + (coords.x * gap)) + findCenteringOffset(dimensions.width),
          ((coords.y * cellSize) + 100 + (coords.y * gap)) + findCenteringOffset(dimensions.height),
          dimensions.width,
          dimensions.height
        )
      }

      const insertTitle = (item: ChartItem, index: number, coords: { x: number, y: number }, maxWidth: number) => {
        const titleString = item.creator ? `${item.creator} - ${item.title}` : item.title
        ctx.fillText(
          titleString,
          canvas.width - maxWidth,
          (40 * index) + 130 + ((coords.y % (index + 1)) * 50)
        )
      }

      const maxWidth = this.maxTitleWidth()

      this.items.forEach((item: ChartItem, index: number) => {
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

        insertImage(item, index, coords)
        if (this.showTitles) {
          ctx.font = '19pt monospace'
          ctx.textAlign = 'left'
          insertTitle(item, index, coords, maxWidth)
        }
      })
    },
    maxTitleWidth () {
      const ctx = (document.getElementById('chart-canvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
      ctx.font = '19pt monospace'
      let maxTitleWidth = 0

      if (this.$store.state.chart.showTitles) {
        for (let x = 0; x < this.items.length; x++) {
          const item = this.items[x]
          const name = item.creator ? `${item.creator} - ${item.title}` : item.title
          if (maxTitleWidth < ctx.measureText(name).width) {
            maxTitleWidth = ctx.measureText(name).width + 50
          }
        }

        if (maxTitleWidth > 800) {
          maxTitleWidth = 800
        }
      }

      return maxTitleWidth
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
    },
    showTitles () {
      this.renderChart()
    }
  },
  computed: mapState({
    title: state => (state as State).chart.title,
    size: state => ({
      x: (state as State).chart.size.x,
      y: (state as State).chart.size.y
    }),
    pixelDimensions (state) {
      return {
        // room for each cell + 10px gap between cells + margins
        x: ((state as State).chart.size.x * 270) + 100 + this.maxTitleWidth(),
        y: ((state as State).chart.size.y * 270) + 160
      }
    },
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

canvas {
  max-width: 90%;
  max-height: 90vh;
}
</style>
