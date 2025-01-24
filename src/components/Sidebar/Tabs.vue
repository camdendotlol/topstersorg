<script setup lang="ts">
import type { Tabs as TabsEnum } from '../../types'
import { BIconCaretDownFill, BIconCaretUpFill } from 'bootstrap-icons-vue'
import { useStore } from '../../store'

interface Props {
  tabs: TabsEnum[]
  currentTab: TabsEnum
}

const props = defineProps<Props>()

const emit = defineEmits([
  'setCurrentTab',
])

const store = useStore()
</script>

<template>
  <ul :class="`nav-list ${store.$state.collapsed ? 'collapsed' : ''}`">
    <li
      v-for="tab in props.tabs"
      :key="tab"
      class="nav-list-item"
    >
      <button
        class="tab-item"
        :class="{ active: props.currentTab === tab }"

        @click="emit('setCurrentTab', tab)"
      >
        {{ tab }}
      </button>
    </li>
    <li class="collapse-toggle">
      <button
        class="tab-item"
        @click="store.toggleCollapse"
      >
        <BIconCaretUpFill v-if="store.$state.collapsed" />
        <BIconCaretDownFill v-else />
      </button>
    </li>
  </ul>
</template>

<style scoped>
.nav-list {
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  gap: 4px;
}

.nav-list-item {
  list-style-type: none;
}

.tab-item {
  border: none;
  font-size: 1rem;
  padding: 4px;
  background: #b5b5b5;
  border-radius: 6px 6px 0 0;
  color: black;
}

.active {
  background: rgba(20, 20, 20, 0.8);
  color: white;
}

.tab-item:hover {
  cursor: pointer;
}

.collapse-toggle {
  display: none;
  position: absolute;
  top: -9px;
  right: 8px;
}

.collapse-toggle .tab-item {
  width: 40px;
  height: 40px;
}

.collapse-toggle svg {
  height: 20px;
  width: 20px;
  position: relative;
  top: 5px;
}

@media screen and (max-width: 1000px) {
  .active {
    text-decoration: underline;
  }

  .nav-list {
    position: absolute;
    top: calc(50dvh - 31px);
    z-index: 2;
  }

  .nav-list.collapsed {
    top: calc(100dvh - 33px);
  }

  .tab-item {
    box-shadow: 0 0 2.5px 2px rgba(0, 0, 0, 0.18);
  }

  .active {
    background: #000000;
  }

  .collapse-toggle {
    display: flex;
  }
}
</style>
