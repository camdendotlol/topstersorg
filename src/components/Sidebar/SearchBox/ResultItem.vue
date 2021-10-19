<template>
  <img
    :src="this.imageData.src"
    :alt="this.imageData.alt"
  >
</template>

<script>
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  props: [
    'imageData'
  ]
})
</script>

<style>

</style>
