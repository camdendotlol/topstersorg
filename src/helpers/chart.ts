// Functions for filling in the chart.

import type {
  ChartItem,
  Result,
} from '../types'
import { initialState, useStore } from '../store'
import { appendChart, getActiveChart, setActiveChart } from './localStorage'
import {
  isBookResult,
  isCustomResult,
  isGameResult,
  isMovieResult,
  isMusicResult,
  isTVResult,
} from './typeGuards'

// To run the first time Topsters.org launches, or when we want to reset everything.
export function initializeFirstRun(): void {
  const newUuid = appendChart({
    timestamp: new Date().getTime(),
    data: initialState.chart,
  })

  setActiveChart(newUuid)
}

export function setImage(url: string): HTMLImageElement {
  const cover = new Image()
  cover.src = url
  return cover
}

export function createChartItem(item: Result): ChartItem {
  if (isBookResult(item)) {
    return {
      title: item.title,
      coverURL: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-L.jpg`,
      creator: item.author_name[0],
    }
  }
  else if (isMusicResult(item)) {
    const largestImageIndex = item.image.length - 1
    return {
      title: item.name,
      coverURL: item.image[largestImageIndex]['#text'],
      creator: item.artist,
    }
  }
  else if (isGameResult(item)) {
    return {
      title: item.name,
      coverURL: item.cover,
    }
  }
  else if (isMovieResult(item)) {
    return {
      title: item.title,
      coverURL: `https://image.tmdb.org/t/p/w185/${item.poster_path}`,
    }
  }
  else if (isTVResult(item)) {
    return {
      title: item.name,
      coverURL: `https://image.tmdb.org/t/p/w185/${item.poster_path}`,
    }
  }
  else if (isCustomResult(item)) {
    return {
      title: item.title,
      creator: item.creator,
      coverURL: item.imageURL,
    }
  }
  else {
    throw new Error('Invalid chart item')
  }
}

function inlineSafeBackgroundsPlugin() {
  const urlRe = /url\((['"]?)([^'")]+)\1\)/g

  async function toDataUrl(url: string): Promise<string> {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' })
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result as string)
      fr.onerror = reject
      fr.readAsDataURL(blob)
    })
  }

  return {
    name: 'inline-safe-backgrounds',
    async afterClone(context) {
      const origs = [context.element, ...context.element.querySelectorAll('*')] as HTMLElement[]
      const clones = [context.clone, ...context.clone.querySelectorAll('*')] as HTMLElement[]

      await Promise.all(origs.map(async (orig, i) => {
        const clone = clones[i]
        if (!clone) {
          return
        }

        const bg = getComputedStyle(orig).backgroundImage
        if (!bg || bg === 'none' || !bg.includes('url(')) {
          return
        }

        const urls = [...new Set([...bg.matchAll(urlRe)].map(m => m[2]))]
        const map = new Map<string, string>()
        await Promise.all(urls.map(async (u) => {
          if (u.startsWith('data:')) return
          try {
            map.set(u, await toDataUrl(u))
          } catch {}
        }))
        if (map.size === 0) {
          return
        }

        clone.style.backgroundImage = bg.replace(urlRe, (whole, _q, u) => map.has(u) ? `url("${map.get(u)}")` : whole)
      }))
    },
  }
}

function inlineSafeImagesPlugin() {
  return {
    name: 'inline-safe-images',
    async afterClone(context) {
      const imgs = [...context.clone.querySelectorAll('img')] as HTMLImageElement[]

      await Promise.all(imgs.map(async (img) => {
        const src = img.src
        if (!src || src.startsWith('data:')) return
        try {
          const res = await fetch(src, { mode: 'cors', credentials: 'omit' })
          const blob = await res.blob()
          img.src = await new Promise<string>((resolve, reject) => {
            const fr = new FileReader()
            fr.onload = () => resolve(fr.result as string)
            fr.onerror = reject
            fr.readAsDataURL(blob)
          })
        } catch {}
      }))
    },
  }
}

function chartCapturePlugin() {
  return {
    name: 'chart-capture',
    afterClone(context) {
      const root = context.clone
      for (const ph of root.querySelectorAll('.placeholder')) {
        const el = ph as HTMLElement
        el.classList.remove('placeholder')
        el.style.boxShadow = 'none'
      }
    },
  }
}

export async function downloadChart(): Promise<void> {
  const { snapdom } = await import('@zumer/snapdom')
  const element = document.querySelector('#chart') as HTMLElement

  if (!element) {
    throw new Error('Chart not found! Something must have gone horribly wrong.')
  }

  const rect = element.getBoundingClientRect()
  const ratio = element.offsetWidth ? rect.width / element.offsetWidth : 1

  const result = await snapdom(element, {
    scale: ratio ? 1 / ratio : 1,
    embedFonts: true,
    useProxy: `${import.meta.env.VITE_BACKEND_URL}/api/proxy?url=`,
    plugins: [chartCapturePlugin(), inlineSafeImagesPlugin(), inlineSafeBackgroundsPlugin()],
  })

  const blob = await result.toBlob({ type: 'png' })
  const url = URL.createObjectURL(blob)
  saveChartImage(url)
}

// Saves the chart as an image
function saveChartImage(url: string): void {
  const link = document.createElement('a')
  link.download = 'chart.png'
  link.href = url
  link.rel = 'noopener'
  link.target = '_self'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function createNewChart() {
  const newUuid = appendChart({
    timestamp: new Date().getTime(),
    data: initialState.chart,
  })

  setActiveChart(newUuid)
}

// Forces the chart to re-render from localStorage.
// Useful in situations where we update the charts by
// modifying localStorage directly such as imports.
export function forceRefresh() {
  const store = useStore()

  const activeChart = getActiveChart()
  store.setEntireChart(activeChart.data)
}

export const periodHeaders = {
  'overall': 'All-Time',
  '7day': 'Weekly',
  '1month': 'Monthly',
  '3month': '3 Month',
  '6month': '6 Month',
  '12month': 'Yearly',
}
