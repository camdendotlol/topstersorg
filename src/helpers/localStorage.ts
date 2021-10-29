// Functions for dealing with localStorage

import { StoredChart } from '@/types'

export const setStoredCharts = (charts: StoredChart[]): void => {
  localStorage.setItem('charts', JSON.stringify(charts))
}

export const getStoredCharts = (): StoredChart[] => {
  const charts = JSON.parse(localStorage.getItem('charts') || '[]')

  const sortedCharts = charts.sort((a: StoredChart, b: StoredChart) => {
    return a.timestamp - b.timestamp
  })

  return sortedCharts
}
