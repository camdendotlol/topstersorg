<script setup lang="ts">
import type { ComputedRef, CSSProperties } from 'vue'
import type { Chart } from '../../../types'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from '../../../store'
import { BackgroundTypes } from '../../../types'
import Row from './Row.vue'
import TitleList from './TitleList.vue'

const store = useStore()

const chartRef = ref<HTMLDivElement | null>(null)

function onResize() {
  if (chartRef.value && chartRef.value.parentElement) {
    const windowHeight = document.documentElement.clientHeight
    const containerWidth = chartRef.value.parentElement.offsetWidth

    const chartHeight = chartRef.value.offsetHeight + 420

    // add 100 to factor in the 50px X margins
    const chartWidth = chartRef.value.offsetWidth + 100

    const ratio = Math.min(containerWidth / chartWidth, windowHeight / chartHeight)

    chartRef.value.style.transform = `scale(${ratio})`
    chartRef.value.style.marginLeft = `-${Math.floor((chartWidth * ratio / 2) - (50 * ratio))}px`

    // set the parent container's height so you can scroll vertically
    // to see the whole chart on mobile
    const parentEl = chartRef.value.parentElement
    parentEl.style.height = `${Math.floor(chartRef.value.offsetHeight * ratio + 90)}px`
  }
}

// re-scale the chart when the state changes
watch([store, chartRef], () => {
  onResize()
  // { flush: 'post' } tells Vue to wait until the state is finished changing
  // before running the watch callback. otherwise, onResize runs before the
  // chart is finished updating and gets stuck one state update behind.
}, { flush: 'post' })

function getBackgroundStyle(chart: Chart): CSSProperties {
  if (chart.backgroundType === BackgroundTypes.Color) {
    return ({
      backgroundColor: store.chart.backgroundColor,
    })
  }

  // default to black background when no image URL has been entered
  if (!chart.backgroundUrl) {
    return ({
      backgroundColor: '#000000',
    })
  }

  return ({
    backgroundImage: `url("${store.chart.backgroundUrl}")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  })
}

const chartTitleStyle: ComputedRef<CSSProperties> = computed(() => ({
  marginTop: `${store.chart.gap / 2}px`,
}))

const chartStyle: ComputedRef<CSSProperties> = computed(() => ({
  fontFamily: store.chart.font || 'monospace',
  textShadow: store.chart.shadows ? '2px 2px 4px rgba(0,0,0,0.6)' : 'none',
  borderRadius: store.chart.roundCorners ? '10px' : '0',
  color: store.chart.textColor,
  ...getBackgroundStyle(store.chart),
}))

onMounted(() => {
  window.onresize = onResize
})

onUnmounted(() => {
  window.onresize = null
})

// whether to display the titles on the righthand side for tiered charts
const showTieredTitles = computed(() => {
  return store.chart.layout === 'tiered'
    && store.chart.showTitles
    && store.chart.titlePosition !== 'below'
    && store.items.some(i => i?.title)
})

const titleListContainerStyles: ComputedRef<CSSProperties> = computed(() => ({
  marginTop: `${store.chart.gap}px`,
  marginLeft: '0px',
  marginRight: `${store.chart.gap / 2}px`,
}))
</script>

<template>
  <div
    id="chart"
    ref="chartRef"
    :style="chartStyle"
  >
    <p v-if="store.chart.title" class="chart-title" :style="chartTitleStyle">
      {{ store.chart.title }}
    </p>
    <div class="chart-content">
      <template v-if="showTieredTitles && store.chart.titlePosition === 'left'">
        <div
          class="title-list-container"
          :style="titleListContainerStyles"
        >
          <TitleList
            v-for="row in store.rows"
            :key="row.start"
            align="right"
            :items="store.items.slice(row.start, row.end)"
            :show-numbers="store.chart.showNumbers"
          />
        </div>
      </template>
      <div
        class="row-flex"
        :style="{ gap: `${store.chart.gap}px`, padding: `${store.chart.gap}px`, paddingTop: store.chart.title ? `${store.chart.gap / 2}px` : `${store.chart.gap}px` }"
      >
        <Row v-for="(row, idx) in store.rows" :key="idx" :row="row" />
      </div>
      <template v-if="showTieredTitles && store.chart.titlePosition === 'right'">
        <div
          class="title-list-container"
          :style="titleListContainerStyles"
        >
          <TitleList
            v-for="row in store.rows"
            :key="row.start"
            align="left"
            :items="store.items.slice(row.start, row.end)"
            :show-numbers="store.chart.showNumbers"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style>
#chart {
  margin: 50px 20px;
  display: inline-block;
  position: absolute;
  transform-origin: top left;
  top: 0;
}

#chart .chart-title {
  font-size: 50px;
  padding: 0;
  margin: 0;
}

#chart .row-flex {
  display: flex;
  flex-flow: column;
  margin: 0;
  padding: 0;
  width: 100%;
}

.chart-content {
  display: flex;
}

.title-list-container {
  display: flex;
  flex-flow: column;
}
</style>
