<script setup lang="ts">
import { Tabs as TabsEnum } from '../../types'

interface Props {
  tabs: TabsEnum[],
  currentTab: TabsEnum
}

const props = defineProps<Props>()

const emit = defineEmits([
  'setCurrentTab'
])
</script>

<template>
  <ul class="nav-list">
    <li
      class="nav-list-item"
      v-for="tab in props.tabs"
      v-bind:key="tab"
    >
      <button
        class="tab-item"
        :class="{active: props.currentTab === tab}"

        @click="emit('setCurrentTab', tab)"
      >
        {{ tab }}
      </button>
    </li>
  </ul>
</template>

<style scoped>
.nav-list {
  display: flex;
  margin: 0;
  padding: 0;
  border-radius: 10px 10px 0 0;
  width: 100%;
  gap: 4px;
  /* justify-content: space-between; */
}

.nav-list-item {
  list-style-type: none;
}

.tab-item {
  border: none;
  font-size: 1rem;
  padding: 6px;
  background: #808080;
  border-radius: 5px 5px 0 0;
}

.active {
  background: rgba(20, 20, 20, 0.8);
}

.tab-item:hover {
  cursor: pointer;
}
</style>
