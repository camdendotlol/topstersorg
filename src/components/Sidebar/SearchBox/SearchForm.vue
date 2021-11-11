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
        />
        <button type="submit" class="submit-button">
          <BIconArrowRepeat class="loading-icon" v-if="loading" />
          <BIconArrowRight v-else />
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import queryOpenLibrary from '../../../api/openlibrary'
import TypeDropdown from './TypeDropdown.vue'
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
      loading: false
    }
  },
  methods: {
    changeSearchType (newType: string) {
      this.$emit('setSearchType', newType)
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
  background: #e9e9e9;
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

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

</style>
