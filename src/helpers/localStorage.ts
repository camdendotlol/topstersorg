// Functions for dealing with localStorage

import type { StoredChart } from '../types'
import { localStorageMigrations } from './migrations'

export const setStoredCharts = (charts: StoredChart[]): void => {
  const migrated = localStorageMigrations(charts)
  localStorage.setItem('charts', JSON.stringify(migrated))
}

export const getStoredCharts = (): StoredChart[] => {
  const charts = JSON.parse(localStorage.getItem('charts') || '[]') as StoredChart[]

  return charts.sort((a: StoredChart, b: StoredChart) => {
    return a.timestamp - b.timestamp
  })
}

export const appendStoredCharts = (newCharts: StoredChart[]): void => {
  const existing = getStoredCharts()

  const combined = existing.concat(newCharts)

  setStoredCharts(combined)
}
