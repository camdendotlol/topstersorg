<template>
  <div class="chart-builder">
    <div class="chart-builder-contents">
      <ChartCanvas />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChartCanvas from './ChartCanvas.vue'

enum ChartTypes {
  Music = 'music',
  Book = 'book',
  Movie = 'movie'
}

export default defineComponent({
  data () {
    return {
      chartType: ChartTypes.Book,
      header: ChartTypes.Book
    }
  },
  components: {
    ChartCanvas
  },
  methods: {
    setHeader (newChartType: ChartTypes) {
      this.chartType = newChartType
    },
    pickEmoji (chartType: ChartTypes) {
      switch (chartType) {
        case ChartTypes.Book:
          return '📗'
        case ChartTypes.Music:
          return '🎼'
        case ChartTypes.Movie:
          return '🎬'
      }
    }
  }
})
</script>

<style scoped>
.chart-builder {
  flex-grow: 1;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-builder-contents {
  margin: 0 auto;
}

@media screen and (max-width: 1000px) {
  .chart-builder {
    width: 100%;
  }
}
</style>
