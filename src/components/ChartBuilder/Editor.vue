<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

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
  console.log('resizeObserver observing.')
  resizeObserver.observe(container.value)
})

onUnmounted(() => {
  console.log('resizeObserver disconnecting.')
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
    </v-stage>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
