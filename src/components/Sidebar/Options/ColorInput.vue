<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../../../store'

interface Props {
  label: string
  property: string
  value?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['handleChange'])

const store = useStore()
const propertyValue = computed(() => typeof props.value !== 'undefined' ? props.value : store.chart[props.property])

function updateValue(event: Event) {
  const val = (event.target as HTMLInputElement).value
  return emit('handleChange', val)
}
</script>

<template>
  <div class="color-input-container">
    <label :for="props.property">
      {{ props.label }}
    </label>
    <div class="color-input" :style="{ backgroundColor: propertyValue }">
      <input
        :id="props.property"
        :name="props.property"
        type="color"
        :value="propertyValue"
        @change="updateValue"
      >
    </div>
  </div>
</template>

<style scoped>
.color-input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color-input {
  border: 2px solid var(--input-bg);
  height: 30px;
  width: 30px;
  border-radius: 50%;
}

input:hover {
  cursor:pointer;
}

input {
  padding: 0;
  border: none;
  border-radius: 2px;
  opacity: 0;
  display: block;
  border: none;
  height: 100%;
  width: 100%;
}
</style>
