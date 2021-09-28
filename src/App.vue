<template>
  <div class="main">
    <Sidebar />
    <ChartBuilder />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from './components/Sidebar/index.vue'
import ChartBuilder from './components/ChartBuilder/index.vue'

export default defineComponent({
  name: 'Ostrakon',
  components: {
    Sidebar,
    ChartBuilder
  }
})

</script>

<style>
#app {
  font-family: "Ubuntu Mono", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #00003f;
}

body {
  background: #2a2a2a;
  box-sizing: border-box;
}

.main {
  height: 100vh;
  width: 100vw;
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  margin: 0;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: none;
  background: #e9e9e9;
  border-radius: 10px;
}

@media screen and (max-width: 1000px) {
  .main {
    flex-flow: column;
  }
}

</style>
