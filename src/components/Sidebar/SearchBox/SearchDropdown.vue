<template>
  <div id="results-div">
    <ul v-if="resultsType === 'books'">
      <li
        v-for="(result, index) in filterBooks(results)"
        :key="index"
      >
        <ResultItem
          :imageData="{ src: `https://covers.openlibrary.org/b/olid/${result.cover_edition_key}-L.jpg`, alt: result.title }"
          @click="addToChart(result)"
          draggable="true"
          @dragstart="(event) => initDrag(event, result)"
        />
      </li>
    </ul>
    <ul v-else-if="resultsType === 'music'">
      <li
        v-for="(result, index) in filterMusic(results)"
        :key="index"
      >
        <ResultItem
          :imageData="{ src: result.image[result.image.length - 1]['#text'], alt: result.name }"
          @click="addToChart(result)"
          draggable="true"
          @dragstart="(event) => initDrag(event, result)"
        />
      </li>
    </ul>
    <ul v-else-if="resultsType === 'games'">
      <li
        v-for="(result, index) in filterGames(results)"
        :key="index"
      >
        <ResultItem
          :imageData="{ src: result.cover, alt: result.name }"
          @click="addToChart(result)"
          draggable="true"
          @dragstart="(event) => initDrag(event, result)"
        />
      </li>
    </ul>
    <div v-else>
      <p>Search for {{ resultsType }} has not been implemented yet.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { createChartItem } from '@/helpers/chart'
import { BookResult, GameResult, MusicResult, Result } from '@/types'
import { defineComponent } from '@vue/runtime-core'
import { mapMutations } from 'vuex'
import ResultItem from './ResultItem.vue'

export default defineComponent({
  components: {
    ResultItem
  },
  props: {
    results: Array,
    resultsType: String,
    isLoading: Boolean
  },
  methods: {
    ...mapMutations([
      'setPopup'
    ]),
    filterBooks (results: BookResult[]): BookResult[] {
      // remove any without a cover and/or an author
      return results
        .filter(result => result.cover_edition_key)
        .filter(result => result.author_name)
    },
    filterMusic (results: MusicResult[]): MusicResult[] {
      // remove music without a cover image
      return results
        .filter(result => {
          let coverFound = false
          result.image.forEach(image => {
            if (image['#text'] !== '') {
              coverFound = true
            }
          })
          return coverFound
        })
    },
    filterGames (results: GameResult[]): GameResult[] {
      // remove games without a cover image
      return results.filter(result => result.cover)
    },
    addToChart (item: Result): void {
      // Get the index of the first null chart slot
      const firstEmptyIndex = this.$store.state.chart.items.indexOf(null)

      const totalSlots = this.$store.state.chart.size.x * this.$store.state.chart.size.y

      // Only add an item if there's a visible slot
      if (firstEmptyIndex < totalSlots) {
        const newItem = createChartItem(item)
        this.$store.commit('addItem', { item: newItem, index: firstEmptyIndex })
        this.setPopup(`Added ${newItem.title}`)
      }
    },
    initDrag (event: DragEvent, result: Result): void {
      const itemString = JSON.stringify(createChartItem(result))
      // Some null-checking is needed here to satisfy TS
      if (event.dataTransfer) {
        // Put the item object into the the payload
        event.dataTransfer.setData('application/json', itemString)
      }
    }
  }
})

</script>

<style scoped>
#results-div {
  max-height: 600px;
  overflow-y: scroll;
  background: #00003f;
}

ul {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 6px;
  flex-wrap: wrap;
  padding: 0px;
}

li {
  list-style-type: none;
}

li img {
  width: 80px;
}

li img:hover {
  cursor: pointer;
}

#empty-results-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
