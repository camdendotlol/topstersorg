<template>
  <h1>topsters.org</h1>
  <h3>{{ subtitles[Math.floor(Math.random() * subtitles.length)] }}</h3>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      subtitles: [
        'over 9000 charts served',
        'yet another chart site'
      ]
    }
  }
})
</script>

<style scoped>
h1 {
  margin: 0 auto;
  margin-top: 20px;
  font-size: 3rem;
}
</style>
