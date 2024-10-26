<script setup lang="ts">
import { useStore } from '../../store'

const store = useStore()

function getGridTemplateValue(num: number) {
  return '1fr '.repeat(num)
}
</script>

<template>
  <div class="item-grid" :style="{ gridTemplateColumns: getGridTemplateValue(store.chart.size.x), gridTemplateRows: getGridTemplateValue(store.chart.size.y) }" />
</template>

<style>
.item-grid {
  display: grid;
}
</style>
