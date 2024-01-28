<script setup lang="ts">

import { createChartItem } from '../../../helpers/chart'
import {
  BookResult,
  GameResult,
  MusicResult,
  Result,
  MovieResult,
  TVResult,
  SearchTypes
} from '../../../types'
import { useStore } from '../../../store'
import ResultItem from './ResultItem.vue'

interface Props {
  results: any[],
  resultsType: SearchTypes,
  isLoading?: boolean
}

const props = defineProps<Props>()

const store = useStore()

// remove any without a cover and/or an author
const filterBooks = (results: BookResult[]): BookResult[] => {
  return results
    .filter(result => result.cover_edition_key)
    .filter(result => result.author_name)
}

// remove music without a cover image
const filterMusic = (results: MusicResult[]): MusicResult[] => {
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
}

// remove games without a cover image
const filterGames = (results: GameResult[]): GameResult[] => (
  results.filter(result => result.cover)
)

const filterMovies = (results: MovieResult[]): MovieResult[] => (
  results.filter(result => result.poster_path)
)

const filterTV = (results: TVResult[]): TVResult[] => (
  results.filter(result => result.poster_path)
)

const addToChart = (item: Result): void => {
  // Get the index of the first null chart slot
  const firstEmptyIndex = store.state.chart.items.indexOf(null)

  const totalSlots = store.state.chart.size.x * store.state.chart.size.y

  // Only add an item if there's a visible slot
  if (firstEmptyIndex < totalSlots) {
    const newItem = createChartItem(item)
    store.commit('addItem', { item: newItem, index: firstEmptyIndex })
    store.commit('setPopup', `Added ${newItem.title}`)
  }
}

const initDrag = (event: DragEvent, result: Result): void => {
  const itemString = JSON.stringify(createChartItem(result))
  // Some null-checking is needed here to satisfy TS
  if (event.dataTransfer) {
    // Put the item object into the the payload
    event.dataTransfer.setData('application/json', itemString)
  }
}

</script>

<template>
  <div id="results-div">
    <ul v-if="resultsType === SearchTypes.Books">
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
    <ul v-else-if="resultsType === SearchTypes.Music">
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
    <ul v-else-if="resultsType === SearchTypes.Games">
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
    <ul v-else-if="resultsType === SearchTypes.Movies">
      <li
        v-for="(result, index) in filterMovies(results)"
        :key="index"
      >
        <ResultItem
          :imageData="{ src: `https://image.tmdb.org/t/p/w185/${result.poster_path}`, alt: result.title }"
          @click="addToChart(result)"
          draggable="true"
          @dragstart="(event) => initDrag(event, result)"
        />
      </li>
    </ul>
    <ul v-else-if="resultsType === SearchTypes.Shows">
      <li
        v-for="(result, index) in filterTV(results)"
        :key="index"
      >
        <ResultItem
          :imageData="{ src: `https://image.tmdb.org/t/p/w185/${result.poster_path}`, alt: result.name }"
          @click="addToChart(result)"
          draggable="true"
          @dragstart="(event) => initDrag(event, result)"
        />
      </li>
    </ul>
    <ul
      class="single-result-list"
      v-else-if="resultsType === SearchTypes.Custom"
    >
      <li>
        <ResultItem
          :imageData="{ src: results[0].imageURL, alt: results[0].title }"
          @click="addToChart(results[0])"
          draggable="true"
          @dragstart="(event) => initDrag(event, results[0])"
          class="centered-item"
        />
      </li>
      <p>Click or drag to add this item to the chart.</p>
    </ul>
    <div v-else>
      <p>Search for {{ props.resultsType }} has not been implemented yet.</p>
    </div>
  </div>
</template>

<style scoped>
#results-div {
  margin: 0 10px;
}

ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, 70px);
  align-items: center;
  justify-content: space-evenly;
  gap: 4px;
  padding: 0px;
}

li {
  list-style-type: none;
}

li img {
  width: 100%;
}

li img:hover {
  cursor: pointer;
}

#empty-results-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
}

.single-result-list {
  display: initial;
}

.single-result-list li {
  margin: auto;
  max-width: 90px;
}

.single-result-list p {
  text-align: center;
}
</style>
