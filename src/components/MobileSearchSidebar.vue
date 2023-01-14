<script setup lang="ts">
import Searchbox from './Sidebar/SearchBox/index.vue'
</script>

<template>
  <div class="container">
    <h1>Search</h1>
    <Searchbox />
  </div>
</template>

<style scoped>
.container {
  width: 90%;
  margin: auto;
  z-index: 10000;
}

h1 {
  text-align: center;
}

</style>
