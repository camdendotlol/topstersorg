<template>
  <form
    class="add-form"
    @submit.prevent="handleSearch"
  >
    <label for="searchbox">Search</label>
    <br />
    <input
      id="searchbox"
      ref="searchbox"
    />
    <button type="submit">Search</button>
  </form>
  <SearchDropdown :results="results" />
</template>

<script lang="ts">
import SearchDropdown from './SearchDropdown.vue'
import queryOpenLibrary from '../../api/openlibrary'
import { defineComponent } from '@vue/runtime-core'

enum SearchTypes {
  Music = 'music',
  Books = 'books',
  Movies = 'movies'
}

interface FormData {
  results: unknown[],
  searchType: SearchTypes
}

export default defineComponent({
  components: {
    SearchDropdown
  },
  data (): FormData {
    return {
      results: [] as FormData[],
      searchType: SearchTypes.Books
    }
  },
  methods: {
    async handleSearch (event: Event): Promise<unknown[]> {
      const type = this.searchType

      // Horrible hack below to make TypeScript happy
      const query = ((event.target as HTMLFormElement).elements[0] as HTMLInputElement).value

      switch (type) {
        case SearchTypes.Books:
        {
          const response = await queryOpenLibrary(query)
          // needs error handling
          if (response) {
            this.results = response
          }
          break
        }
        // add music and books later
        default:
          return []
      }
      return []
    }
  }
})
</script>

<style scoped>
.add-form {
  margin-top: 20px;
}

#searchbox {
  margin-top: 5px;
}
</style>
