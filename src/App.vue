<template>
  <Title />
  <ChartBuilder />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Title from './components/Title.vue'
import ChartBuilder from './components/ChartBuilder/index.vue'

export default defineComponent({
  name: 'App',
  components: {
    Title,
    ChartBuilder
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Work+Sans&display=swap');

#app {
  font-family: "Work Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

body {
  background: #e9e9e9;
}

</style>
