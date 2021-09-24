import { ChartItem } from '@/types'

const generateChart = (
  canvas: HTMLCanvasElement,
  title: string,
  items: ChartItem[],
  chartSize: { x: number, y: number },
  color: string,
  showTitles: boolean
): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Missing canvas context.')
  }

  const getMaxTitleWidth = (ctx: CanvasRenderingContext2D) => {
    ctx.font = '19pt monospace'
    let maxTitleWidth = 0

    if (showTitles) {
      for (let x = 0; x < items.length; x++) {
        const item = items[x]
        const name = item.creator ? `${item.creator} - ${item.title}` : item.title
        if (maxTitleWidth < ctx.measureText(name).width) {
          maxTitleWidth = ctx.measureText(name).width + 50
        }
      }
    }

    return maxTitleWidth
  }

  const maxTitleWidth = getMaxTitleWidth(ctx)

  const topMargin = title === '' ? 100 : 180

  const pixelDimensions = {
    // room for each cell + 10px gap between cells + margins
    x: (chartSize.x * 270) + 100 + maxTitleWidth,
    y: (chartSize.y * 270) + topMargin
  }

  canvas.width = pixelDimensions.x
  canvas.height = pixelDimensions.y

  if (!ctx) {
    throw new Error('Canvas ctx not found')
  }

  ctx.beginPath()
  ctx.fillStyle = color
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = 'bold 46pt monospace'
  ctx.fillStyle = '#e9e9e9'
  ctx.textAlign = 'center'
  ctx.fillText(title, canvas.width / 2, 70)

  ctx.fillStyle = ('#e9e9e9')

  // height/width of each square cell
  const cellSize = 260

  // gap between cells (pixels)
  const gap = 10
  insertCoverImages(canvas, items, cellSize, chartSize, gap, maxTitleWidth, showTitles)

  return canvas
}

const insertCoverImages = (
  canvas: HTMLCanvasElement,
  items: ChartItem[],
  cellSize: number,
  dimensions: { x: number, y: number },
  gap: number,
  maxTitleWidth: number,
  showTitles: boolean
) => {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas ctx not found')
  }

  const getScaledDimensions = (img: HTMLImageElement) => {
    let differencePercentage = 1

    if (img.width > cellSize && img.height > cellSize) {
      differencePercentage = Math.min((cellSize / img.width), (cellSize / img.height))
    } else if (img.width > cellSize) {
      differencePercentage = cellSize / img.width
    } else if (img.height > cellSize) {
      differencePercentage = cellSize / img.height
    } else if (img.width < cellSize && img.height < cellSize) {
      differencePercentage = Math.min((cellSize / img.width), (cellSize / img.height))
    }

    return {
      height: Math.floor(img.height * differencePercentage),
      width: Math.floor(img.width * differencePercentage)
    }
  }

  const findCenteringOffset = (dimension: number) => {
    if (dimension < cellSize) {
      return Math.floor((cellSize - dimension) / 2)
    } else {
      return 0
    }
  }

  const insertImage = (item: ChartItem, coords: { x: number, y: number }) => {
    const dimensions = getScaledDimensions(item.coverImg)

    ctx.drawImage(
      item.coverImg,
      ((coords.x * cellSize) + 55 + (coords.x * gap)) + findCenteringOffset(dimensions.width),
      ((coords.y * cellSize) + 100 + (coords.y * gap)) + findCenteringOffset(dimensions.height),
      dimensions.width,
      dimensions.height
    )
  }

  const insertTitle = (item: ChartItem, index: number, coords: { x: number, y: number }, maxWidth: number) => {
    const titleString = item.creator ? `${item.creator} - ${item.title}` : item.title
    ctx.fillText(
      titleString,
      canvas.width - maxWidth,
      (35 * index) + 130 + ((coords.y % (index + 1)) * 50)
    )
  }

  items.forEach((item: ChartItem, index: number) => {
    // Don't overflow outside the bounds of the chart
    // This way, items will be saved if the chart is too big for them
    // and the user can just expand the chart and they'll fill in again
    if (index + 1 > dimensions.x * dimensions.y) {
      return null
    }

    const coords = {
      x: index % dimensions.x,
      y: Math.floor(index / dimensions.x)
    }

    insertImage(item, coords)
    if (showTitles) {
      ctx.font = '1.6rem monospace'
      ctx.textAlign = 'left'
      insertTitle(item, index, coords, maxTitleWidth)
    }
  })
}

export default generateChart
