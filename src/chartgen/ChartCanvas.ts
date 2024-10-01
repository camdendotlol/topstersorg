import { getScaledDimensions } from '../helpers/chart'
import { BackgroundTypes, type ChartItem, type Chart as ChartType } from '../types'

const ITEM_SIZE = 260

export interface CanvasInfo {
  width: number
  height: number
  chartTitleMargin: number
  maxItemTitleWidth: number
  fontSize: number
  itemTitleHeight: number
}

class Chart {
  data: ChartType
  canvas: HTMLCanvasElement
  canvasInfo: CanvasInfo
  cellSize: number
  ctx: CanvasRenderingContext2D
  itemDimensions: { height: number, width: number }[]
  titleMap: { [key: number]: string }

  itemCoords: { x: [number, number][], y: [number, number][] }

  newItemCoords: { x: Set<number>, y: Set<number> }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.cellSize = ITEM_SIZE
    this.ctx = this.canvas.getContext('2d', { alpha: false })
    this.itemCoords = { x: [], y: [] }
    this.newItemCoords = { x: new Set(), y: new Set() }
  }

  public getScaledCanvasInfo() {
    // The ratio by which the Canvas is scaled down in the browser
    const scaleRatio = this.canvas.clientHeight / this.canvas.height

    return {
      scaleRatio,
      scaledGap: this.data.gap * scaleRatio,
      scaledTitleHeight: this.canvasInfo.chartTitleMargin * scaleRatio,
      scaledItemSize: this.cellSize * scaleRatio,
      scaledPixelDimensions: {
        x: this.canvas.width * scaleRatio,
        y: this.canvas.height * scaleRatio,
      },
      scaledItemTitleHeight: this.canvasInfo.itemTitleHeight * scaleRatio,
    }
  }

  // Just calculates some data and sets the size of the chart
  setup() {
    // The original default was 16pt font size with 260px cells.
    // 260/16.25 is 16, so we divide by 16.25 to preserve the
    // font size ratio for user-configured cell sizes, rounding
    // down to the nearest integer for performance reasons.
    const fontSize = Math.floor(this.cellSize / 16.25)

    let maxItemTitleWidth = 0

    if (this.data.showTitles && this.data.layout === 'grid') {
      this.titleMap = this.buildTitles()
      maxItemTitleWidth = this.getMaxTitleWidth(fontSize)
    }

    const chartTitleMargin = this.data.title === '' ? 0 : 60

    // assuming 15px margins above and below the text
    const itemTitleHeight = this.data.layout === 'classic' ? (fontSize * 2 + 30) : 0

    // leave a margin if we're displaying titles below each item
    const totalItemTitleHeight = (this.data.size.y * itemTitleHeight)

    const itemDimensions = this.data.items.slice(0, this.data.size.x * this.data.size.y).map((item) => {
      if (item) {
        return getScaledDimensions(item.coverImg, this.cellSize)
      }

      return null
    })

    this.itemDimensions = itemDimensions

    const pixelDimensions = {
      // room for each cell + gap between cells + margins
      x: (this.data.size.x * (this.cellSize + this.data.gap)) + this.data.gap + maxItemTitleWidth,
      y: (this.data.size.y * (this.cellSize + this.data.gap)) + this.data.gap + chartTitleMargin + totalItemTitleHeight,
    }

    this.canvas.width = pixelDimensions.x
    this.canvas.height = pixelDimensions.y

    this.canvasInfo = {
      width: pixelDimensions.x,
      height: pixelDimensions.y,
      chartTitleMargin,
      maxItemTitleWidth,
      fontSize,
      itemTitleHeight,
    }
  }

  generateChart(data: ChartType) {
    this.data = data

    this.setup()

    this.drawBackground()

    if (this.data.shadows) {
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.shadowBlur = 4
      this.ctx.shadowColor = 'rgba(0,0,0,0.6)'
    }

    if (this.data.textColor && /^#[0-9A-F]{6}$/i.test(this.data.textColor)) {
      this.ctx.fillStyle = this.data.textColor
    }
    else {
      this.ctx.fillStyle = 'white'
    }

    // Draw the title at the top
    if (this.data.title !== '') {
      this.drawTitle()
    }

    this.insertCoverImages()

    if (this.data.showTitles) {
      if (this.data.layout === 'grid') {
        this.insertTitlesRight()
      }
      else if (this.data.layout === 'classic') {
        this.insertTitlesBelow()
      }
    }
  }

  buildTitles() {
    const titles = {}

    const itemsInScope = this.data.items.slice(0, this.data.size.x * this.data.size.y)
    let count = 0

    itemsInScope.forEach((item, index) => {
      if (item) {
        count += 1
        let titleString = item.title

        if (item.creator) {
          titleString = `${item.creator} - ${titleString}`
        }

        if (this.data.showNumbers) {
          titleString = `${count}. ${titleString}`
        }

        titles[index] = titleString
      }
    })

    return titles
  }

  drawBackground(): void {
    const ctx = this.ctx

    if (this.data.background.type === BackgroundTypes.Color) {
      ctx.beginPath()
      ctx.fillStyle = this.data.background.value
      ctx.fillRect(0, 0, this.canvasInfo.width, this.canvasInfo.height)
    }
    else {
      if (this.data.background.img?.complete) {
        const imageRatio = this.data.background.img.height / this.data.background.img.width
        const canvasRatio = this.canvasInfo.height / this.canvasInfo.width

        if (imageRatio > canvasRatio) {
          const height = this.canvasInfo.width * imageRatio
          ctx.drawImage(
            this.data.background.img,
            0,
            Math.floor((this.canvasInfo.height - height) / 2),
            this.canvasInfo.width,
            height,
          )
        }
        else {
          const width = this.canvasInfo.width * canvasRatio / imageRatio
          ctx.drawImage(
            this.data.background.img,
            Math.floor((this.canvasInfo.width - width) / 2),
            0,
            width,
            this.canvasInfo.height,
          )
        }
      }
    }
  }

  drawCover(cover: HTMLImageElement, coords: { x: number, y: number }, dimensions: {
    height: number
    width: number
  }): { x: [number, number], y: [number, number] } {
    const itemTitleGap = this.canvasInfo.itemTitleHeight * coords.y

    const xCoord = (coords.x * (this.cellSize + this.data.gap)) + this.data.gap + this.findCenteringOffset(dimensions.width, this.cellSize)
    const yCoord = (coords.y * (this.cellSize + this.data.gap)) + this.data.gap + this.findCenteringOffset(dimensions.height, this.cellSize) + this.canvasInfo.chartTitleMargin + itemTitleGap

    this.ctx.drawImage(
      cover,
      xCoord,
      yCoord,
      dimensions.width,
      dimensions.height,
    )

    return {
      x: [xCoord, xCoord + dimensions.width],
      y: [yCoord, yCoord + dimensions.height],
    }
  }

  drawTitle() {
    const ctx = this.ctx
    ctx.font = `38px ${this.data.font ? this.data.font : 'monospace'}`
    if (this.data.textColor && /^#[0-9A-F]{6}$/i.test(this.data.textColor)) {
      ctx.fillStyle = this.data.textColor
    }
    else {
      ctx.fillStyle = 'white'
    }
    ctx.textAlign = 'center'

    ctx.lineWidth = 0.2
    ctx.strokeStyle = 'black'
    ctx.fillText(this.data.title, this.canvasInfo.width / 2, ((this.data.gap + 90) / 2))
    ctx.strokeText(this.data.title, this.canvasInfo.width / 2, ((this.data.gap + 90) / 2))
  }

  // Finds how many pixels the horizontal and/or vertical margin should be
  // in order to center the cover within its cell.
  findCenteringOffset(dimension: number, maxPixels: number) {
    if (dimension < maxPixels) {
      return Math.floor((maxPixels - dimension) / 2)
    }
    else {
      return 0
    }
  }

  // The sidebar containing the titles of chart items should only be as
  // wide as the longest title, plus a little bit of margin.
  getMaxTitleWidth(fontSize: number): number {
    let maxTitleWidth = 0
    this.ctx.font = `${fontSize}px ${this.data.font ? this.data.font : 'monospace'}`
    if (this.data.textColor && /^#[0-9A-F]{6}$/i.test(this.data.textColor)) {
      this.ctx.fillStyle = this.data.textColor
    }
    else {
      this.ctx.fillStyle = 'white'
    }

    Object.keys(this.titleMap).forEach((key) => {
      const width = this.ctx.measureText(this.titleMap[Number.parseInt(key)]).width
      if (width > maxTitleWidth) {
        maxTitleWidth = width
      }
    })

    // A minimum margin of 20px keeps titles from being right up against the sides.
    return maxTitleWidth + 20 + this.data.gap
  }

  insertCoverImages() {
    this.itemCoords = { x: [], y: [] }
    const newCoords = { x: [], y: [] }

    this.data.items.forEach((item: ChartItem | null, index: number) => {
      if (!item) {
        return null
      }

      // Don't overflow outside the bounds of the chart
      // This way, items will be saved if the chart is too big for them
      // and the user can just expand the chart and they'll fill in again
      if (index + 1 > this.data.size.x * this.data.size.y) {
        return null
      }

      const coords = {
        x: (index % this.data.size.x),
        y: Math.floor(index / this.data.size.x),
      }

      const pixelCoords = this.drawCover(
        item.coverImg,
        coords,
        this.itemDimensions[index],
      )

      newCoords.x.push(pixelCoords.x[0])
      newCoords.x.push(pixelCoords.x[1])
      newCoords.y.push(pixelCoords.y[0])
      newCoords.y.push(pixelCoords.y[1])

      this.itemCoords.x.push(pixelCoords.x)
      this.itemCoords.y.push(pixelCoords.y)
    })

    this.newItemCoords.x = new Set(newCoords.x.sort())
    this.newItemCoords.y = new Set(newCoords.y.sort())
  }

  // should be a replacement for isDroppable
  public isItemLocation(coords: { x: number, y: number }) {
    const scaleRatio = this.canvas.clientHeight / this.canvas.height

    // convert the scaled pixel values back to unscaled
    const unscaledX = Math.floor(coords.x / scaleRatio)
    const unscaledY = Math.floor(coords.y / scaleRatio)

    const xFound = !!this.itemCoords.x.find(xc => unscaledX >= xc[0] && unscaledX <= xc[1])
    const yFound = !!this.itemCoords.y.find(yc => unscaledY >= yc[0] && unscaledY <= yc[1])

    return xFound && yFound
  }

  insertTitlesBelow() {
    const itemsInScope = this.data.items.slice(0, this.data.size.x * this.data.size.y)

    this.ctx.textAlign = 'center'
    this.ctx.lineWidth = 0.3
    this.ctx.strokeStyle = 'black'

    const maxTitleLength = Math.floor((this.cellSize + this.data.gap) / (this.canvasInfo.fontSize / 1.4))

    itemsInScope.forEach((item, index) => {
      if (!item) {
        return null
      }

      const column = index % this.data.size.x
      const row = Math.floor(index / this.data.size.x)

      const xCoord = (this.cellSize * column) + (this.data.gap * column + this.data.gap) + (this.cellSize / 2)
      const yCoord = this.canvasInfo.chartTitleMargin + ((row + 1) * (this.cellSize + this.data.gap)) + (row * this.canvasInfo.itemTitleHeight + (this.canvasInfo.itemTitleHeight / 2) - 7)

      const truncatedTitle = this.truncateText(item.title, maxTitleLength)

      this.ctx.font = `bold ${this.canvasInfo.fontSize}px ${this.data.font ? this.data.font : 'monospace'}`

      this.ctx.strokeText(
        truncatedTitle,
        xCoord,
        yCoord,
      )

      this.ctx.fillText(
        truncatedTitle,
        xCoord,
        yCoord,
      )

      if (item.creator) {
        this.ctx.font = `lighter ${this.canvasInfo.fontSize}px ${this.data.font ? this.data.font : 'monospace'}`

        const truncatedCreator = this.truncateText(item.creator, maxTitleLength)

        this.ctx.strokeText(
          truncatedCreator,
          xCoord,
          yCoord + 10 + this.canvasInfo.fontSize,
        )

        this.ctx.fillText(
          truncatedCreator,
          xCoord,
          yCoord + 10 + this.canvasInfo.fontSize,
        )
      }
    })
  }

  insertTitlesRight(): void {
    const itemsInScope = this.data.items.slice(0, this.data.size.x * this.data.size.y)

    this.ctx.font = `${this.canvasInfo.fontSize}px ${this.data.font ? this.data.font : 'monospace'}`
    this.ctx.textAlign = 'left'
    this.ctx.lineWidth = 0.3
    this.ctx.strokeStyle = 'black'

    // Track where to start a new row
    let currentCellHeight = this.canvasInfo.chartTitleMargin + this.data.gap + this.canvasInfo.fontSize

    // Track where to start a new title within each row
    let currentHeight = this.canvasInfo.chartTitleMargin + this.data.gap + this.canvasInfo.fontSize

    // How much vertical space to put between titles.
    // 1.5-spacing seems fine until the chart hits around
    // 11 items wide, then we use a different method to
    // squish them in.
    const verticalMargin = this.data.size.x < 11
      ? this.canvasInfo.fontSize * 1.5
      : Math.floor(this.cellSize / this.data.size.x)

    itemsInScope.forEach((item, index) => {
      // Keep an extra margin between each row
      if (index !== 0) {
        if (index % this.data.size.x === 0) {
          currentCellHeight = currentCellHeight + this.cellSize + this.data.gap
          currentHeight = currentCellHeight
        }
        else {
          currentHeight = currentHeight + verticalMargin
        }
      }

      if (!item) {
        return null
      }

      const titleString = this.titleMap[index]

      this.ctx.strokeText(
        titleString,
        this.canvasInfo.width - this.canvasInfo.maxItemTitleWidth + 10 - Math.floor(this.data.gap / 2),
        currentHeight,
      )

      this.ctx.fillText(
        titleString,
        this.canvasInfo.width - this.canvasInfo.maxItemTitleWidth + 10 - Math.floor(this.data.gap / 2),
        currentHeight,
      )
    })
  }

  truncateText(txt: string, maxLength: number) {
    return txt.length > (maxLength + 3) ? `${txt.slice(0, maxLength).trim()}...` : txt
  }
}

export default Chart
