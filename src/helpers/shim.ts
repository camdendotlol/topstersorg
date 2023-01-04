// This helper library updates old charts to new formats

import type { Chart } from '../types'

const updateWithShim = (chart: Chart): Chart => {
  // Avoid mutating the original
  const clone = { ...chart }

  if (!clone.font) {
    console.log('no font found! setting to Ubuntu Mono')
    clone.font = 'Ubuntu Mono'
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

export default updateWithShim
