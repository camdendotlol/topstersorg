<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../../../store'

interface Props {
  label: string
  options: string[]
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
  <div class="select-input-container">
    <label :for="props.property">
      {{ props.label }}
    </label>
    <select
      :id="props.property"
      :name="props.property"
      :value="propertyValue"
      @change="updateValue"
    >
      <option v-for="opt in props.options" :key="opt" :value="opt">
        {{ `${opt[0].toLocaleUpperCase()}${opt.slice(1)}` }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.select-input-container {
  display: flex;
  justify-content: space-between;
  align-items: center;

}
select {
  display: inline;
  width: 60px;
}
</style>
