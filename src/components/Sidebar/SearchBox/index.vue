<template>
  <div id="searchbox">
    <div id="searchbox-tab-bar">
      <button
        id="music-button"
        :class="searchType === 'music' ? 'selected-button' : ''"
        @click="setSearchType('music')"
      >
        music
      </button>
      <button
        id="books-button"
        :class="searchType === 'books' ? 'selected-button' : ''"
        @click="setSearchType('books')"
      >
        books
      </button>
      <button
        id="movies-button"
        :class="searchType === 'movies' ? 'selected-button' : ''"
        @click="setSearchType('movies')"
      >
        movies
      </button>
    </div>
    <div id="search-body">
      <SearchForm :searchType="searchType" @updateResults="updateResults" />
      <SearchDropdown :results="results" :resultsType="searchType" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import SearchForm from './SearchForm.vue'
import SearchDropdown from './SearchDropdown.vue'

export enum SearchTypes {
  Music = 'music',
  Books = 'books',
  Movies = 'movies'
}

export default defineComponent({
  components: {
    SearchForm,
    SearchDropdown
  },
  data () {
    return {
      searchType: 'books',
      results: []
    }
  },
  methods: {
    setSearchType (type: string) {
      this.results = []
      this.searchType = type
    },
    updateResults (newResults: []) {
      this.results = newResults
    }
  }
})
</script>

<style scoped>
#searchbox {
  border-radius: 5px;
  color: #e9e9e9;
}

#music-button {
  border-radius: 5px 0 0 0;
}

#movies-button {
  border-radius: 0 5px 0 0;
}

#search-body {
  background: #00003f;
  height: 560px;
  border-radius: 5px;
}

button {
  height: 28px;
  border: none;
  padding: 6px;
  background: #00003f;
  font-size: 1rem;
  font-weight: 600;
  color: #e9e9e9;
  cursor: pointer;
  filter: brightness(50%);
  transition: filter 0.2s;
}

.selected-button {
  filter: none;
}
</style>
