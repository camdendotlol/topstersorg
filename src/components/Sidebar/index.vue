<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <Title />
      <SearchBox />
      <Options />
    </div>
  </div>
</template>

<script>
import Title from '../Title.vue'
import SearchBox from './SearchBox/index.vue'
import Options from './Options.vue'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  components: {
    Title,
    SearchBox,
    Options
  }
})
</script>

<style scoped>
.sidebar {
  width: 400px;
  overflow-y: scroll;
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
