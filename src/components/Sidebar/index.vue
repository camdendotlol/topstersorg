<script setup lang="ts">
import PageTitle from '../PageTitle.vue'
import SearchBox from './SearchBox/index.vue'
import Options from './Options.vue'
import Imports from './Imports.vue'
import { BIconCaretDownFill, BIconCaretUpFill } from 'bootstrap-icons-vue'
import FAQ from './FAQ.vue'
import { ref, Ref } from 'vue'

const searchDisplayed: Ref<boolean> = ref(true)
const optionsDisplayed: Ref<boolean> = ref(false)
const importsDisplayed: Ref<boolean> = ref(false)
const faqDisplayed: Ref<boolean> = ref(false)
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <PageTitle />
      <div>
        <button
          class="section-toggle"
          :class="{ 'active-section-toggle': searchDisplayed }"
          @click="searchDisplayed = !searchDisplayed"
        >
          <span>Add Items</span>
          <BIconCaretUpFill v-if="searchDisplayed" class="caret" />
          <BIconCaretDownFill v-else class="caret" />
        </button>
        <SearchBox v-if="searchDisplayed" />
      </div>
      <div>
        <button
          class="section-toggle"
          :class="{ 'active-section-toggle': optionsDisplayed }"
          @click="optionsDisplayed = !optionsDisplayed"
        >
          <span>Chart Options</span>
          <BIconCaretUpFill v-if="optionsDisplayed" class="caret" />
          <BIconCaretDownFill v-else class="caret" />
        </button>
        <Options v-if="optionsDisplayed" />
      </div>
      <div>
        <button
          class="section-toggle"
          :class="{ 'active-section-toggle': importsDisplayed }"
          @click="importsDisplayed = !importsDisplayed"
        >
          <span>Imports</span>
          <BIconCaretUpFill v-if="importsDisplayed" class="caret" />
          <BIconCaretDownFill v-else class="caret" />
        </button>
        <Imports v-if="importsDisplayed" />
      </div>
      <div>
        <button
          class="section-toggle"
          :class="{ 'active-section-toggle': faqDisplayed }"
          @click="faqDisplayed = !faqDisplayed"
        >
          <span>FAQ</span>
          <BIconCaretUpFill v-if="faqDisplayed" class="caret" />
          <BIconCaretDownFill v-else class="caret" />
        </button>
        <FAQ v-if="faqDisplayed" />
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
          <a href="https://www.themoviedb.org">
            <img src="/tmdb.svg" alt="The Movie DB" id="tmdb-logo">
          </a>
        </div>
        <p>topsters.org is not affiliated with or endorsed by any of the above services.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-content {
  margin-left: 20px;
  margin-right: 20px;
}

.section-toggle {
  width: 100%;
  margin: 10px auto 0;
  padding: 8px;
  background: var(--dark-blue);
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

#tmdb-logo {
  height: 32px;
}

@media screen and (max-width: 1000px) {
  .sidebar {
    width: 100%;
    z-index: 10000;
  }
}

</style>
