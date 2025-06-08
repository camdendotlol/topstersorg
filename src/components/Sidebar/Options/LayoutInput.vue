<script setup lang="ts">
import GridIcon from '../../../assets/grid_layout.svg?component'
import TieredIcon from '../../../assets/tiered_layout.svg?component'
import { useStore } from '../../../store'

const store = useStore()
</script>

<template>
  <span>Layout</span>
  <div class="layout-input-container">
    <button
      :class="store.chart.layout === 'grid' ? 'selected' : ''"
      type="button"
      @click="() => store.setLayout('grid')"
    >
      <GridIcon />
      <span>Grid</span>
    </button>
    <button
      :class="store.chart.layout === 'tiered' ? 'selected' : ''"
      type="button"
      @click="() => store.setLayout('tiered')"
    >
      <TieredIcon />
      <span>Tiered</span>
    </button>
  </div>
</template>

<style scoped>
.layout-input-container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.layout-input-container button {
  height: 80px;
  background: #393939;
  border: none;
  font-size: 0.8rem;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  gap: 6px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.layout-input-container button:hover {
  cursor: pointer;
  text-decoration: underline;
}

.layout-input-container button.selected,
.layout-input-container button.selected svg {
  text-decoration: underline;
  color: var(--accent);
}

svg {
  width: 26px;
  height: 26px;
}
</style>
