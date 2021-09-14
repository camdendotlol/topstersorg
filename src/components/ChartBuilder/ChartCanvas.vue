<template>
  <canvas
    :width="canvasDimensions.x"
    :height="canvasDimensions.y"
    fillstyle="gray"
    id="chart-canvas"
  >
    test
  </canvas>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  mounted () {
    const canvas = document.getElementById('chart-canvas') as HTMLCanvasElement

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Canvas context not found')
    }

    const chartsize = this.$store.state.chart.size

    context.beginPath()
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.font = '60px Arial'
    context.fillStyle = '#e9e9e9'
    context.textAlign = 'center'
    context.fillText('My Chart', canvas.width / 2, 100)

    context.fillStyle = ('#e9e9e9')
    const margin = 100
    const gap = Math.floor((canvas.width - margin) / chartsize.x)

    for (let y = 0; y < chartsize.y; y++) {
      const height = (y * 180) + 150
      for (let x = 0; x < chartsize.x; x++) {
        context.fillRect(
          (x * gap) + (gap / 2),
          height,
          100,
          160
        )
      }
    }
  },
  data () {
    return {
      dimensions: {
        width: 400,
        height: 400
      },
      configCircle: {
        x: 100,
        y: 100,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
      }
    }
  },
  computed: {
    canvasDimensions () {
      return {
        x: (this.$store.state.chart.size.x * 200) + 200,
        y: (this.$store.state.chart.size.y * 200) + 200
      }
    }
  }
})

</script>

<style scoped>
#chart-canvas {
  border-radius: 10px;
}

canvas {
  width: 90%;
}
</style>
