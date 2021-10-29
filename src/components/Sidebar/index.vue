<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <Title />
      <SearchBox />
      <Options />
      <div id="credits">
        <p>Data from:</p>
        <div id="credits-flex">
          <a href="https://www.last.fm/">
            <img src="/lastfm_logo.svg" alt="Last.fm">
          </a>
          <a href="https://openlibrary.org/">
            <img src="/openlibrary_logo.svg" alt="OpenLibrary">
          </a>
          <a href="https://www.igdb.com">
            <img src="/igdb_logo.png" alt="IGDB" id="igdb-logo">
          </a>
        </div>
      </div>
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
.sidebar-content {
  margin-left: 20px;
  margin-right: 20px;
}

.chart-type-button {
  margin-left: 5px;
  margin-right: 5px;
}

#credits-flex {
  display: flex;
  margin: 0 auto;
  width: 90%;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

#credits-flex img {
  width: 70px;
}

#igdb-logo {
  filter: invert(100);
}

@media screen and (max-width: 1000px) {
  .sidebar {
    width: 100%;
    z-index: 10000;
  }
}

</style>
