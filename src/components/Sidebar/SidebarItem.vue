<script setup lang="ts">
import { ref, Ref } from 'vue'

interface Props {
  defaultOpen: boolean,
  label: string
}

const props = defineProps<Props>()

const isOpen: Ref<boolean> = ref(props.defaultOpen)
</script>

<template>
  <div>
    <button
      class="section-toggle"
      :class="{ 'active-section-toggle': isOpen }"
      @click="isOpen = !isOpen"
    >
      <span v-if="isOpen">-</span>
      <span v-else>+</span>
      <span class="label">{{ props.label }}</span>
    </button>
    <div class="sidebar-item-content" v-if="isOpen">
      <div class="container">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-toggle {
  width: 100%;
  margin: 10px auto 0;
  padding: 8px;
  border: none;
  font-size: 16px;
  background: var(--ui-bg);
  color: var(--text-color);
  font-family: monospace;
  font-weight: bold;
}

.section-toggle:hover {
  cursor: pointer;
}

.sidebar-item-content {
  display: flex;
  margin-top: 0;
  margin-left: 10px;
  padding: 0;
  text-align: left;
  overflow-y: scroll;
}

.active-section-toggle {
  border-radius: 5px 5px 0 0;
}

.active-section-toggle .label {
  text-decoration: underline;
}

button {
  display: flex;
  align-items: center;
}

button span {
  margin-left: 10px;
}

ul {
  padding: 0;
}

li {
  list-style-type: none;
  margin-bottom: 10px;
}

.container {
  width: 100%;
  margin: auto;
  margin-left: 30px;
}

</style>
