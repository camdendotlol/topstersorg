<template>
  <canvas
    fillstyle="gray"
    id="chart-canvas"
  >
    test
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

      const context = canvas.getContext('2d')

      canvas.width = this.pixelDimensions.x
      canvas.height = this.pixelDimensions.y

      if (!context) {
        throw new Error('Canvas context not found')
      }

      context.beginPath()
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.font = '52px Arial'
      context.fillStyle = '#e9e9e9'
      context.textAlign = 'center'
      context.fillText(this.title, canvas.width / 2, 100)

      context.fillStyle = ('#e9e9e9')
      const margin = 100
      const gap = Math.floor((canvas.width - margin) / this.size.x)

      for (let y = 0; y < this.size.y; y++) {
        const height = (y * 180) + 150
        for (let x = 0; x < this.size.x; x++) {
          context.fillRect(
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
    items: state => (state as State).chart.items
  })
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
