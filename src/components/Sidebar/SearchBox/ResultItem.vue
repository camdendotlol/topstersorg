<script setup lang="ts">
interface Props {
  imageData: {
    src: string,
    alt: string
  }
}

const props = defineProps<Props>()

</script>

<template>
  <img
    :src="props.imageData.src"
    :alt="props.imageData.alt"
  >
</template>
