<script setup lang="ts">
import type { ComputedRef, CSSProperties } from 'vue'
import type { Row } from '../../../types'
import { computed } from 'vue'
import { useStore } from '../../../store'
import { TitlePosition } from '../../../types'
import Item from './Item.vue'
import TitleList from './TitleList.vue'

interface Props {
  row: Row
}

const props = defineProps<Props>()

const store = useStore()

const rowItems = computed(() => store.items.slice(props.row.start, props.row.end))

const rowStyles: ComputedRef<CSSProperties> = computed(() => ({
  gap: `${store.chart.gap}px`,
}))

const itemSize = computed(() => {
  if (store.chart.layout === 'tiered') {
    const itemCount = props.row.end - props.row.start
    const baseSize = (6 * 260) + (store.chart.gap * (6 + 1))

    return (baseSize / itemCount) - store.chart.gap
  }
  else {
    return 260
  }
})

const showTitles = computed(() => {
  return store.chart.showTitles
    && store.chart.layout === 'grid'
    && store.chart.titlePosition === TitlePosition.Right
    && rowItems.value.some(i => i?.title)
})
</script>

<template>
  <div class="item-row" :style="rowStyles">
    <template
      v-for="item in rowItems" :key="item.originalIndex"
    >
      <Item :item="item.data" :index="item.originalIndex" :title="item.title" :size="itemSize" />
    </template>
    <TitleList
      v-if="showTitles"
      :items="rowItems"
      :show-numbers="store.chart.showNumbers"
    />
  </div>
</template>

<style scoped>
.item-row {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}
</style>
