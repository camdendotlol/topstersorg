<script setup lang="ts">
import ChartCanvas from './ChartCanvas.vue'
import InteractionCanvas from './InteractionCanvas.vue'
import TopBar from './TopBar.vue'
</script>

<template>
  <div class="chart-builder">
    <div class="chart-builder-contents">
      <TopBar />
      <div class="canvas-container">
        <ChartCanvas id="chart-canvas" />
        <InteractionCanvas id="interaction-canvas" />
      </div>
    </div>
  </div>
</template>

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

.canvas-container {
  display: grid;
}

.canvas-container canvas {
  grid-column: 1;
  grid-row: 1;
}

#chart-canvas {
  z-index: 1;
}

#interaction-canvas {
  z-index: 2;
}

@media screen and (max-width: 1000px) {
  .chart-builder {
    width: 100%;
  }
}
</style>
