<script setup lang="ts">
import {
  BIconBook,
  BIconController,
  BIconFilm,
  BIconMusicNoteBeamed,
  BIconTools,
  BIconTv,
} from 'bootstrap-icons-vue'
import { SearchTypes } from '../../../types'

interface Props {
  currentType: SearchTypes
}

const props = defineProps<Props>()

const emit = defineEmits([
  'setSearchType',
])

function isActive(type: SearchTypes) {
  if (type === props.currentType) {
    return 'active-search-type'
  }

  return ''
}
</script>

<template>
  <ul>
    <li
      :class="isActive(SearchTypes.Music)"
      @click="emit('setSearchType', SearchTypes.Music)"
    >
      <BIconMusicNoteBeamed />
      <label>Music</label>
    </li>
    <li
      :class="isActive(SearchTypes.Games)"
      @click="emit('setSearchType', SearchTypes.Games)"
    >
      <BIconController />
      <label>Games</label>
    </li>
    <li
      :class="isActive(SearchTypes.Books)"
      @click="emit('setSearchType', SearchTypes.Books)"
    >
      <BIconBook />
      <label>Books</label>
    </li>
    <li
      :class="isActive(SearchTypes.Movies)"
      @click="emit('setSearchType', SearchTypes.Movies)"
    >
      <BIconFilm />
      <label>Movies</label>
    </li>
    <li
      :class="isActive(SearchTypes.Shows)"
      @click="emit('setSearchType', SearchTypes.Shows)"
    >
      <BIconTv />
      <label>Shows</label>
    </li>
    <li
      :class="isActive(SearchTypes.Custom)"
      @click="emit('setSearchType', SearchTypes.Custom)"
    >
      <BIconTools />
      <label>Custom</label>
    </li>
  </ul>
</template>

<style scoped>
ul {
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin: 10px 0;
  padding: 0;
}

li {
  list-style-type: none;
  margin: 0;
  font-size: 0.8rem;
  text-align: center;
  padding: 6px;
}

li:hover {
  cursor: pointer;
}

svg {
  height: 24px;
  width: 24px;
}

label {
  display: block;
}

.active-search-type {
  color: var(--accent);
  text-decoration: underline;
}
</style>
