<script setup lang="ts">
import Credits from '../Credits.vue'
import Searchbox from './index.vue'
</script>

<template>
  <div class="container">
    <h1>Search</h1>
    <Searchbox />
    <Credits />
  </div>
</template>

<style scoped>
.container {
  width: 90%;
  max-width: 500px;
  margin: auto;
  z-index: 10000;
}

h1 {
  text-align: center;
}
</style>
