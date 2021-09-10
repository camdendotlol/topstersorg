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
@import url('https://fonts.googleapis.com/css2?family=Work+Sans&display=swap');

#app {
  font-family: "Work Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #00003f;
  margin-top: 30px;
}

body {
  background: #e9e9e9;
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

button {
  padding: 10px;
  border: none;
  background: gray;
  border-radius: 10px;
  font-size: 1.2rem;
}

button:hover {
  cursor: pointer;
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
