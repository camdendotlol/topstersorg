<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import ControlPanel from './ControlPanel.vue'
import Chart from './Chart.vue'

const container = ref(null)

const containerWidth = ref(0)
const containerHeight = ref(0)

const resizeObserver = new ResizeObserver((els) => {
  els.forEach((el) => {
    containerWidth.value = el.contentRect.width
    containerHeight.value = el.contentRect.height
  })
})

onMounted(() => {
  resizeObserver.observe(container.value)
})

onUnmounted(() => {
  resizeObserver.disconnect()
})

const configEditorBg = ref({
  x: 0,
  y: 0,
  width: containerWidth.value,
  height: containerHeight.value,
  fill: 'lightblue'
})

const configKonva = ref({
  width: containerWidth.value,
  height: containerHeight.value
})

watch([containerHeight, containerWidth], () => {
  configEditorBg.value = {
    ...configEditorBg.value,
    width: containerWidth.value,
    height: containerHeight.value
  }

  configKonva.value = {
    width: containerWidth.value,
    height: containerHeight.value
  }
})
</script>

<template>
  <div class="container" ref="container">
    <v-stage :config="configKonva" id="editor-canvas">
      <v-layer>
        <v-rect :config="configEditorBg"></v-rect>
      </v-layer>
      <Chart />
      <ControlPanel :key="configEditorBg.width" :margin-left="Math.max((configEditorBg.width / 2) - 200)" />
    </v-stage>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  width: auto;
  margin: 0;
  padding: 0;
}
</style>
