import { Chart } from '@/types'

export const isDroppable = (
  chart: Chart,
  scalingRatio: number,
  mouseCoords: { x: number, y: number },
  canvasOffset: { x: number, y: number }
): boolean => {
  // Both chartTitleMargin and the item size (260x260) are hardcoded.
  // In the future this function will need to be updated if/when
  // those values become configurable.
  const scaledChartTitleMargin = chart.title === '' ? 0 : Math.floor(60 * scalingRatio)
  const scaledGap = Math.floor(chart.gap * scalingRatio)
  const scaledItemSize = Math.floor(260 * scalingRatio)

  const coordsOnCanvas = {
    x: mouseCoords.x - canvasOffset.x,
    y: mouseCoords.y - canvasOffset.y
  }

  // The part after the && makes sure to exclude the area on the side where titles are shown.
  const isXValid = (coord: number): boolean => {
    return (coord % (scaledItemSize + scaledGap)) > scaledGap && (coord < (scaledItemSize + scaledGap) * chart.size.x + scaledGap)
  }

  // Doesn't work right when chart title is shown
  // The math involved in handling that has had me stumped for an hour
  // so I will return with a clear head later.
  const isYValid = (coord: number): boolean => {
    return (coord % (scaledItemSize + scaledGap)) > scaledGap
  }

  if (isXValid(coordsOnCanvas.x) && isYValid(coordsOnCanvas.y)) {
    return true
  } else {
    return false
  }
}
