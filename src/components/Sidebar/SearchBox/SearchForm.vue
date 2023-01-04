<template>
  <form
    class="add-form"
    @submit.prevent="handleSearch"
  >
    <div class="form-flex">
      <TypeDropdown
        :searchType="searchType"
        @setSearchType="changeSearchType"
      />
      <div class="searchbox-div">
        <input
          id="searchbox"
          ref="searchbox"
          @click="searchType === 'custom' ? this.focusSearchBox() : null"
          :placeholder="searchType === 'custom' ? 'Enter URL' : null"
        />
        <button type="submit" class="submit-button">
          <BIconArrowRepeat class="loading-icon" v-if="loading" />
          <BIconArrowRight v-else />
        </button>
      </div>
    </div>
    <div
      v-if="searchType === 'custom' && results.length > 0"
      id-="custom-metadata-form"
    >
      <div class="custom-form-item">
        <label for="custom-creator">Creator (optional)</label>
        <input
          type="text"
          id="custom-creator"
          @change="changeCustomImageData('creator', $event.target.value)"
        />
      </div>
      <div class="custom-form-item">
        <label for="custom-title">Title</label>
        <input
          type="text"
          id="custom-title"
          @change="changeCustomImageData('title', $event.target.value)"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import queryOpenLibrary from '../../../api/openlibrary'
import TypeDropdown from './TypeDropdown.vue'
import { defineComponent } from 'vue'
import { BIconArrowRight, BIconArrowRepeat } from 'bootstrap-icons-vue'
import { SearchTypes } from './index.vue'
import queryLastFM from '../../../api/lastfm'
import queryIGDB from '../../../api/igdb'
import { tmdbMovieSearch, tmdbTVSearch } from '../../../api/tmdb'
import type { CustomResult } from '../../../types'

interface FormData {
  results: unknown[],
  loading: boolean,
  customImageData: {
    title: string,
    creator: string
  }
}

export default defineComponent({
  components: {
    TypeDropdown,
    BIconArrowRight,
    BIconArrowRepeat
  },
  props: [
    'searchType'
  ],
  emits: [
    'updateResults',
    'setSearchType'
  ],
  data (): FormData {
    return {
      results: [] as FormData[],
      loading: false,
      customImageData: {
        title: '',
        creator: ''
      }
    }
  },
  methods: {
    changeSearchType (newType: string) {
      this.$emit('setSearchType', newType)
    },
    focusSearchBox () {
      (this.$refs.searchbox as HTMLInputElement).focus();
      (this.$refs.searchbox as HTMLInputElement).select()
    },
    changeCustomImageData (attr: 'title' | 'creator', value: string): void {
      this.customImageData[attr] = value
      const item = this.results[0] as CustomResult
      item[attr] = value
    },
    async handleSearch (): Promise<unknown[] | null> {
      if (this.loading) {
        return null
      }

      const query = (this.$refs.searchbox as HTMLInputElement).value

      switch (this.searchType) {
        case SearchTypes.Books:
        {
          this.loading = true
          const response = await queryOpenLibrary(query)
          // TODO: needs error handling
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
        case SearchTypes.Movies:
        {
          this.loading = true
          const response = await tmdbMovieSearch(query)
          if (response) {
            this.results = response
            this.$emit('updateResults', response)
          }
          this.loading = false
          break
        }
        case SearchTypes.TV:
        {
          this.loading = true
          const response = await tmdbTVSearch(query)
          if (response) {
            this.results = response
            this.$emit('updateResults', response)
          }
          this.loading = false
          break
        }
        case SearchTypes.Custom:
        {
          this.loading = true
          this.results = [
            {
              title: this.customImageData.title,
              creator: this.customImageData.creator,
              imageURL: query,
              type: 'custom'
            }
          ]
          this.$emit('updateResults', this.results)
          this.loading = false
          break
        }
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
  margin-bottom: 10px;
}

.searchbox-div {
  flex-grow: 1;
}

input {
  width: 90%;
}

.form-flex {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  align-items: center;
}

.submit-button {
  border-radius: 50%;
  border: none;
  height: 20px;
  width: 20px;
  position: relative;
  background: var(--off-white);
  margin-left: -36px;
  top: 8px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.2s;
}

.submit-button:hover {
  cursor: pointer;
  filter: brightness(0.8);
}

svg {
  height: 25px;
  width: 25px;
  color: black;
}

.loading-icon {
  animation: rotation 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.custom-form-item {
  margin-top: 10px;
  color: var(--dark-blue);
}

.custom-metadata-form > label {
  margin-bottom: 4px;
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
