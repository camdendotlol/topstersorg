<script setup lang="ts">
import type { ComputedRef, CSSProperties } from 'vue'
import { BIconX } from 'bootstrap-icons-vue'
import { computed } from 'vue'
import { useStore } from '../../../store'

const props = defineProps(['item', 'index', 'title', 'number', 'size', 'captionSize'])

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

    // match the item's on-screen size, which includes the chart's scaling
    const scaledSize = (ev.currentTarget as HTMLElement).getBoundingClientRect().width
    container.style.height = `${scaledSize}px`
    container.style.width = `${scaledSize}px`

    const appEl = document.querySelector('#app')
    appEl?.appendChild(container)

    // clean up the drag image element after the drag ends
    ev.target?.addEventListener('dragend', () => container.remove(), { once: true })

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

const sizeStyle: ComputedRef<CSSProperties> = computed(() => ({
  height: `${props.size}px`,
  width: `${props.size}px`,
  minWidth: `${props.size}px`,
}))

const CAPTION_LINE_HEIGHT = 1.2

const captionStyle: ComputedRef<CSSProperties> = computed(() => ({
  width: `${props.size}px`,
  height: `${Math.ceil(props.captionSize * CAPTION_LINE_HEIGHT * 2)}px`,
  marginTop: `${Math.round(props.captionSize / 2)}px`,
  fontSize: `${props.captionSize}px`,
  lineHeight: CAPTION_LINE_HEIGHT,
}))

const imgStyle: ComputedRef<CSSProperties> = computed(() => ({
  borderRadius: store.chart.roundCorners ? '10px' : '',
  boxShadow: store.chart.shadows ? '2px 2px 4px rgba(0,0,0,0.6)' : '',
}))

function deleteItem() {
  store.addItem({ item: null, index: props.index })
}
</script>

<template>
  <div class="item-cell">
    <div
      :key="props.item ? props.item.coverURL : props.index"
      :class="`item ${props.item ? '' : 'placeholder'}`"
      :data-index="props.index"
      :title="props.title"
      :draggable="props.item ? 'true' : 'false'"
      :style="[sizeStyle, props.item ? undefined : imgStyle]"
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
    <div v-if="props.captionSize" class="caption" :style="captionStyle">
      <div class="caption-line">
        <template v-if="props.item">
          {{ store.chart.showNumbers ? `${props.number}. ` : '' }}{{ props.item.title }}
        </template>
      </div>
      <div class="caption-line">
        {{ props.item?.creator }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.caption {
  overflow: hidden;
  text-align: center;
}

.caption-line {
  white-space: nowrap;
  overflow: hidden;
}

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
