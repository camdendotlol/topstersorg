<script setup lang="ts">
import { Ref, ref } from 'vue'
import SearchForm from './SearchForm.vue'
import SearchDropdown from './SearchDropdown.vue'
import { Result, SearchTypes } from '../../../types'

const searchType: Ref<SearchTypes> = ref(SearchTypes.Music)
const results: Ref<Result[]> = ref([])

const setSearchType = (value: SearchTypes) => {
  results.value = []
  searchType.value = value
  localStorage.setItem('activeTab', value)
}

const updateResults = (newResults: []) => {
  results.value = newResults
}
</script>

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

<style scoped>
#searchbox {
  border-radius: 0 0 5px 5px;
}

.container {
  padding: 10px;
}
</style>
