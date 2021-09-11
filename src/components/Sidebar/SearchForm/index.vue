<template>
  <form
    class="add-form"
    @submit.prevent="handleSearch"
  >
    <div>
      <label for="searchbox">Search</label>
      <br />
      <input
        id="searchbox"
        ref="searchbox"
      />
    </div>
    <button type="submit" class="submit-button">
      <BIconArrowRepeat class="loading-icon" v-if="loading" />
      <BIconArrowRight v-else />
    </button>
  </form>
  <SearchDropdown :results="results" :resultsType="searchType" />
</template>

<script lang="ts">
import SearchDropdown from './SearchDropdown.vue'
import queryOpenLibrary from '../../../api/openlibrary'
import { defineComponent } from '@vue/runtime-core'
import { BIconArrowRight, BIconArrowRepeat } from 'bootstrap-icons-vue'

enum SearchTypes {
  Music = 'music',
  Books = 'books',
  Movies = 'movies'
}

interface FormData {
  results: unknown[],
  searchType: SearchTypes,
  loading: boolean
}

export default defineComponent({
  components: {
    SearchDropdown,
    BIconArrowRight,
    BIconArrowRepeat
  },
  data (): FormData {
    return {
      results: [] as FormData[],
      searchType: SearchTypes.Books,
      loading: false
    }
  },
  methods: {
    async handleSearch (event: Event): Promise<unknown[]> {
      this.loading = true
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
      this.loading = false
      return []
    }
  }
})
</script>

<style scoped>
.add-form {
  margin-top: 20px;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

#searchbox {
  margin-top: 5px;
  border: 2px solid #00003f;
}

.submit-button {
  border-radius: 50%;
  height: 40px;
  width: 40px;
  margin-left: 10px;
  margin-bottom: 2px;
  align-self: flex-end;
}

.loading-icon {
  animation: rotation 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

</style>
