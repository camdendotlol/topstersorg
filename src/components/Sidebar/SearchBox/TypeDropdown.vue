<script setup lang="ts">
import { onMounted } from 'vue'
import { SearchTypes } from '../../../types'

interface Props {
  searchType: SearchTypes
}

const props = defineProps<Props>()

const emit = defineEmits([
  'setSearchType'
])

const changeSearchType = (event: Event) => {
  const newSearchType = (event.target as HTMLFormElement).value
  emit('setSearchType', newSearchType)
}

onMounted(() => {
  const storedType = localStorage.getItem('activeTab')
  if (storedType && ['music', 'books', 'games', 'movies', 'tv', 'custom'].includes(storedType)) {
    emit('setSearchType', storedType)
  }
})

</script>

<template>
  <div id="search-type-dropdown">
      <select
        name="search-type"
        id="search-type"
        @input="changeSearchType"
      >
        <option
          value="music"
          :selected="searchType === 'music'"
        >
          <span>Music</span>
        </option>
        <option
          value="books"
          :selected="searchType === 'books'"
        >
          <span>Books</span>
        </option>
        <option
          value="movies"
          :selected="searchType === 'movies'"
        >
          <span>Movies</span>
        </option>
        <option
          value="tv"
          :selected="searchType === 'tv'"
        >
          <span>TV Shows</span>
        </option>
        <option
          value="games"
          :selected="searchType === 'games'"
        >
          <span>Games</span>
        </option>
        <option
          value="custom"
          :selected="searchType === 'custom'"
        >
          <span>Custom</span>
        </option>
      </select>
    </div>
</template>

<style scoped>
#search-type-dropdown {
  display: inline;
}

#search-type-dropdown * {
  font-size: 1rem;
}
</style>
