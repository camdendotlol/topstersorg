import type { Chart } from '../types'

export enum BackgroundTypes {
  Color = 'color',
  Image = 'image',
}

export interface ChartItem {
  title: string
  creator?: string
  coverURL: string
  coverImg: HTMLImageElement
}

interface TitleMap {
  [key: number]: string
}

export interface CanvasInfo {
  width: number
  height: number
  cellSize: number
  chartTitleMargin: number
  maxItemTitleWidth: number
  titles: TitleMap
  ctx: CanvasRenderingContext2D
  fontSize: number
}

// The sidebar containing the titles of chart items should only be as
// wide as the longest title, plus a little bit of margin.
function getMaxTitleWidth(chart: Chart, titles: TitleMap, ctx: CanvasRenderingContext2D, fontSize: number): number {
  let maxTitleWidth = 0
  ctx.font = `${fontSize}pt ${chart.font ? chart.font : 'monospace'}`
  if (chart.textColor && /^#[0-9A-F]{6}$/i.test(chart.textColor)) {
    ctx.fillStyle = chart.textColor
  }
  else {
    ctx.fillStyle = 'white'
  }

  Object.keys(titles).forEach((key) => {
    const width = ctx.measureText(titles[Number.parseInt(key)]).width
    if (width > maxTitleWidth) {
      maxTitleWidth = width
    }
  })

  // A minimum margin of 20px keeps titles from being right up against the sides.
  return maxTitleWidth + 20 + chart.gap
}

// Finds how many pixels the horizontal and/or vertical margin should be
// in order to center the cover within its cell.
function findCenteringOffset(dimension: number, cellSize: number) {
  if (dimension < cellSize) {
    return Math.floor((cellSize - dimension) / 2)
  }
  else {
    return 0
  }
}

export function getScaledDimensions(img: HTMLImageElement, cellSize: number): { height: number, width: number } {
  let differencePercentage = 1

  if (img.width > cellSize && img.height > cellSize) {
    differencePercentage = Math.min((cellSize / img.width), (cellSize / img.height))
  }
  else if (img.width > cellSize) {
    differencePercentage = cellSize / img.width
  }
  else if (img.height > cellSize) {
    differencePercentage = cellSize / img.height
  }
  else if (img.width < cellSize && img.height < cellSize) {
    differencePercentage = Math.min((cellSize / img.width), (cellSize / img.height))
  }

  return {
    height: Math.floor(img.height * differencePercentage),
    width: Math.floor(img.width * differencePercentage),
  }
}

export function drawCover(cover: HTMLImageElement, coords: { x: number, y: number }, gap: number, canvasInfo: CanvasInfo): void {
  const dimensions = getScaledDimensions(cover, canvasInfo.cellSize)

  canvasInfo.ctx.drawImage(
    // We have to cast this as HTMLImageElement even if it's a Node Canvas Image,
    // because ctx doesn't know what to do with the latter.
    cover as HTMLImageElement,
    (coords.x * (canvasInfo.cellSize + gap)) + gap + findCenteringOffset(dimensions.width, canvasInfo.cellSize),
    (coords.y * (canvasInfo.cellSize + gap)) + gap + findCenteringOffset(dimensions.height, canvasInfo.cellSize) + canvasInfo.chartTitleMargin,
    dimensions.width,
    dimensions.height,
  )
}

export function buildTitles(chart: Chart): TitleMap {
  const titles: TitleMap = {}

  const itemsInScope = chart.items.slice(0, chart.size.x * chart.size.y)
  let count = 0

  itemsInScope.forEach((item, index) => {
    if (item) {
      count += 1
      let titleString = item.title

      if (item.creator) {
        titleString = `${item.creator} - ${titleString}`
      }

      if (chart.showNumbers) {
        titleString = `${count}. ${titleString}`
      }

      titles[index] = titleString
    }
  })

  return titles
}

export function insertTitles(canvasInfo: CanvasInfo, chart: Chart, titles: TitleMap): void {
  const itemsInScope = chart.items.slice(0, chart.size.x * chart.size.y)

  canvasInfo.ctx.font = `${canvasInfo.fontSize}pt ${chart.font ? chart.font : 'monospace'}`
  canvasInfo.ctx.textAlign = 'left'
  canvasInfo.ctx.lineWidth = 0.3
  canvasInfo.ctx.strokeStyle = 'black'

  // Track where to start a new row
  let currentCellHeight = canvasInfo.chartTitleMargin + chart.gap + canvasInfo.fontSize

  // Track where to start a new title within each row
  let currentHeight = canvasInfo.chartTitleMargin + chart.gap + canvasInfo.fontSize

  // How much vertical space to put between titles.
  // 1.5-spacing seems fine until the chart hits around
  // 11 items wide, then we use a different method to
  // squish them in.
  const verticalMargin = chart.size.x < 11
    ? canvasInfo.fontSize * 1.5
    : Math.floor(canvasInfo.cellSize / chart.size.x)

  itemsInScope.forEach((item, index) => {
    // Keep an extra margin between each row
    if (index !== 0) {
      if (index % chart.size.x === 0) {
        currentCellHeight = currentCellHeight + canvasInfo.cellSize + chart.gap
        currentHeight = currentCellHeight
      }
      else {
        currentHeight = currentHeight + verticalMargin
      }
    }

    if (!item) {
      return null
    }

    const titleString = titles[index]

    canvasInfo.ctx.strokeText(
      titleString,
      canvasInfo.width - canvasInfo.maxItemTitleWidth + 10 - Math.floor(chart.gap / 2),
      currentHeight,
    )

    canvasInfo.ctx.fillText(
      titleString,
      canvasInfo.width - canvasInfo.maxItemTitleWidth + 10 - Math.floor(chart.gap / 2),
      currentHeight,
    )
  })
}

