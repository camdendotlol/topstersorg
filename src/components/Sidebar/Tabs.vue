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
  padding: 10px 0;
  gap: 5px;
  border-radius: 10px 10px 0 0;
  width: 400px;
  justify-content: space-around;
  position: absolute;
  background: black;
}

.nav-list-item {
  list-style-type: none;
}

.active {
  color: red;
}

.tab-item:hover {
  cursor: pointer;
}
</style>
