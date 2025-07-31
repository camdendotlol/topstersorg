<script setup lang="ts">
import GridIcon from '../../../assets/grid_layout.svg?component'
import TieredIcon from '../../../assets/tiered_layout.svg?component'
import { useStore } from '../../../store'

const store = useStore()
</script>

<template>
  <div class="container">
    <span>
      Layout
    </span>
    <div
      aria-label="layout"
      class="layout-input-container"
    >
      <button
        aria-label="Grid"
        :class="store.chart.layout === 'grid' ? 'selected' : ''"
        type="button"
        @click="() => store.setLayout('grid')"
      >
        <GridIcon />
        <span>Grid</span>
      </button>
      <button
        aria-label="Tiered"
        :class="store.chart.layout === 'tiered' ? 'selected' : ''"
        type="button"
        @click="() => store.setLayout('tiered')"
      >
        <TieredIcon />
        <span>Tiered</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.layout-input-container {
  display: inline-flex;
  color: white;
  font-size: 0.8rem;
  justify-content: flex-end;
  gap: 20px;
}

.layout-input-container button {
  height: 60px;
  width: 60px;
  border: none;
  background: #393939;
  border-radius: 4px;
  display: flex;
  flex-flow: column;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.layout-input-container button:hover {
  cursor: pointer;
}

.layout-input-container button.selected {
  color: var(--accent);
  outline: 1px solid var(--accent);
}

svg {
  width: 20px;
  height: 20px;
}
</style>
