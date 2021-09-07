<template>
    <div id="counter">
      <p>Counter: {{ counter }}</p>
      <button v-on:click="yeet">
        reset
      </button>
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
  methods: {
    yeet () {
      this.counter = 0
    }
  },
  mounted () {
    setInterval(() => {
      this.counter++
    }, 1000)
  }
})
</script>
