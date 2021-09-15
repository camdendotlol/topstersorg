<template>
  <div v-if="results.length === 0" id="empty-results-placeholder">
    <p>Results will appear here.</p>
  </div>
  <ul v-else-if="resultsType === 'books'">
    <li
      v-for="(result, index) in filterBooks(results)"
      :key="index"
    >
      <img
        :src="`https://covers.openlibrary.org/b/olid/${result.cover_edition_key}-M.jpg`"
        :alt="result.title"
        @click="addToChart(result)"
      />
    </li>
  </ul>
  <div v-else>
    <p>Search for {{ resultsType }} has not been implemented yet.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
/* eslint-disable camelcase */

// There's way more stuff from the API but this is all that's relevant here.
interface BookResult {
  title: string,
  author_name: string,
  cover_edition_key?: string
}

export default defineComponent({
  props: {
    results: Array,
    resultsType: String,
    isLoading: Boolean
  },
  methods: {
    filterBooks (results: BookResult[]): BookResult[] {
      // remove any without a cover and/or an author
      return results
        .filter(result => result.cover_edition_key)
        .filter(result => result.author_name)
    },
    async addToChart (item: BookResult): Promise<void> {
      const setImage = async (url: string): Promise<HTMLImageElement> => {
        const response = await fetch(url)
        const blob = await response.blob()
        const cover = new Image()
        cover.src = URL.createObjectURL(blob)
        return cover
      }

      switch (this.resultsType) {
        case 'books':
        {
          const bookItem = {
            title: (item as BookResult).title,
            coverImg: await setImage(`https://covers.openlibrary.org/b/olid/${(item as BookResult).cover_edition_key}-L.jpg`),
            creator: (item as BookResult).author_name[0]
          }
          this.$store.commit('addItem', bookItem)
          break
        }
        // other types not implemented yet
      }
    }
  }
})

</script>

<style scoped>
ul {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  overflow-y: scroll;
  padding: 0px;
  /* TODO: Below is a hack to fix overflow. */
  /* This component overflows the SearchBox div even though the latter */
  /* has a set height. Gonna try to look into that at some point. */
  height: 85%;
}

li {
  list-style-type: none;
}

li img {
  width: 100px;
}

#empty-results-placeholder {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}

</style>
