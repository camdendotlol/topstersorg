<script setup lang="ts">
interface Props {
  size: number
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="loading-spinner"
    role="status"
    aria-label="Loading"
    :style="{ width: `${props.size}px`, height: `${props.size}px`, borderWidth: `${Math.max(2, props.size / 10)}px` }"
  />
</template>

<style scoped>
.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  box-sizing: border-box;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.25);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    rotate: 360deg;
  }
}
</style>
