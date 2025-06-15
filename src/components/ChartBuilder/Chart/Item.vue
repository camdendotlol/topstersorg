<script setup lang="ts">
import type { ComputedRef, CSSProperties } from 'vue'
import type { ChartItem } from '../../../types'
import { BIconX } from 'bootstrap-icons-vue'
import { computed } from 'vue'
import { useStore } from '../../../store'
import { TitlePosition } from '../../../types'

interface Props {
  item?: ChartItem | null
  index: number
  title?: string
  size: number
}

const props = defineProps<Props>()

const store = useStore()

function allowDrop(ev: DragEvent) {
  ev.preventDefault()
}

function handleDragStart(ev: DragEvent) {
  // don't allow the user to drag and drop placeholders
  if (!props.item) {
    return null
  }

  const dragData = JSON.stringify({
    item: props.item,
    originalIndex: props.index,
  })

  if (ev.dataTransfer) {
    const dragImg = new Image()
    dragImg.classList.add('dnd-img')
    dragImg.src = props.item.coverURL

    const container = document.createElement('div')
    container.classList.add('dnd-container')
    container.appendChild(dragImg)

    // match the item's scale to the chart
    const chart = document.getElementById('chart')
    if (chart) {
      const chartTransform = chart.style.transform
      const scaleRatio = chartTransform.slice(6, chartTransform.length - 1)
      const scaledSize = 260 * Number.parseFloat(scaleRatio)
      container.style.height = `${scaledSize}px`
      container.style.width = `${scaledSize}px`

      const appEl = document.querySelector('#app')

      if (appEl) {
        appEl.appendChild(container)

        ev.dataTransfer.effectAllowed = 'move'
        ev.dataTransfer.setData('application/json', dragData)
        ev.dataTransfer.setDragImage(container, scaledSize / 2, scaledSize / 2)
      }
    }
  }
}

function handleDrop(ev: DragEvent) {
  ev.preventDefault()

  const dragData = JSON.parse(ev.dataTransfer?.getData('application/json') || 'null')

  if (dragData) {
    if (Number.isInteger(dragData.originalIndex)) {
      store.moveItem({ item: dragData.item, oldIndex: dragData.originalIndex, newIndex: props.index })
    }
    else {
      store.addItem({ item: dragData.item, index: props.index })
    }
  }
}

const itemContainerStyle: ComputedRef<CSSProperties> = computed(() => ({
  width: `${props.size}px`,
  minWidth: `${props.size}px`,
}))

const itemStyle: ComputedRef<CSSProperties> = computed(() => ({
  boxShadow: props.item ? undefined : store.chart.shadows ? '2px 2px 4px rgba(0,0,0,0.6)' : '',
  height: (store.chart.titlePosition === 'below' && props.item) ? 'initial' : `${props.size}px`,
  width: `${props.size}px`,
  minWidth: `${props.size}px`,
}))

const imgStyle: ComputedRef<CSSProperties> = computed(() => ({
  borderRadius: store.chart.roundCorners ? '10px' : '',
  boxShadow: store.chart.shadows ? '2px 2px 4px rgba(0,0,0,0.6)' : '',
}))

function deleteItem() {
  store.addItem({ item: null, index: props.index })
}

const showTitles = computed(() => {
  return store.chart.titlePosition === TitlePosition.Below
    && store.chart.showTitles
})
</script>

<template>
  <div class="item-container" :style="itemContainerStyle">
    <div
      :key="props.item ? props.item.coverURL : props.index"
      :class="`item ${props.item ? '' : 'placeholder'}`"
      :data-index="props.index"
      :title="props.title"
      :draggable="props.item ? 'true' : 'false'"
      :style="itemStyle"
      @dragstart="handleDragStart"
      @dragover="allowDrop"
      @drop="handleDrop"
    >
      <button
        v-if="props.item"
        class="delete-button"
        data-html2canvas-ignore
        title="Delete item"
        @click="deleteItem"
      >
        <BIconX />
      </button>
      <img
        v-if="item"
        :src="item.coverURL"
        class="item-img"
        :style="imgStyle"
      >
    </div>
    <div
      v-if="item && showTitles"
      class="title-container"
    >
      <p class="title">
        {{ item.title }}
      </p>
      <p v-if="item.creator" class="creator">
        {{ item.creator }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.item-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: pinch-zoom;
  width: 100%;
}

.item-img {
  max-height: 100%;
  max-width: 100%;
}

.item-img:hover {
  cursor: pointer;
}

.delete-button {
  display: none;
  position: absolute;
  top: 10px;
  right: 10px;
  height: 60px;
  width: 60px;
  appearance: none;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  color: #ffffff;
  border: none;
}

.delete-button:hover {
  cursor: pointer;
}

.delete-button svg {
  height: 100%;
  width: 100%;
}

.item:hover .delete-button {
  display: initial;
}

.placeholder {
  background-color: rgba(90, 90, 90, 0.6);
  touch-action: auto;
}

.title-container {
  width: 80%;
  font-size: 22px;
  line-height: 1.1;
  margin-top: 6px;
}

.title-container p {
  padding: 0;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title-container .title {
  font-weight: 700;
}

.title-container .creator {
  font-weight: 300;
}

@media (hover: none) {
  .delete-button {
    display: initial;
  }
}
</style>
