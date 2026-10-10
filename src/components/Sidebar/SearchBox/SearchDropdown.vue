<script setup lang="ts">
import type {
  BookResult,
  Result,
  SearchResult,
} from '../../../types'
import { ref } from 'vue'
import { createChartItem } from '../../../helpers/chart'
import { useStore } from '../../../store'
import {
  SearchTypes,
} from '../../../types'
import ResultItem from './ResultItem.vue'

interface Props {
  results: any[]
  resultsType: SearchTypes
  isLoading?: boolean
}

const props = defineProps<Props>()

const store = useStore()

const searchResultTypes = [SearchTypes.Music, SearchTypes.Games, SearchTypes.Movies, SearchTypes.Shows]

// remove any without a cover and/or an author
function filterBooks(results: BookResult[]): BookResult[] {
  return results
    .filter(result => result.cover_edition_key)
    .filter(result => result.author_name)
}

// Covers that failed to load, e.g. a Cover Art Archive fallback that doesn't exist.
const failedCovers = ref(new Set<string>())

function handleCoverError(src: string): void {
  failedCovers.value.add(src)
}

function filterResults(results: SearchResult[]): { result: SearchResult, key: string }[] {
  const coverCounts = new Map<string, number>()

  return results
    .filter(result => result.cover && !failedCovers.value.has(result.cover))
    .map((result) => {
      const count = (coverCounts.get(result.cover) ?? 0) + 1
      coverCounts.set(result.cover, count)
      return { result, key: count === 1 ? result.cover : `${result.cover}#${count}` }
    })
}

function addToChart(item: Result): void {
  // Get the index of the first null chart slot
  const firstEmptyIndex = store.chart.items.indexOf(null)

  const totalSlots = store.chart.size.x * store.chart.size.y

  // Only add an item if there's a visible slot
  if (firstEmptyIndex < totalSlots) {
    const newItem = createChartItem(item)
    store.addItem({ item: newItem, index: firstEmptyIndex })
  }
}

function initDrag(event: DragEvent, result: Result): void {
  const dragData = JSON.stringify({
    item: createChartItem(result),
  })

  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', dragData)
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
          :image-data="{ src: `https://covers.openlibrary.org/b/olid/${result.cover_edition_key}-L.jpg`, alt: result.title }"
          draggable="true"
          @click="addToChart(result)"
          @dragstart="(event) => initDrag(event, result)"
        />
      </li>
    </ul>
    <ul v-else-if="searchResultTypes.includes(resultsType)">
      <li
        v-for="{ result, key } in filterResults(results)"
        :key="key"
      >
        <ResultItem
          :image-data="{ src: result.cover, alt: result.name }"
          draggable="true"
          @image-error="handleCoverError"
          @click="addToChart(result)"
          @dragstart="(event) => initDrag(event, result)"
        />
      </li>
    </ul>
    <ul
      v-else-if="resultsType === SearchTypes.Custom"
      class="single-result-list"
    >
      <li>
        <ResultItem
          :image-data="{ src: results[0].imageURL, alt: results[0].title }"
          draggable="true"
          @click="addToChart(results[0])"
          @dragstart="(event) => initDrag(event, results[0])"
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
  grid-template-columns: repeat(auto-fill, 90px);
  align-items: center;
  justify-content: space-evenly;
  gap: 4px;
  padding: 0px;
}

li {
  list-style-type: none;
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
