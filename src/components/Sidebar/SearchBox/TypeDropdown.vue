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
          Music
        </option>
        <option
          value="books"
          :selected="searchType === 'books'"
        >
          Books
        </option>
        <option
          value="games"
          :selected="searchType === 'games'"
        >
          Games
        </option>
      </select>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  emits: [
    'setSearchType'
  ],
  props: {
    searchType: String
  },
  mounted () {
    const storedType = localStorage.getItem('activeTab')
    if (storedType && ['music', 'books', 'games'].includes(storedType)) {
      this.$emit('setSearchType', storedType)
    }
  },
  methods: {
    changeSearchType (event: Event) {
      const newSearchType = (event.target as HTMLFormElement).value
      this.$emit('setSearchType', newSearchType)
    }
  }
})
</script>

<style scoped>

</style>
