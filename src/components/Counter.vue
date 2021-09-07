<template>
    <div id="counter">
      Counter: {{ counter }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      counter: 0
    }
  },
  mounted () {
    setInterval(() => {
      this.counter++
    }, 1000)
  }
})
</script>
