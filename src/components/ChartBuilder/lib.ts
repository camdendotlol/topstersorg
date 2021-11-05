import { BackgroundTypes, Chart } from '@/types'

export interface CanvasInfo {
  scaleRatio: number,
  scaledGap: number,
  scaledTitleHeight: number,
  scaledItemSize: number
  scaledPixelDimensions: { x: number, y: number },
}

// This is a constant (for now)
const ITEM_SIZE = 260

// Gets useful client-size information about the Canvas, especially related to scaling.
// The Canvas is scaled down to fit the screen if it's too large, so we need these for mouse events.
export const getCanvasInfo = (canvas: HTMLCanvasElement, chart: Chart): CanvasInfo => {
  const chartTitleMargin = chart.title === '' ? 0 : 60

  const originalPixelDimensions = {
    x: (chart.size.x * (ITEM_SIZE + chart.gap)) + chart.gap,
    y: (chart.size.y * (ITEM_SIZE + chart.gap)) + chart.gap + chartTitleMargin
  }

  // The ratio by which the Canvas is scaled down in the browser
  const scaleRatio = canvas.clientHeight / originalPixelDimensions.y

  return {
    scaleRatio,
    scaledGap: chart.gap * scaleRatio,
    scaledTitleHeight: chartTitleMargin * scaleRatio,
    scaledItemSize: ITEM_SIZE * scaleRatio,
    scaledPixelDimensions: {
      x: originalPixelDimensions.x * scaleRatio,
      y: originalPixelDimensions.y * scaleRatio
    }
  }
}

export const isDroppable = (
  canvasInfo: CanvasInfo,
  chart: Chart,
  mouseCoords: { x: number, y: number }
): boolean => {
  // The part after the && makes sure to exclude the area on the side where titles are shown.
  const isXValid = (coord: number): boolean => {
    return (coord % (canvasInfo.scaledItemSize + canvasInfo.scaledGap)) > canvasInfo.scaledGap && (coord < (canvasInfo.scaledItemSize + canvasInfo.scaledGap) * chart.size.x + canvasInfo.scaledGap)
  }

  // scaledChartTitleMargin accounts for the space taken up by the title if there is one.
  const isYValid = (coord: number): boolean => {
    return ((coord - canvasInfo.scaledTitleHeight) % (canvasInfo.scaledItemSize + canvasInfo.scaledGap)) > canvasInfo.scaledGap
  }

  if (isXValid(mouseCoords.x) && isYValid(mouseCoords.y)) {
    return true
  } else {
    return false
  }
}

// Draws a light-gray placeholder box to show that there's a slot when there's no item
export const insertPlaceholder = (drawingContext: CanvasRenderingContext2D | null, chart: Chart, index: number): void => {
  if (!drawingContext) {
    throw new Error('Rendering context not found!')
  }

  const coords = {
    x: (index % chart.size.x),
    y: Math.floor(index / chart.size.x)
  }

  const chartTitleMargin = chart.title === '' ? 0 : 60

  drawingContext.fillStyle = 'rgba(230, 230, 230)'
  // No need for scaled dimensions here, we're working on the original Canvas.
  drawingContext.fillRect(
    (coords.x * (ITEM_SIZE + chart.gap)) + chart.gap,
    (coords.y * (ITEM_SIZE + chart.gap)) + chart.gap + chartTitleMargin,
    ITEM_SIZE,
    ITEM_SIZE
  )
}

// Type guard to see whether the user interaction is from a mouse or a touch screen
export const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
  if ((event as TouchEvent).touches) {
    return true
  } else {
    return false
  }
}

// This is an example chart that will auto-populate when the user visits ostrakon with the #demo hash.
// Specifically, this URL: https://www.ostrakon.xyz/#demo
// I made this to quickly show off the site to potential employers.
// eslint-disable-next-line quotes
export const demoChart = { timestamp: new Date().getTime(), name: "demo", data: { title: "🐐", items: [{ title: "Aviary", coverImg: {} as HTMLImageElement as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/8ee296bc1ea8dfcc004f9749da12b48b.png", creator: "Julia Holter" }, { title: "Psychopomp", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/22fe169065701d4d95dcc1a0f8b93b90.png", creator: "Japanese Breakfast" }, { title: "Ruins", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/0a71c53e645e445cc42d69db09a5679c.png", creator: "Grouper" }, { title: "Tomorrow's Harvest", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/a107b54f27c441a7a745332f5510f271.png", creator: "Boards of Canada" }, { title: "Have One on Me", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/5f863cceffcb45c692e648f11fce5160.png", creator: "Joanna Newsom" }, { title: "Punisher", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/4e31f6b52ff52b99a93650badd19b2c5.png", creator: "Phoebe Bridgers" }, { title: "magdalene", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/38d948783315f9d1b34d182944213ce3.png", creator: "FKA twigs" }, { title: "Origin of Symmetry", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/5a2c98f98f05f457d770bfaf45f7cc8a.png", creator: "Muse" }, { title: "Serotonin II", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/ef4eb7f2cc80106904023752710997cf.png", creator: "Yeule" }, { title: "Soft Sounds From Another Planet", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/cbf1dee4189770223d517c4e2b4b6d2e.png", creator: "Japanese Breakfast" }, { title: "In a Beautiful Place Out in the Country", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/97ac027554404e64cee7933587fca3d6.png", creator: "Boards of Canada" }, { title: "High Top Mountain", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/497278cdb9f9441c9d9fc237ed37420a.png", creator: "Sturgill Simpson" }, { title: "The Solar-Myth Approach Vol. 1 (Remastered 2020)", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/e2902593830cd4f4e5f24be65633fc14.png", creator: "Sun Ra" }, { title: "Yhä hämärää", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/46c99df80d054250844d6f120252f033.png", creator: "Paavoharju" }, { title: "In Rainbows", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/8d91b7dd13084606b99d756175917f7d.png", creator: "Radiohead" }, { title: "The Assassination of Julius Caesar", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/9c3085462af4c55e6f62a9e1c8dff2a4.png", creator: "Ulver" }, { title: "The Man Machine", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/22b603c9c71746b8bf77fa0f258387f4.png", creator: "Kraftwerk" }, { title: "July 15, 1972", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/a734c739a0b14dfe9c15857af0b1ee2e.png", creator: "Taj Mahal Travellers" }, { title: "solipsisters", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/d4a40b33c760f1f8164f5ba4f536fcfd.png", creator: "katie dey" }, { title: "Jubilee", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/5d93403fbc951b7d31fa80ff826b5180.png", creator: "Japanese Breakfast" }, { title: "Rossz csillag alatt született", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/0b9be95745f84725add703ee64c0c9b7.png", creator: "Venetian Snares" }, { title: "Laulu laakson kukista", coverImg: {} as HTMLImageElement, coverURL: "https://lastfm.freetls.fastly.net/i/u/300x300/6a09b047abc3462b96a910e0a51e91aa.png", creator: "Paavoharju" }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], size: { x: 5, y: 5 }, background: { type: BackgroundTypes.Color, value: '#000000', img: null }, showTitles: true, gap: 20 }, currentlyActive: true }
