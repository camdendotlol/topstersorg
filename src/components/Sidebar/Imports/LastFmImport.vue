<!-- eslint-disable no-alert -->
<script setup lang="ts">
import type { Ref } from 'vue'
import type { ChartItem, Period, SearchResult } from '../../../types'
import { nextTick, ref } from 'vue'
import { getUserTopMusic } from '../../../api/music'
import { createNewChart, imageExists, periodHeaders } from '../../../helpers/chart'
import { initialState, useStore } from '../../../store'
import LoadingSpinner from '../../LoadingSpinner.vue'

const store = useStore()

const lastFmUsername: Ref<HTMLInputElement> = ref(null)
const lastFmPeriodDropdown: Ref<HTMLSelectElement> = ref(null)

const isImporting = ref(false)

// alert() blocks rendering, so wait for the overlay to
// actually disappear from the screen before showing one.
async function hideOverlay() {
  isImporting.value = false
  await nextTick()
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

async function importLastFmChart() {
  if (isImporting.value)
    return null

  isImporting.value = true

  try {
    await runImport()
  }
  finally {
    isImporting.value = false
  }
}

async function runImport() {
  const username = lastFmUsername.value.value

  if (!username)
    return null

  const periodDropdown = lastFmPeriodDropdown.value
  const period = periodDropdown.options[periodDropdown.selectedIndex].value as Period

  let results: SearchResult[]

  try {
    results = await getUserTopMusic(username, period)
  }
  catch {
    await hideOverlay()
    alert('Something went wrong when downloading your Last.fm data! Is your username spelled correctly?')
    return null
  }

  const missingCovers: string[] = []

  // MBID-based Cover Art Archive URLs might not resolve to working links
  const coverExists = await Promise.all(
    results.map(item => item.cover ? imageExists(item.cover) : Promise.resolve(false)),
  )

  const filtered = results.filter((item, idx) => {
    if (!coverExists[idx]) {
      missingCovers.push(`${item.creator} - ${item.name}`)
      return false
    }

    return true
  })

  const newItems = Array.from({ length: 144 }).fill(null) as ChartItem[]

  filtered.forEach((item, idx) => {
    newItems[idx] = {
      title: item.name,
      creator: item.creator,
      coverURL: item.cover,
    }
  })

  createNewChart()

  const getSize = (length: number) => {
    for (let i = 1; i <= 10; i++) {
      if (length < (i * i)) {
        return {
          x: i,
          y: i,
        }
      }
    }

    return {
      x: 10,
      y: 10,
    }
  }

  store.setEntireChart({
    ...initialState.chart,
    title: `${username}'s ${periodHeaders[period]} Chart`,
    items: newItems,
    size: getSize(filtered.length),
  })

  if (missingCovers.length > 0) {
    await hideOverlay()
    alert(
      `Couldn't add the following albums because they're missing cover art:\n\n${missingCovers.join('\n\n')}`,
    )
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isImporting"
      class="import-overlay"
    >
      <LoadingSpinner :size="80" />
    </div>
  </Teleport>
  <form
    id="lastFmImportChart"
    @submit.prevent="importLastFmChart"
  >
    <img
      class="lastfm-logo"
      src="/lastfm_logo.svg"
      alt="Last.fm"
    >
    <div class="form-item">
      <label for="lastfm-username">
        Username
      </label>
      <input
        id="lastFmUsername"
        ref="lastFmUsername"
        type="text"
        name="lastFmUsername"
        placeholder="username"
        required
      >
    </div>
    <div class="form-item">
      <label for="lastFmPeriodDropdown">
        Period
      </label>
      <select
        id="lastFmPeriodDropdown"
        ref="lastFmPeriodDropdown"
        name="lastFmPeriodDropdown"
      >
        <option value="overall">
          Overall
        </option>
        <option value="7day">
          7 day
        </option>
        <option value="1month">
          1 month
        </option>
        <option value="3month">
          3 month
        </option>
        <option value="6month">
          6 month
        </option>
        <option value="12month">
          12 month
        </option>
      </select>
    </div>
    <button
      id="lastfmImportButton"
      type="submit"
      class="import-button"
      :disabled="isImporting"
    >
      Import from Last.fm
    </button>
  </form>
</template>

<style scoped>
.import-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.6);
}

#lastFmImportChart {
  display: flex;
  flex-flow: column;
  gap: 14px;
 }

.lastfm-logo {
  width: 100px;
  margin: auto;
}

.form-item {
  display: flex;
  flex-direction: column;
  margin: 0 40px;
}

.form-item input {
  font-size: 16px;
}

.form-item label {
  font-size: 0.8rem;
}

.import-button {
  max-width: 200px;
  align-self: center;
}
</style>
