<template>
  <div id="searchbox">
    <div class="container">
      <SearchForm
        :searchType="searchType"
        @updateResults="updateResults"
        @setSearchType="setSearchType"
      />
      <SearchDropdown
        v-if="results.length > 0"
        :results="results"
        :resultsType="searchType"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchForm from './SearchForm.vue'
import SearchDropdown from './SearchDropdown.vue'

export enum SearchTypes {
  Music = 'music',
  Books = 'books',
  Games = 'games',
  Movies = 'movies',
  TV = 'tv',
  Custom = 'custom'
}

export default defineComponent({
  components: {
    SearchForm,
    SearchDropdown
  },
  data () {
    return {
      searchType: 'music',
      results: []
    }
  },
  methods: {
    setSearchType (value: string) {
      this.results = []
      this.searchType = value
      localStorage.setItem('activeTab', value)
    },
    updateResults (newResults: []) {
      this.results = newResults
    }
  }
})
</script>

<style scoped>
#searchbox {
  border-radius: 0 0 5px 5px;
  color: var(--off-white);
  background: var(--blue-bg);
}

.container {
  padding: 10px;
}
</style>
