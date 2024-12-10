<script setup lang="ts">
import type { CSSProperties, Ref } from 'vue'
import { ref, watch } from 'vue'
import { useStore } from '../../../store'
import { BackgroundTypes } from '../../../types'
import Row from './Row.vue'

const store = useStore()

const backgroundStyle: Ref<CSSProperties> = ref({})

watch(() => [store.chart.backgroundType, store.chart.backgroundColor, store.chart.backgroundUrl], () => {
  backgroundStyle.value = store.chart.backgroundType === BackgroundTypes.Color
    ? { backgroundColor: store.chart.backgroundColor }
    : { backgroundImage: `url("${store.chart.backgroundUrl}")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }
})
</script>

<template>
  <svg id="chart" :style="backgroundStyle">
    <div v-if="store.chart.title">
      {{ store.chart.title }}
    </div>
    <div class="row-flex">
      <Row v-for="rowNumber in store.chart.size.y" :key="rowNumber" :row="rowNumber" />
    </div>
  </svg>
</template>

<style scoped>
#chart {
  max-height: 100%;
  max-width: 100%;
  border-radius: 5px;
  margin: 50px 20px;
}

.row-flex {
  display: flex;
  flex-flow: column;
}
</style>
