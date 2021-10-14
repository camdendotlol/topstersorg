<template>
  <img
    :src="this.src"
    :alt="this.alt"
  >
</template>

<script>
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  props: [
    'imageSrc',
    'altText'
  ],
  data () {
    return {
      src: this.imageSrc,
      alt: this.altText
    }
  }
})
</script>

<style>

</style>
