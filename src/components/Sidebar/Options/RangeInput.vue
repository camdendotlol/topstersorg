<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../../../store'

interface Props {
  label: string
  property: string
  min: number
  max: number
  value?: number
  dataListStepInterval?: number
}

const props = defineProps<Props>()
const emit = defineEmits(['handleChange'])

const store = useStore()
const propertyValue = computed(() => typeof props.value !== 'undefined' ? props.value : store.chart[props.property])

function updateValue(event: Event) {
  const val = Number.parseInt((event.target as HTMLInputElement).value)
  return emit('handleChange', val)
}
</script>

<template>
  <div class="range-input-container">
    <label :for="props.property">
      {{ props.label }}
    </label>
    <div class="slider-container">
      <input
        :id="props.property"
        :name="props.property"
        type="range"
        :value="propertyValue"
        :min="props.min"
        :max="props.max"
        :list="`${props.property}Marks`"
        @input="updateValue"
      >
      <datalist v-if="props.dataListStepInterval" :id="`${props.property}Marks`">
        <!-- need to include 0 manually if the slider starts at 0 -->
        <option v-if="props.min === 0" :value="0" />
        <option v-for="idx in props.max / props.dataListStepInterval" :key="idx" :value="idx * props.dataListStepInterval" />
      </datalist>
      <span class="value-display">{{ propertyValue }}</span>
    </div>
  </div>
</template>

<style scoped>
.range-input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

input[type=range] {
  appearance: none;
  background: none;
}

input[type=range]::-moz-range-progress {
  background-color: var(--accent);
}

input[type=range]::-moz-range-track {
  width: 100%;
  height: 2px;
  cursor: pointer;
  background: #3071A9;
  background-color: var(--input-bg);
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: #3071A9;
  border-radius: 5px;
  background-color: var(--input-bg);
}

input[type=range]::-webkit-slider-thumb {
  height: 16px;
  width: 16px;
  border: none;
  border-radius: 50%;
  box-shadow: 1px 1px 1px #000000;
  background: var(--accent);
  cursor: pointer;
  appearance: none;
  position: relative;
  bottom: 6px;
}

input[type=range]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border: none;
  border-radius: 50%;
  box-shadow: 1px 1px 1px #000000;
  background: var(--accent);
  cursor: pointer;
  appearance: none;
  position: relative;
  bottom: 6px;
}

.slider-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.value-display {
  width: 20px;
}
</style>
