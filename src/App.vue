<template>
  <Home />
</template>

<script>
import { defineComponent } from '@vue/runtime-core'
import Home from './Home.vue'
import { ping } from './api/metadata'

export default defineComponent({
  components: {
    Home
  },
  async mounted () {
    await ping()
  }
})
</script>

<style>

</style>
