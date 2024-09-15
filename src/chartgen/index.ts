import {
  drawBackground,
  drawTitle,
  insertCoverImages,
  insertTitlesBelow,
  insertTitlesRight,
  setup,
} from './lib'
import type { Chart } from '../types'

function generateChart(canvas: HTMLCanvasElement, chart: Chart, cellSize = 260): HTMLCanvasElement {
  const canvasInfo = setup(canvas, chart, cellSize)

  drawBackground(canvasInfo, chart)

  if (chart.shadows) {
    canvasInfo.ctx.shadowOffsetX = 2
    canvasInfo.ctx.shadowOffsetY = 2
    canvasInfo.ctx.shadowBlur = 4
    canvasInfo.ctx.shadowColor = 'rgba(0,0,0,0.6)'
  }

  if (chart.textColor && /^#[0-9A-F]{6}$/i.test(chart.textColor)) {
    canvasInfo.ctx.fillStyle = chart.textColor
  }
  else {
    canvasInfo.ctx.fillStyle = 'white'
  }

  // Draw the title at the top
  if (chart.title !== '') {
    drawTitle(canvasInfo, chart)
  }

  insertCoverImages(
    chart,
    canvasInfo,
  )

  if (chart.showTitles) {
    if (chart.titlePosition === 'right') {
      insertTitlesRight(canvasInfo, chart)
    }
    else if (chart.titlePosition === 'below') {
      insertTitlesBelow(canvasInfo, chart)
    }
  }

  return canvas
}

export default generateChart
