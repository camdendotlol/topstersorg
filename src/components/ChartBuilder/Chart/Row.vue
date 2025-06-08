<script setup lang="ts">
import type { ComputedRef, CSSProperties } from 'vue'
import type { Row } from '../../../types'
import { computed } from 'vue'
import { useStore } from '../../../store'
import { TitlePosition } from '../../../types'
import Item from './Item.vue'

interface Props {
  row: Row
}

const props = defineProps<Props>()

const store = useStore()

const rowItems = computed(() => store.items.slice(props.row.start, props.row.end))

const titleListStyle: ComputedRef<CSSProperties> = computed(() => ({
  lineHeight: (props.row.end - props.row.start) > 10 ? '1' : '1.2',
}))

const rowStyles: ComputedRef<CSSProperties> = computed(() => ({
  gap: `${store.chart.gap}px`,
}))

const itemSize = computed(() => {
  if (store.chart.layout === 'tiered') {
    const itemCount = props.row.end - props.row.start
    const baseSize = (6 * 260) + (store.chart.gap * (6 + 1))

    return Math.round((baseSize / itemCount) - store.chart.gap)
  }
  else {
    return 260
  }
})
</script>

<template>
  <div class="item-row" :style="rowStyles">
    <template
      v-for="item in rowItems" :key="item.originalIndex"
    >
      <Item :item="item.data" :index="item.originalIndex" :title="item.title" :size="itemSize" />
    </template>
    <ol v-if="store.chart.titlePosition === TitlePosition.Right && store.chart.showTitles && rowItems.some(i => i.title)" class="title-list" :style="titleListStyle">
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
  font-size: 20px;
  line-height: 1;
  list-style: none;
  -webkit-text-size-adjust:100%;
}
</style>
