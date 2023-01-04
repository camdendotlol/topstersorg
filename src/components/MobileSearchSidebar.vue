<template>
  <div class="container">
    <h1>Search</h1>
    <Searchbox />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Searchbox from './Sidebar/SearchBox/index.vue'

export default defineComponent({
  components: {
    Searchbox
  }
})
</script>

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
