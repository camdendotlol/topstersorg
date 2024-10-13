// Functions for dealing with localStorage

import type { OldStoredChart, StoredChart, StoredCharts } from '../types'

export function setActiveChart(uuid: string) {
  localStorage.setItem('activeChart', uuid)

  return getActiveChart()
}

export function getActiveChartUuid(): string {
  return localStorage.getItem('activeChart')
}

export function getActiveChart(): StoredChart {
  return getStoredCharts()[getActiveChartUuid()]
}

export function getNewestChartUuid() {
  const chartEntries = Object.entries(getStoredCharts())

  return chartEntries.sort((a, b) => b[1].timestamp - a[1].timestamp)[0][0]
}

export function destroyChart(uuid: string) {
  const charts = getStoredCharts()

  delete charts[uuid]
  setStoredCharts(charts)
}

export function getUuids() {
  const charts = getStoredCharts()
  return Object.keys(charts)
}

export function setStoredCharts(charts: StoredCharts): void {
  return localStorage.setItem('charts', JSON.stringify(charts))
}

export function getStoredCharts(): StoredCharts {
  return JSON.parse(localStorage.getItem('charts') || '{}') as StoredCharts
}

export function updateStoredChart(updatedChart: StoredChart, uuid: string) {
  const charts = getStoredCharts()

  charts[uuid] = { ...updatedChart }

  setStoredCharts(charts)
}

export function findByUuid(uuid: string) {
  const charts = getStoredCharts()

  const matching = Object.entries(charts).find(en => en[0] === uuid)

  if (matching) {
    return matching[1]
  }

  return null
}

export function appendChart(newChart: StoredChart, uuid?: string): string {
  const charts = getStoredCharts()

  const newUuid = uuid || crypto.randomUUID()

  charts[newUuid] = newChart

  setStoredCharts(charts)

  return newUuid
}

// Migration to change to the new data format for charts.
// See https://github.com/camdendotlol/topstersorg/issues/33
export function localStorageMigrations() {
  const charts = getStoredCharts() as unknown as OldStoredChart[]

  // If the `charts` value is an array instead of an object,
  // we know we're on the old data model.
  if (Array.isArray(charts)) {
    // Let's back up this data bc this whole process is kinda scary
    localStorage.setItem('oldChartsBackup', JSON.stringify(charts))

    const newObj: { [uuid: string]: StoredChart } = {}
    let activeUuid = null

    charts.forEach((chart) => {
      const uuid = crypto.randomUUID()
      newObj[uuid] = {
        timestamp: chart.timestamp,
        data: chart.data,
      }

      if (chart.currentlyActive) {
        activeUuid = uuid
      }
    })

    setStoredCharts(newObj)
    setActiveChart(activeUuid || Object.keys(newObj)[0])
  }
}

export function chartMigrations() {
  const charts = getStoredCharts()

  let changed = false

  Object.keys(charts).forEach((uuid) => {
    const chart = charts[uuid]

    // add layout property
    if (!chart.data.layout) {
      charts[uuid] = {
        ...chart,
        data: {
          ...chart.data,
          layout: 'grid',
        },
      }

      changed = true
    }

    // add title position property
    if (!chart.data.titlePosition) {
      charts[uuid] = {
        ...chart,
        data: {
          ...chart.data,
          titlePosition: 'right',
        },
      }

      changed = true
    }
  })

  if (changed) {
    setStoredCharts(charts)
  }
}
