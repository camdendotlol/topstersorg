import { getStoredCharts } from './localStorage'

// Redirect new users to topsters.org
export const redirectUsers = (): void => {
  const currentCharts = getStoredCharts()

  if (
    Object.keys(currentCharts).length === 1 &&
    currentCharts[Object.keys(currentCharts)[0]].data.items.filter(i => i).length === 0) {
    window.location.replace('https://topsters.org')
  }
}
