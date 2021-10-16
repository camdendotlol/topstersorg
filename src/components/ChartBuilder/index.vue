<template>
  <div class="chart-builder">
    <div class="chart-builder-contents">
      <TopBar />
      <ChartCanvas />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChartCanvas from './ChartCanvas.vue'
import TopBar from './TopBar.vue'

export default defineComponent({
  components: {
    ChartCanvas,
    TopBar
  }
})
</script>

<style scoped>
.chart-builder {
  flex-grow: 1;
  margin: 0;
  text-align: center;
  padding: 0;
}

.chart-builder-contents {
  margin: 0 auto;
  padding: 0;
}

@media screen and (max-width: 1000px) {
  .chart-builder {
    width: 100%;
  }
}
</style>
