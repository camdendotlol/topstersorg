<script setup lang="ts">
import { ref, watch } from 'vue'
import LoadingSpinner from '../../LoadingSpinner.vue'

interface Props {
  imageData: {
    src: string
    alt: string
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  imageError: [src: string]
}>()

const isLoading = ref(true)

function handleError() {
  isLoading.value = false
  emit('imageError', props.imageData.src)
}

watch(() => props.imageData.src, () => {
  isLoading.value = true
})
</script>

<template>
  <div :class="`result-item ${isLoading ? 'loading' : ''}`">
    <LoadingSpinner
      v-if="isLoading"
      :size="24"
    />
    <img
      :src="props.imageData.src"
      :alt="props.imageData.alt"
      @load="isLoading = false"
      @error="handleError"
    >
  </div>
</template>

<style scoped>
.result-item {
  position: relative;
}

.result-item img {
  display: block;
  width: 100%;
}

.result-item:hover {
  cursor: pointer;
}

.result-item.loading {
  aspect-ratio: 1;
  background-color: rgba(90, 90, 90, 0.6);
}

.result-item.loading img {
  position: absolute;
  inset: 0;
  opacity: 0;
}
</style>
