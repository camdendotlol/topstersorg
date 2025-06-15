<script setup lang="ts">
import type { ItemData } from '../../../types'

interface Props {
  items: ItemData[]
  showNumbers: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <ol class="title-list">
    <li v-for="(item, idx) in props.items" :key="idx">
      <span v-if="item?.number">
        {{ props.showNumbers ? `${item.number}.` : '' }}
        {{ item.title }}
      </span>
    </li>
  </ol>
</template>

<style scoped>
.title-list {
  text-wrap-mode: nowrap;
  white-space: nowrap;
  text-align: left;
  padding: 0;
  margin: 10px;
  font-size: 20px;
  line-height: 1;
  list-style: none;
  -webkit-text-size-adjust:100%;
}
</style>
