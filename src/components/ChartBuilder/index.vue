<template>
  <div class="chart-builder">
    <div class="chart-builder-contents">
      <h1>Create a {{ chartType }} chart</h1>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
  methods: {
    setHeader (newChartType: ChartTypes) {
      this.chartType = newChartType
    }
  }
})
</script>

<style scoped>
.chart-builder {
  flex-grow: 1;
  height: 100%;
  margin: 0;
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
