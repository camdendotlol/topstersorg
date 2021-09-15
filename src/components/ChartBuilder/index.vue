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

export default defineComponent({
  components: {
    ChartCanvas
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
