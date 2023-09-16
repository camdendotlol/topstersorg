<script setup lang="ts">
import queryOpenLibrary from '../../../api/openlibrary'
import TypeDropdown from './TypeDropdown.vue'
import { BIconArrowRight, BIconArrowRepeat } from 'bootstrap-icons-vue'
import queryLastFM from '../../../api/lastfm'
import queryIGDB from '../../../api/igdb'
import { tmdbMovieSearch, tmdbTVSearch } from '../../../api/tmdb'
import type { CustomResult, SearchTypes } from '../../../types'
import { ref } from 'vue'

interface Props {
  searchType: SearchTypes
}

const props = defineProps<Props>()

const results = ref([])
const loading = ref(false)
const customImageData = ref({
  title: '',
  creator: ''
})

const emit = defineEmits([
  'updateResults',
  'setSearchType'
])

const searchbox = ref(null)

const changeSearchType = (newType: string) => {
  emit('setSearchType', newType)
}

const focusSearchBox = () => {
  searchbox.value.focus()
  searchbox.value.select()
}

const changeCustomImageData = (attr: 'title' | 'creator', value: string): void => {
  customImageData.value[attr] = value
  const item = results.value[0] as CustomResult
  item[attr] = value
}

const handleSearch = async (): Promise<unknown[] | null> => {
  if (loading.value) {
    return null
  }

  const query = searchbox.value.value

  switch (props.searchType) {
    case 'books':
    {
      loading.value = true
      const response = await queryOpenLibrary(query)
      // TODO: needs error handling
      if (response) {
        results.value = response
        emit('updateResults', response)
      }
      loading.value = false
      break
    }
    case 'music':
    {
      loading.value = true
      const response = await queryLastFM(query)
      if (response) {
        results.value = response
        emit('updateResults', response)
      }
      loading.value = false
      break
    }
    case 'games':
    {
      loading.value = true
      const response = await queryIGDB(query)
      if (response) {
        results.value = response
        emit('updateResults', response)
      }
      loading.value = false
      break
    }
    case 'movies':
    {
      loading.value = true
      const response = await tmdbMovieSearch(query)
      if (response) {
        results.value = response
        emit('updateResults', response)
      }
      loading.value = false
      break
    }
    case 'tv':
    {
      loading.value = true
      const response = await tmdbTVSearch(query)
      if (response) {
        results.value = response
        emit('updateResults', response)
      }
      loading.value = false
      break
    }
    case 'custom':
    {
      console.log(query)
      loading.value = true
      results.value = [
        {
          title: customImageData.value.title,
          creator: customImageData.value.creator,
          imageURL: query,
          type: 'custom'
        }
      ]
      emit('updateResults', results.value)
      loading.value = false
      break
    }
    default:
      return []
  }
  return []
}
</script>

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
          @click="searchType === 'custom' ? focusSearchBox() : null"
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
          @change="changeCustomImageData('creator', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="custom-form-item">
        <label for="custom-title">Title</label>
        <input
          type="text"
          id="custom-title"
          @change="changeCustomImageData('title', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </form>
</template>

<style scoped>
.searchbox-div {
  flex-grow: 1;
}

#searchbox {
  width: 100%;
}

.form-flex {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  align-items: center;
  width: 100%;
}

.submit-button {
  border-radius: 50%;
  border: none;
  height: 20px;
  width: 20px;
  position: relative;
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
}

.loading-icon {
  animation: rotation 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.custom-form-item {
  margin-top: 10px;
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
