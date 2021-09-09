<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <Title />
      <p>Hello.</p>
      <p>I am a fully responsive sidebar.</p>
      <span class="chart-type-button">
        <Button label='music' @click="setHeader('music')" />
      </span>
      <span class="chart-type-button">
        <Button label='books' @click="setHeader('book')" />
      </span>
      <span class="chart-type-button">
        <Button label='movies' @click="setHeader('movie')" />
      </span>
    </div>
  </div>
</template>

<script>
import Title from '../Title.vue'
import Button from '../common/Button.vue'
export default {
  components: {
    Title,
    Button
  }
}
</script>

<style scoped>
.sidebar {
  width: 400px;
  height: 100%;
  margin: 0;
  background: peachpuff;
  box-shadow: 2px 0 3px -1px gray;
}

.sidebar-content {
  margin: 20px;
}

.chart-type-button {
  margin-left: 5px;
  margin-right: 5px;
}

@media screen and (max-width: 1000px) {
  .sidebar {
    width: 100%;
    height: 400px;
  }
}

</style>
