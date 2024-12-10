<script setup lang="ts">
import { useStore } from '../../../store'

const props = defineProps(['row'])

const store = useStore()
</script>

<template>
  <!-- <div class="item-row"> -->
  <image
    v-for="(item, idx) in store.chart.items.slice(props.row * store.chart.size.y, (props.row * store.chart.size.y) + store.chart.size.x)" :key="idx" class="item" :style="{ padding: `${store.chart.gap / 2}px` }" :href="item.coverURL" :alt="item.title"
  >
    <!-- <img v-if="item" :src="item.coverURL" :alt="item.title"> -->
  </image>
  <!-- </div> -->
</template>

<style scoped>
.item-row {
  display: flex;
}

.item {
  max-height: 260px;
  max-width: 260px;
}

img {
  max-height: 100%;
  max-width: 100%;
}
</style>
