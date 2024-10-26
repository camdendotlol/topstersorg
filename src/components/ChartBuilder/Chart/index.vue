<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CSSProperties, Ref } from 'vue'
import { useStore } from '../../../store'
import { BackgroundTypes } from '../../../types'
import GridChart from '../GridChart.vue'

const store = useStore()

const backgroundStyle: Ref<CSSProperties> = ref({})

watch(() => store.chart.background, () => {
  backgroundStyle.value = store.chart.background.type === BackgroundTypes.Color
    ? { backgroundColor: store.chart.background.value }
    : { backgroundImage: `url("${store.chart.background.value}")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }
})
</script>

<template>
  <div id="chart" :style="{ margin: store.chart.gap, ...backgroundStyle }">
    <div v-if="store.chart.title">
      {{ store.chart.title }}
    </div>
    <GridChart v-if="store.chart.layout === 'grid'" />
    <p v-if="store.chart.layout === 'tiered'">
      WIP
    </p>
  </div>
</template>

<style>
#chart {
  margin-top: 60px;
  max-width: 100%;
}
</style>
