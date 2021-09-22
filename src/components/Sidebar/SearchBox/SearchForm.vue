<template>
  <form
    class="add-form"
    @submit.prevent="handleSearch"
  >
    <div>
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
</template>

<script lang="ts">
import queryOpenLibrary from '../../../api/openlibrary'
import { defineComponent } from '@vue/runtime-core'
import { BIconArrowRight, BIconArrowRepeat } from 'bootstrap-icons-vue'
import { SearchTypes } from './index.vue'
import queryLastFM from '../../../api/lastfm'
import queryIGDB from '@/api/igdb'

interface FormData {
  results: unknown[],
  loading: boolean
}

export default defineComponent({
  components: {
    BIconArrowRight,
    BIconArrowRepeat
  },
  props: [
    'searchType'
  ],
  emits: [
    'updateResults'
  ],
  data (): FormData {
    return {
      results: [] as FormData[],
      loading: false
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
          this.loading = true
          const response = await queryOpenLibrary(query)
          // needs error handling
          if (response) {
            this.results = response
            this.$emit('updateResults', response)
          }
          this.loading = false
          break
        }
        case SearchTypes.Music:
        {
          this.loading = true
          const response = await queryLastFM(query)
          if (response) {
            this.results = response
            this.$emit('updateResults', response)
          }
          this.loading = false
          break
        }
        case SearchTypes.Games:
        {
          this.loading = true
          const response = await queryIGDB(query)
          if (response) {
            this.results = response
            this.$emit('updateResults', response)
          }
          this.loading = false
          break
        }
        // add movies later
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
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

#searchbox {
  margin-top: 16px;
}

.submit-button {
  border-radius: 50%;
  border: none;
  height: 40px;
  width: 40px;
  margin-left: 10px;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.2s;
}

.submit-button:hover {
  cursor: pointer;
  filter: brightness(0.9);
}

.submit-button svg {
  transform: scale(150%);
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
