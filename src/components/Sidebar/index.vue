<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <Title />
      <div>
        <button
          class="section-toggle"
          @click="this.searchDisplayed = !this.searchDisplayed"
        >
          Search Box
        </button>
        <SearchBox v-if="this.searchDisplayed" />
      </div>
      <div>
        <button
          class="section-toggle"
          @click="this.optionsDisplayed = !this.optionsDisplayed"
        >
          Chart Options
        </button>
        <Options v-if="this.optionsDisplayed" />
      </div>
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
  },
  data () {
    return {
      searchDisplayed: true,
      optionsDisplayed: true
    }
  }
})
</script>

<style scoped>
.sidebar-content {
  margin-left: 20px;
  margin-right: 20px;
}

.section-toggle {
  width: 100%;
  margin: 10px auto 0;
  padding: 8px;
  background: #00003f;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px 5px 0 0;
  transition: color 0.2s;
}

.section-toggle:hover {
  cursor: pointer;
  color: lightgray;
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
