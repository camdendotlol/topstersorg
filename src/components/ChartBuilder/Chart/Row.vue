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
  justifyContent: store.chart.titlePosition === 'left' ? 'flex-end' : 'flex-start',
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
    && store.chart.titlePosition !== TitlePosition.Below
    && rowItems.value.some(i => i?.title)
})
</script>

<template>
  <div class="item-row" :style="rowStyles">
    <TitleList
      v-if="showTitles && store.chart.titlePosition === 'left'"
      align="right"
      :items="rowItems"
      :show-numbers="store.chart.showNumbers"
    />
    <template
      v-for="item in rowItems" :key="item.originalIndex"
    >
      <Item :item="item.data" :index="item.originalIndex" :title="item.title" :size="itemSize" />
    </template>
    <TitleList
      v-if="showTitles && store.chart.titlePosition === 'right'"
      align="left"
      :items="rowItems"
      :show-numbers="store.chart.showNumbers"
    />
  </div>
</template>

<style scoped>
.item-row {
  display: flex;
  width: 100%;
}
</style>
