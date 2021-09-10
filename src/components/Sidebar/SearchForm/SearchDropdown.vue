<template>
  <div v-if="results.length === 0">
    <p>Results will appear here.</p>
  </div>
  <ul v-else-if="resultsType === 'books'">
    <li
      v-for="(result, index) in filterCoverless(results)"
      :key="index"
    >
      <img
        :src="`http://covers.openlibrary.org/b/olid/${result.cover_edition_key}-M.jpg`"
        :alt="result.title"
      />
    </li>
  </ul>
  <div v-else>
    <p>Search for {{ resultsType }} has not been implemented yet.</p>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */

// There's way more stuff from the API but this is all that's relevant here.
interface Result {
  cover_edition_key?: string
}

export default {
  props: {
    results: Array,
    resultsType: String,
    isLoading: Boolean
  },
  methods: {
    filterCoverless (results: Result[]): Result[] {
      return results.filter(result => result.cover_edition_key)
    }
  }
}

</script>

<style scoped>
ul {
  display: flex;
  margin: 0 auto;
  margin-top: 20px;
  width: 95%;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #00003f;
  flex-wrap: wrap;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 50vh;
  padding: 0px;
  border-radius: 5px;
}

li {
  list-style-type: none;
  width: 100px;
  height: 160px;
}

li img {
  width: 100%;
  height: 100%;
}

</style>
