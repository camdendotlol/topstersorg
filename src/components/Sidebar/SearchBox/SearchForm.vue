<script setup lang="ts">
import { ref } from 'vue'
import { queryMethodMap } from '../../../helpers/search'
import { SearchTypes } from '../../../types'
import CustomItemForm from './CustomItemForm.vue'
import LoadingEllipses from './LoadingEllipses.vue'

interface Props {
  searchType: SearchTypes
}

const props = defineProps<Props>()

const emit = defineEmits([
  'updateResults',
])

const loading = ref(false)

const query = ref('')

// Hacky workaround to an annoying Vue bug:
// Emit arguments don't seem to be passed when the emit
// goes through two layers of child components. So here
// we must create a normal function that calls the parent
// component's emit, and then pass this as an emit to the
// child component. Ugh.
function emitUpdateResults(results: unknown[]) {
  emit('updateResults', results)
}

async function handleSearch() {
  if (loading.value) {
    return null
  }

  loading.value = true
  const results = await queryMethodMap[props.searchType as keyof typeof queryMethodMap](query.value)
  if (results) {
    emit('updateResults', results)
  }
  loading.value = false
}

function getInputPlaceholder() {
  if (props.searchType === SearchTypes.Custom) {
    return 'Enter URL'
  }

  return `Search for ${props.searchType}`
}
</script>

<template>
  <CustomItemForm
    v-if="searchType === 'custom'"
    @update-results="emitUpdateResults"
  />
  <form
    v-else
    class="add-form"
    @submit.prevent="handleSearch"
  >
    <div
      class="form-flex"
    >
      <input
        id="searchbox"
        v-model="query"
        :placeholder="getInputPlaceholder()"
      >
      <button type="submit" class="submit-button">
        <LoadingEllipses v-if="loading" />
        <span v-else>🔎</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.form-flex {
  display: flex;
  gap: 6px;
  margin: 0 10px;
}

#searchbox {
  height: 36px;
  flex-grow: 1;
  font-size: 1rem;
}

#searchbox::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.submit-button {
  border-radius: 6px;
  border: none;
  height: 36px;
  width: 36px;
  background-color: var(--input-bg);
}

.custom-form-item {
  margin-top: 10px;
}

.custom-metadata-form > label {
  margin-bottom: 4px;
}
</style>
