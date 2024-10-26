<script setup lang="ts">
import { useStore } from '../../store'

const props = defineProps(['items'])

const store = useStore()
</script>

<template>
  <div class="item-row">
    <div v-for="(item, idx) in props.items" :key="idx" class="item" :style="{ height: 260, width: 260 }">
      <img :src="item.coverURL" :alt="item.title">
      <span v-if="store.chart.titlePosition === 'below'">{{ item.title }}</span>
    </div>
  </div>
</template>
