import { Chart } from '../../types'

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

  // The ratio by which the Canvas is scaled down in the browser
  const scaleRatio = canvas.clientHeight / canvas.height

  return {
    scaleRatio,
    scaledGap: chart.gap * scaleRatio,
    scaledTitleHeight: chartTitleMargin * scaleRatio,
    scaledItemSize: ITEM_SIZE * scaleRatio,
    scaledPixelDimensions: {
      x: canvas.width * scaleRatio,
      y: canvas.height * scaleRatio
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
  // The part after the && makes sure not to include grid squares below the last row of item,
  // for example when the titles in the sidebar extend down below the last row.
  const isYValid = (coord: number): boolean => {
    return ((coord - canvasInfo.scaledTitleHeight) % (canvasInfo.scaledItemSize + canvasInfo.scaledGap)) > canvasInfo.scaledGap && (coord < (canvasInfo.scaledItemSize + canvasInfo.scaledGap) * chart.size.y + canvasInfo.scaledTitleHeight)
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

  drawingContext.fillStyle = 'rgb(230, 230, 230)'
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

export const isDragAndDropEvent = (event: unknown): event is DragEvent => {
  if ((event as DragEvent).dataTransfer) {
    return true
  } else {
    return false
  }
}
