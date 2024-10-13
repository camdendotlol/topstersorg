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
