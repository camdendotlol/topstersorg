import type { Chart } from '../../types'

export interface CanvasInfo {
  scaleRatio: number
  scaledGap: number
  scaledTitleHeight: number
  scaledItemSize: number
  scaledPixelDimensions: { x: number, y: number }
  scaledItemTitleHeight: number
}

// This is a constant (for now)
const ITEM_SIZE = 260

// Gets useful client-size information about the Canvas, especially related to scaling.
// The Canvas is scaled down to fit the screen if it's too large, so we need these for mouse events.
export function getCanvasInfo(canvas: HTMLCanvasElement, chart: Chart): CanvasInfo {
  const chartTitleMargin = chart.title === '' ? 0 : 60

  // The ratio by which the Canvas is scaled down in the browser
  const scaleRatio = canvas.clientHeight / canvas.height

  const fontSize = Math.floor(ITEM_SIZE / 16.25)

  // assuming 15px margins above and below the text
  const itemTitleHeight = chart.titlePosition === 'below' ? (fontSize * 2 + 30) : 0

  return {
    scaleRatio,
    scaledGap: chart.gap * scaleRatio,
    scaledTitleHeight: chartTitleMargin * scaleRatio,
    scaledItemSize: ITEM_SIZE * scaleRatio,
    scaledPixelDimensions: {
      x: canvas.width * scaleRatio,
      y: canvas.height * scaleRatio,
    },
    scaledItemTitleHeight: itemTitleHeight * scaleRatio,
  }
}

export function isDroppable(canvasInfo: CanvasInfo, chart: Chart, mouseCoords: { x: number, y: number }): boolean {
  // The part after the && makes sure to exclude the area on the side where titles are shown.
  const isXValid = (coord: number): boolean => {
    return (coord % (canvasInfo.scaledItemSize + canvasInfo.scaledGap)) > canvasInfo.scaledGap && (coord < (canvasInfo.scaledItemSize + canvasInfo.scaledGap) * chart.size.x + canvasInfo.scaledGap)
  }

  const isYValid = (coord: number): boolean => {
    return (((coord - canvasInfo.scaledTitleHeight) % (canvasInfo.scaledItemSize + canvasInfo.scaledGap + canvasInfo.scaledItemTitleHeight)) + canvasInfo.scaledItemTitleHeight) > canvasInfo.scaledGap + canvasInfo.scaledItemTitleHeight
  }

  if (isXValid(mouseCoords.x) && isYValid(mouseCoords.y)) {
    return true
  }
  else {
    return false
  }
}

// Draws a light-gray placeholder box to show that there's a slot when there's no item
export function insertPlaceholder(drawingContext: CanvasRenderingContext2D | null, chart: Chart, index: number): void {
  if (!drawingContext) {
    throw new Error('Rendering context not found!')
  }

  const coords = {
    x: (index % chart.size.x),
    y: Math.floor(index / chart.size.x),
  }

  const chartTitleMargin = chart.title === '' ? 0 : 60

  // todo: we're repeating this logic a lot lol
  const fontSize = Math.floor(ITEM_SIZE / 16.25)
  const itemTitleHeight = chart.titlePosition === 'below' ? (fontSize * 2 + 30) : 0

  drawingContext.fillStyle = 'rgb(230, 230, 230)'
  // No need for scaled dimensions here, we're working on the original Canvas.
  drawingContext.fillRect(
    (coords.x * (ITEM_SIZE + chart.gap)) + chart.gap,
    (coords.y * (ITEM_SIZE + chart.gap + itemTitleHeight)) + chart.gap + chartTitleMargin,
    ITEM_SIZE,
    ITEM_SIZE,
  )
}

// Type guard to see whether the user interaction is from a mouse or a touch screen
export function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  if ((event as TouchEvent).touches) {
    return true
  }
  else {
    return false
  }
}

export function isDragAndDropEvent(event: unknown): event is DragEvent {
  if ((event as DragEvent).dataTransfer) {
    return true
  }
  else {
    return false
  }
}
