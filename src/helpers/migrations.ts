// This helper library updates old charts to new formats

import type { Chart, StoredChart } from '../types'
import { v4 as uuidv4 } from 'uuid'

// This was added when UUIDs were added to charts to make
// sure that pre-existing charts get UUIDs. As this runs
// constantly while the site is open, we should be able
// to remove this migration eventually once we're sure that
// >99% of users with old stored charts have opened the site.
export const localStorageMigrations = (charts: StoredChart[]) => {
  return charts.map(c => {
    if (c.uuid) {
      return c
    }

    return {
      ...c,
      uuid: uuidv4()
    }
  })
}

const updateWithMigrations = (chart: Chart): Chart => {
  // Avoid mutating the original
  const clone = { ...chart }

  // TODO: Remove the Ubuntu Mono check eventually
  if (!clone.font || clone.font === 'Ubuntu Mono') {
    console.log('no font found! setting to monospace')
    clone.font = 'monospace'
  }

  if (!Object.prototype.hasOwnProperty.call(clone, 'showNumbers')) {
    console.log('no number option found! setting to false')
    clone.showNumbers = false
  }

  if (!Object.prototype.hasOwnProperty.call(clone, 'shadows')) {
    console.log('no shadow option found! setting to true')
    clone.shadows = true
  }

  if (!clone.textColor) {
    console.log('no text color found! setting to #ffffff')
    clone.textColor = '#ffffff'
  }

  return clone
}

export default updateWithMigrations
