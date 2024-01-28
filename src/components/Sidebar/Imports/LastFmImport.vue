<script setup lang="ts">
import { Ref, ref } from 'vue'
import { initialState, useStore } from '../../../store'
import { ChartItem, LastfmChartResponseItem, Period } from '../../../types'
import { getLastfmChart } from '../../../api/lastfm'
import { createNewChart, periodHeaders } from '../../../helpers/chart'

const store = useStore()

const lastFmUsername: Ref<HTMLInputElement> = ref(null)
const lastFmPeriodDropdown: Ref<HTMLSelectElement> = ref(null)

const importLastFmChart = async () => {
  const username = lastFmUsername.value.value

  if (!username) return null

  const periodDropdown = lastFmPeriodDropdown.value
  const period = periodDropdown.options[periodDropdown.selectedIndex].value as Period

  let results: LastfmChartResponseItem[]

  try {
    results = await getLastfmChart(username, 'albums', period)
  } catch {
    alert('Something went wrong when downloading your Last.fm data! Is your username spelled correctly?')
    return null
  }
  const missingCovers: string[] = []

  const filtered = results.filter((item: LastfmChartResponseItem) => {
    const coverURL = item.image.find((i) => i.size === 'extralarge')['#text']

    if (coverURL === '') {
      missingCovers.push(`${item.artist.name} - ${item.name}`)
      return false
    }

    return true
  })

  const newItems: ChartItem[] = filtered.map((item: LastfmChartResponseItem) => {
    const coverURL = item.image.find((i) => i.size === 'extralarge')['#text']
    const coverImg = new Image()
    coverImg.src = coverURL

    return {
      title: item.name,
      creator: item.artist.name,
      coverImg,
      coverURL
    }
  })

  createNewChart()

  const getSize = (length: number) => {
    for (let i = 1; i <= 10; i++) {
      if (length < (i * i)) {
        return {
          x: i,
          y: i
        }
      }
    }

    return {
      x: 10,
      y: 10
    }
  }

  store.commit('setEntireChart', {
    ...initialState.chart,
    title: `${username}'s ${periodHeaders[period]} Chart`,
    items: newItems,
    size: getSize(newItems.length)
  })

  if (missingCovers.length > 0) {
    alert(
      `Couldn't add the following albums because they're missing cover art on Last.fm:\n\n${missingCovers.join('\n\n')}`
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
          type="text"
          ref="lastFmUsername"
          id="lastFmUsername"
          name="lastFmUsername"
          placeholder="username"
          required
        />
      </div>
      <div class="form-item">
        <label for="lastFmPeriodDropdown">
          Period
        </label>
        <select
          id="lastFmPeriodDropdown"
          name="lastFmPeriodDropdown"
          ref="lastFmPeriodDropdown"
        >
          <option value="overall">Overall</option>
          <option value="7day">7 day</option>
          <option value="1month">1 month</option>
          <option value="3month">3 month</option>
          <option value="6month">6 month</option>
          <option value="12month">12 month</option>
        </select>
      </div>
      <button
        type="submit"
        id="lastfmImportButton"
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

.form-item label {
  font-size: 0.8rem;
}

.import-button {
  max-width: 200px;
  align-self: center;
}
</style>
