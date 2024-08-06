// Functions for dealing with localStorage

import type { OldStoredChart, StoredChart, StoredCharts } from '../types'

export const setActiveChart = (uuid: string) => {
  localStorage.setItem('activeChart', uuid)

  return getActiveChart()
}

export const getActiveChartUuid = (): string => (
  localStorage.getItem('activeChart')
)

export const getActiveChart = (): StoredChart => (
  getStoredCharts()[getActiveChartUuid()]
)

export const getNewestChartUuid = () => {
  const chartEntries = Object.entries(getStoredCharts())

  return chartEntries.sort((a, b) => b[1].timestamp - a[1].timestamp)[0][0]
}

export const destroyChart = (uuid: string) => {
  const charts = getStoredCharts()

  delete charts[uuid]
  setStoredCharts(charts)
}

export const getUuids = () => {
  const charts = getStoredCharts()
  return Object.keys(charts)
}

export const setStoredCharts = (charts: StoredCharts): void => (
  localStorage.setItem('charts', JSON.stringify(charts))
)

export const getStoredCharts = (): StoredCharts => (
  JSON.parse(localStorage.getItem('charts') || '{}') as StoredCharts
)

export const updateStoredChart = (updatedChart: StoredChart, uuid: string) => {
  const charts = getStoredCharts()

  charts[uuid] = { ...updatedChart }

  setStoredCharts(charts)
}

export const findByUuid = (uuid: string) => {
  const charts = getStoredCharts()

  const matching = Object.entries(charts).find(en => en[0] === uuid)

  if (matching) {
    return matching[1]
  }

  return null
}

export const appendChart = (newChart: StoredChart, uuid?: string): string => {
  const charts = getStoredCharts()

  const newUuid = uuid || crypto.randomUUID()

  charts[newUuid] = newChart

  setStoredCharts(charts)

  return newUuid
}

// Migration to change to the new data format for charts.
// See https://github.com/camdendotlol/topstersorg/issues/33
export const localStorageMigrations = () => {
  const charts = getStoredCharts() as unknown as OldStoredChart[]

  // If the `charts` value is an array instead of an object,
  // we know we're on the old data model.
  if (Array.isArray(charts)) {
    // Let's back up this data bc this whole process is kinda scary
    localStorage.setItem('oldChartsBackup', JSON.stringify(charts))

    const newObj: { [uuid: string]: StoredChart } = {}
    let activeUuid = null

    charts.forEach(chart => {
      const uuid = crypto.randomUUID()
      newObj[uuid] = {
        timestamp: chart.timestamp,
        data: chart.data
      }

      if (chart.currentlyActive) {
        activeUuid = uuid
      }
    })

    setStoredCharts(newObj)
    setActiveChart(activeUuid || Object.keys(newObj)[0])
  }
}
