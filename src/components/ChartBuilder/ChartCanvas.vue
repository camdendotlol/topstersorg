<template>
  <canvas id="chart-canvas">
    If you can see this, it means your browser doesn't support Canvas. Canvas is pretty important for the function of the site! Sorry!
  </canvas>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import { State } from '../../store'

export default defineComponent({
  mounted () {
    this.renderChart()
  },
  methods: {
    renderChart () {
      console.log('now rendering!')
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

      ctx.font = '52px Arial'
      ctx.fillStyle = '#e9e9e9'
      ctx.textAlign = 'center'
      ctx.fillText(this.title, canvas.width / 2, 100)

      ctx.fillStyle = ('#e9e9e9')
      const margin = 100
      const gap = Math.floor((canvas.width - margin) / this.size.x)

      for (let y = 0; y < this.size.y; y++) {
        const height = (y * 180) + 150
        for (let x = 0; x < this.size.x; x++) {
          ctx.fillRect(
            (x * gap) + (gap / 2),
            height,
            100,
            160
          )
        }
      }
    }
  },
  watch: {
    title () {
      this.renderChart()
    },
    size () {
      this.renderChart()
    },
    items () {
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
      x: ((state as State).chart.size.x * 200) + 200,
      y: ((state as State).chart.size.y * 200) + 200
    }),
    items: state => (state as State).chart.items,
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
