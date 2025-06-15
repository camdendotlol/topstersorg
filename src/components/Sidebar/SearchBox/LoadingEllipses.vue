<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const ellipses = ref('')
const direction = ref('up')
const interval = ref<number | null>(null)

function getNewEllipses(el: string) {
  let result

  if (direction.value === 'up') {
    result = `${el}.`
  }
  else {
    result = el.slice(0, el.length - 1)
  }

  if (result.length === 0) {
    direction.value = 'up'
  }
  else if (result.length === 3) {
    direction.value = 'down'
  }

  return result
}

onMounted(() => {
  interval.value = setInterval(() => (
    ellipses.value = getNewEllipses(ellipses.value)
  ), 100)
})

onBeforeUnmount(() => {
  if (interval.value) {
    clearInterval(interval.value)
  }
})
</script>

<template>
  <span>
    {{ ellipses }}
  </span>
</template>
