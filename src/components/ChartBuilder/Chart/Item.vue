<script setup lang="ts">
import type { ComputedRef, CSSProperties } from 'vue'
import type { ChartItem } from '../../../types'
import { BIconX } from 'bootstrap-icons-vue'
import { computed } from 'vue'
import { useStore } from '../../../store'
import { TitlePosition } from '../../../types'

interface Props {
  item?: ChartItem
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
    const chartTransform = chart.style.transform
    const scaleRatio = chartTransform.slice(6, chartTransform.length - 1)
    const scaledSize = 260 * Number.parseFloat(scaleRatio)
    container.style.height = `${scaledSize}px`
    container.style.width = `${scaledSize}px`

    const appEl = document.querySelector('#app')
    appEl.appendChild(container)

    ev.dataTransfer.effectAllowed = 'move'
    ev.dataTransfer.setData('application/json', dragData)
    ev.dataTransfer.setDragImage(container, scaledSize / 2, scaledSize / 2)
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

const itemStyle: ComputedRef<CSSProperties> = computed(() => {
  return {
    borderRadius: props.item ? undefined : store.chart.roundCorners ? `${props.size}px` : '',
    boxShadow: props.item ? undefined : store.chart.shadows ? '2px 2px 4px rgba(0,0,0,0.6)' : '',
    height: `${props.size}px`,
    width: `${props.size}px`,
    minWidth: `${props.size}px`,
  }
})

const imgStyle: ComputedRef<CSSProperties> = computed(() => ({
  borderRadius: store.chart.roundCorners ? '10px' : '',
  boxShadow: store.chart.shadows ? '2px 2px 4px rgba(0,0,0,0.6)' : '',
}))

function deleteItem() {
  store.addItem({ item: null, index: props.index })
}
</script>

<template>
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
    <span v-if="store.chart.titlePosition === TitlePosition.Below">{title}</span>
  </div>
</template>

<style scoped>
.item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: pinch-zoom;
}

.item-img {
  max-height: 100%;
  max-width: 100%;
  height: inherit;
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

@media (hover: none) {
  .delete-button {
    display: initial;
  }
}
</style>
