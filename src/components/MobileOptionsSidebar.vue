<template>
  <div class="container">
    <h1>Options</h1>
    <Options />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Options from './Sidebar/Options.vue'

export default defineComponent({
  components: {
    Options
  }
})
</script>

<style scoped>
.container {
  width: 90%;
  z-index: 10000;
  margin: auto;
}

h1 {
  text-align: center;
}
</style>
