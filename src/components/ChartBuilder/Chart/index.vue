<script setup lang="ts">
import type { ComputedRef, CSSProperties } from 'vue'
import type { Chart } from '../../../types'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from '../../../store'
import { BackgroundTypes } from '../../../types'
import Row from './Row.vue'

const store = useStore()

const chartRef = ref<HTMLDivElement>(null)
const hasScaled = ref(false)

let resizeObserver: ResizeObserver | undefined
let animationFrame: number | undefined

function scheduleResize() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  animationFrame = requestAnimationFrame(() => {
    onResize()
  })
}

function onResize() {
  if (chartRef.value) {
    const parentEl = chartRef.value.parentElement

    if (!parentEl) {
      return
    }

    const windowHeight = document.documentElement.clientHeight
    const containerWidth = parentEl.offsetWidth

    const chartHeight = chartRef.value.offsetHeight + 420
    // add 100 to factor in the 50px X margins
    // plus another 50 for some reason because it looks right
    const chartWidth = chartRef.value.offsetWidth + 100

    const ratio = Math.min(containerWidth / chartWidth, windowHeight / chartHeight)

    chartRef.value.style.transform = `scale(${ratio})`
    chartRef.value.style.marginLeft = `-${Math.floor((chartWidth * ratio / 2) - (50 * ratio))}px`

    // set the parent container's height so you can scroll vertically
    // to see the whole chart on mobile
    parentEl.style.height = `${Math.floor(chartRef.value.offsetHeight * ratio + 90)}px`

    hasScaled.value = true
  }
}

// re-scale the chart when the state changes
watch([store, chartRef], async () => {
  await nextTick()
  scheduleResize()
  // { flush: 'post' } tells Vue to wait until the state is finished changing
  // before running the watcher function. otherwise, onResize runs before the
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

onMounted(async () => {
  await nextTick()

  scheduleResize()

  window.addEventListener('resize', scheduleResize)

  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      scheduleResize()
    })

    resizeObserver.observe(chartRef.value)

    if (chartRef.value.parentElement) {
      resizeObserver.observe(chartRef.value.parentElement)
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', scheduleResize)

  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div
    id="chart"
    ref="chartRef"
    :class="{ 'is-scaled': hasScaled }"
    :style="chartStyle"
  >
    <div v-if="store.chart.title">
      <p class="chart-title" :style="chartTitleStyle">
        {{ store.chart.title }}
      </p>
    </div>
    <div class="row-flex" :style="{ gap: `${store.chart.gap}px`, padding: `${store.chart.gap}px`, paddingTop: store.chart.title ? `${store.chart.gap / 2}px` : `${store.chart.gap}px` }">
      <Row v-for="rowNumber in store.chart.size.y" :key="rowNumber" :row="rowNumber" />
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
  visibility: hidden;
}

#chart.is-scaled {
  visibility: visible;
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
</style>