// Just calculates some data and sets the size of the chart
export function setup(canvas: HTMLCanvasElement, chart: Chart, cellSize: number): CanvasInfo {
  const gap = chart.gap
  const ctx = canvas.getContext('2d', { alpha: false })

  if (!ctx) {
    throw new Error('Rendering context not found, try reloading!')
  }

  // The original default was 16pt font size with 260px cells.
  // 260/16.25 is 16, so we divide by 16.25 to preserve the
  // font size ratio for user-configured cell sizes, rounding
  // down to the nearest integer for performance reasons.
  const fontSize = Math.floor(cellSize / 16.25)

  let maxItemTitleWidth = 0
  let titles: TitleMap = {}
  if (chart.showTitles) {
    titles = buildTitles(chart)
    maxItemTitleWidth = getMaxTitleWidth(chart, titles, ctx, fontSize)
  }

  const chartTitleMargin = chart.title === '' ? 0 : 60

  const pixelDimensions = {
    // room for each cell + gap between cells + margins
    x: (chart.size.x * (cellSize + gap)) + gap + maxItemTitleWidth,
    y: (chart.size.y * (cellSize + gap)) + gap + chartTitleMargin,
  }

  canvas.width = pixelDimensions.x
  canvas.height = pixelDimensions.y

  return {
    width: pixelDimensions.x,
    height: pixelDimensions.y,
    cellSize,
    chartTitleMargin,
    maxItemTitleWidth,
    titles,
    ctx,
    fontSize,
  }
}

export function drawBackground(canvasInfo: CanvasInfo, chart: Chart): void {
  const ctx = canvasInfo.ctx

  if (chart.backgroundType === BackgroundTypes.Color) {
    ctx.beginPath()
    ctx.fillStyle = chart.backgroundColor
    ctx.fillRect(0, 0, canvasInfo.width, canvasInfo.height)
  }
  else {
    if (chart.backgroundImg?.complete) {
      const imageRatio = chart.backgroundImg.height / chart.backgroundImg.width
      const canvasRatio = canvasInfo.height / canvasInfo.width

      if (imageRatio > canvasRatio) {
        const height = canvasInfo.width * imageRatio
        ctx.drawImage(
          chart.backgroundImg,
          0,
          Math.floor((canvasInfo.height - height) / 2),
          canvasInfo.width,
          height,
        )
      }
      else {
        const width = canvasInfo.width * canvasRatio / imageRatio
        ctx.drawImage(
          chart.backgroundImg,
          Math.floor((canvasInfo.width - width) / 2),
          0,
          width,
          canvasInfo.height,
        )
      }
    }
  }
}

export function drawTitle(canvasInfo: CanvasInfo, chart: Chart): void {
  const ctx = canvasInfo.ctx
  ctx.font = `38pt ${chart.font ? chart.font : 'monospace'}`
  if (chart.textColor && /^#[0-9A-F]{6}$/i.test(chart.textColor)) {
    ctx.fillStyle = chart.textColor
  }
  else {
    ctx.fillStyle = 'white'
  }
  ctx.textAlign = 'center'

  ctx.lineWidth = 0.2
  ctx.strokeStyle = 'black'
  ctx.fillText(chart.title, canvasInfo.width / 2, ((chart.gap + 90) / 2))
  ctx.strokeText(chart.title, canvasInfo.width / 2, ((chart.gap + 90) / 2))
}

export function insertCoverImages(chart: Chart, canvasInfo: CanvasInfo): void {
  chart.items.forEach((item: ChartItem | null, index: number) => {
    if (!item) {
      return null
    }

    // Don't overflow outside the bounds of the chart
    // This way, items will be saved if the chart is too big for them
    // and the user can just expand the chart and they'll fill in again
    if (index + 1 > chart.size.x * chart.size.y) {
      return null
    }

    const coords = {
      x: (index % chart.size.x),
      y: Math.floor(index / chart.size.x),
    }

    drawCover(
      item.coverImg,
      coords,
      chart.gap,
      canvasInfo,
    )
  })
}
