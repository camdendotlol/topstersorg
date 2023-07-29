<script setup lang="ts">
import Editor from './Editor/index.vue'
</script>

<template>
  <div class="chart-builder">
    <div class="chart-builder-contents">
      <Editor />
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
  width: 100%;
}
</style>
