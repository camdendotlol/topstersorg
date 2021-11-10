<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <Title />
      <div>
        <button
          class="section-toggle"
          :class="{ 'active-section-toggle': this.searchDisplayed }"
          @click="this.searchDisplayed = !this.searchDisplayed"
        >
          <span>Add Items</span>
          <BIconCaretUpFill v-if="this.searchDisplayed" class="caret" />
          <BIconCaretDownFill v-else class="caret" />
        </button>
        <SearchBox v-if="this.searchDisplayed" />
      </div>
      <div>
        <button
          class="section-toggle"
          :class="{ 'active-section-toggle': this.optionsDisplayed }"
          @click="this.optionsDisplayed = !this.optionsDisplayed"
        >
          <span>Chart Options</span>
          <BIconCaretUpFill v-if="this.optionsDisplayed" class="caret" />
          <BIconCaretDownFill v-else class="caret" />
        </button>
        <Options v-if="this.optionsDisplayed" />
      </div>
      <div>
        <button
          class="section-toggle"
          :class="{ 'active-section-toggle': this.faqDisplayed }"
          @click="this.faqDisplayed = !this.faqDisplayed"
        >
          <span>FAQ</span>
          <BIconCaretUpFill v-if="this.faqDisplayed" class="caret" />
          <BIconCaretDownFill v-else class="caret" />
        </button>
        <FAQ v-if="this.faqDisplayed" />
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
import { BIconCaretDownFill, BIconCaretUpFill } from 'bootstrap-icons-vue'
import FAQ from './FAQ.vue'

export default defineComponent({
  components: {
    Title,
    SearchBox,
    Options,
    FAQ,
    BIconCaretDownFill,
    BIconCaretUpFill
  },
  data () {
    return {
      searchDisplayed: false,
      optionsDisplayed: false,
      faqDisplayed: false
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
  border-radius: 5px;
  transition: color 0.2s;
}

.section-toggle:hover {
  cursor: pointer;
  color: lightgray;
}

.active-section-toggle {
  border-radius: 5px 5px 0 0;
}

button {
  display: flex;
  align-items: center;
}

button span {
  margin-left: 10px;
}

.caret {
  margin-left: auto;
  margin-right: 10px;
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
