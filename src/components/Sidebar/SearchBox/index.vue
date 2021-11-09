<template>
  <div id="searchbox">
    <TypeDropdown
      :searchType="searchType"
      @setSearchType="setSearchType"
    />
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
import TypeDropdown from './TypeDropdown.vue'

export enum SearchTypes {
  Music = 'music',
  Books = 'books',
  Games = 'games'
}

export default defineComponent({
  components: {
    SearchForm,
    SearchDropdown,
    TypeDropdown
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
  border-radius: 5px;
  color: #e9e9e9;
  background: rgba(161, 161, 255, 0.5);
}

#search-body {
  background: #00003f;
  height: 560px;
  border-radius: 5px;
}
</style>
