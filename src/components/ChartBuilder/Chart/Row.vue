<script setup lang="ts">
import type { ComputedRef, CSSProperties } from 'vue'
import { computed } from 'vue'
import { BASE_ITEM_SIZE } from '../../../helpers/layout'
import { useStore } from '../../../store'
import { TitlePositions } from '../../../types'
import Item from './Item.vue'

const props = defineProps<{
  start: number
  count: number
  itemSize: number
}>()

const BASE_TITLE_SIZE = 20

const store = useStore()

const rowItems = computed(() => store.items.slice(props.start, props.start + props.count))

const titlesBelow = computed(() => store.chart.showTitles && store.chart.titlePosition === TitlePositions.Below)

// Captions are as wide as their item, so they can scale with it directly
const captionSize = computed(() => titlesBelow.value ? Math.round(BASE_TITLE_SIZE * props.itemSize / BASE_ITEM_SIZE) : undefined)

const titleListStyle: ComputedRef<CSSProperties> = computed(() => {
  const lineHeight = props.count > 10 ? 1 : 1.2
  const scaledSize = BASE_TITLE_SIZE * Math.sqrt(props.itemSize / BASE_ITEM_SIZE)
  const fittingSize = props.itemSize / (props.count * lineHeight)

  return {
    lineHeight,
    fontSize: `${Math.min(scaledSize, fittingSize)}px`,
  }
})
</script>

<template>
  <div class="item-row" :style="{ gap: `${store.chart.gap}px` }">
    <template
      v-for="item in rowItems" :key="item.originalIndex"
    >
      <Item
        :item="item.data"
        :index="item.originalIndex"
        :title="item.title"
        :number="item.number"
        :size="props.itemSize"
        :caption-size="captionSize"
      />
    </template>
    <ol v-if="store.chart.showTitles && !titlesBelow && rowItems.some(i => i.title)" class="title-list" :style="titleListStyle">
      <li v-for="(item, idx) in rowItems" :key="idx">
        <span v-if="item.number">
          {{ store.chart.showNumbers ? `${item.number}.` : '' }}
          {{ item.title }}
        </span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.item-row {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.title-list {
  text-wrap-mode: nowrap;
  white-space: nowrap;
  text-align: left;
  padding: 0;
  margin: 0;
  list-style: none;
  -webkit-text-size-adjust:100%;
}
</style>
