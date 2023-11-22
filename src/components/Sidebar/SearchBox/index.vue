<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'
import SearchForm from './SearchForm.vue'
import SearchDropdown from './SearchDropdown.vue'
import { Result, SearchTypes } from '../../../types'
import SearchTypePicker from './SearchTypePicker.vue'
import { isValidSearchType } from '../../../helpers/typeGuards'

const searchType: Ref<SearchTypes> = ref(SearchTypes.Music)
const results: Ref<Result[]> = ref([])

const setSearchType = (value: SearchTypes) => {
  results.value = []
  searchType.value = value
  localStorage.setItem('activeTab', value)
}

const getInitialSearchType = () => {
  const storedValue = localStorage.getItem('activeTab')
  if (storedValue && isValidSearchType(storedValue)) {
    setSearchType(storedValue)
  }
}

onMounted(() => {
  getInitialSearchType()
})

const updateResults = (newResults: []) => {
  console.log(newResults)
  results.value = newResults
}
</script>

<template>
  <div id="searchbox">
    <div class="container">
      <SearchTypePicker
        :current-type="searchType"
        @setSearchType="setSearchType"
      />
      <SearchForm
        :searchType="searchType"
        @updateResults="updateResults"
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
</style>
