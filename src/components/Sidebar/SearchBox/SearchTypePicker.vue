<script setup lang="ts">
import {
  BIconBook,
  BIconController,
  BIconFilm,
  BIconTools,
  BIconMusicNoteBeamed,
  BIconTv
} from 'bootstrap-icons-vue'
import { SearchTypes } from '../../../types'

interface Props {
  currentType: SearchTypes,
}

const props = defineProps<Props>()

const emit = defineEmits([
  'setSearchType'
])

const isActive = (type: SearchTypes) => {
  if (type === props.currentType) {
    return 'active-search-type'
  }

  return ''
}
</script>

<template>
  <ul>
    <li
      @click="emit('setSearchType', SearchTypes.Music)"
      :class="isActive(SearchTypes.Music)"
    >
      <BIconMusicNoteBeamed />
      <span>Music</span>
    </li>
    <li
      @click="emit('setSearchType', SearchTypes.Games)"
      :class="isActive(SearchTypes.Games)"
    >
      <BIconController />
      <span>Games</span>
    </li>
    <li
      @click="emit('setSearchType', SearchTypes.Books)"
      :class="isActive(SearchTypes.Books)"
    >
      <BIconBook />
      <span>Books</span>
    </li>
    <li
      @click="emit('setSearchType', SearchTypes.Movies)"
      :class="isActive(SearchTypes.Movies)"
    >
      <BIconFilm />
      <span>Movies</span>
    </li>
    <li
      @click="emit('setSearchType', SearchTypes.Shows)"
      :class="isActive(SearchTypes.Shows)"
    >
      <BIconTv />
      <span>Shows</span>
    </li>
    <li
      @click="emit('setSearchType', SearchTypes.Custom)"
      :class="isActive(SearchTypes.Custom)"
    >
      <BIconTools />
      <span>Custom</span>
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

.active-search-type {
  color: var(--accent);
  border-radius: 10px;
}
</style>
