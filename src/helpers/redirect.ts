import { getStoredCharts } from './localStorage'

// Redirect new users to topsters.org
export const redirectUsers = (): void => {
  const currentCharts = getStoredCharts()

  if (
    currentCharts.length === 1 &&
    currentCharts[0].data.items.filter(i => i).length === 0) {
    window.location.replace('https://topsters.org')
  }
}
