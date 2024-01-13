// Functions for dealing with localStorage

import type { StoredChart } from '../types'
import { v4 as uuidv4 } from 'uuid'

export const setStoredCharts = (charts: StoredChart[]): void => {
  localStorage.setItem('charts', JSON.stringify(charts))
}

export const getStoredCharts = (): StoredChart[] => {
  const charts = JSON.parse(localStorage.getItem('charts') || '[]') as StoredChart[]

  return charts.sort((a: StoredChart, b: StoredChart) => {
    return a.timestamp - b.timestamp
  })
}

export const updateStoredChart = (updatedChart: StoredChart) => {
  const charts = getStoredCharts()

  setStoredCharts(charts.map(ch => {
    if (ch.uuid === updatedChart.uuid) {
      return { ...updatedChart, currentlyActive: true }
    } else {
      return { ...ch, currentlyActive: false }
    }
  }))
}

export const appendChart = (newChart: StoredChart) => {
  const charts = getStoredCharts().map(ch => ({ ...ch, currentlyActive: false }))

  setStoredCharts(charts.concat({ ...newChart, currentlyActive: true }))
}

// This was added when UUIDs were added to charts to make
// sure that pre-existing charts get UUIDs. As this runs
// constantly while the site is open, we should be able
// to remove this migration eventually once we're sure that
// >99% of users with old stored charts have opened the site.
export const localStorageMigrations = () => {
  const charts = getStoredCharts()

  setStoredCharts(charts.map(c => ({ ...c, uuid: c.uuid || uuidv4() })))
}
