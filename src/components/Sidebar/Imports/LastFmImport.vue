<!-- eslint-disable no-alert -->
<script setup lang="ts">
import type { ChartItem, LastfmChartResponseItem, Period } from '../../../types'
import { ref } from 'vue'
import { getLastfmChart } from '../../../api/lastfm'
import { createNewChart, periodHeaders } from '../../../helpers/chart'
import { initialState, useStore } from '../../../store'

const store = useStore()

const lastFmUsername = ref('')
const lastFmPeriod = ref<Period>('1month')

async function importLastFmChart() {
  if (!lastFmUsername.value) {
    return null
  }

  let results: LastfmChartResponseItem[]

  try {
    results = await getLastfmChart(lastFmUsername.value, 'albums', lastFmPeriod.value)
  }
  catch {
    alert('Something went wrong when downloading your Last.fm data! Is your username spelled correctly?')
    return null
  }

  const missingCovers: string[] = []

  const newItems = Array.from({ length: 144 }).fill(null) as ChartItem[]
  let nonNullItemCount = 0

  results.forEach((item: LastfmChartResponseItem, idx) => {
    const cover = item.image.find(i => i.size === 'extralarge')

    if (cover) {
      const coverURL = cover['#text']
      newItems[idx] = {
        title: item.name,
        creator: item.artist.name,
        coverURL,
      }
      nonNullItemCount++
    }
    else {
      missingCovers.push(`${item.artist.name} - ${item.name}`)
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
    title: `${lastFmUsername.value}'s ${periodHeaders[lastFmPeriod.value]} Chart`,
    items: newItems,
    size: getSize(nonNullItemCount),
  })

  if (missingCovers.length > 0) {
    alert(
      `Couldn't add the following albums because they're missing cover art on Last.fm:\n\n${missingCovers.join('\n\n')}`,
    )
  }
}
</script>

<template>
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
        v-model="lastFmUsername"
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
        v-model="lastFmPeriod"
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
    >
      Import from Last.fm
    </button>
  </form>
</template>

<style scoped>
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
