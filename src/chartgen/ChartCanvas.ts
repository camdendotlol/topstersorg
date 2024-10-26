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

  indexedItemCoords: Array<{ x: [number, number], y: [number, number], placeholder?: boolean }>

  newItemCoords: { x: Set<number>, y: Set<number> }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.cellSize = ITEM_SIZE
    this.ctx = this.canvas.getContext('2d', { alpha: false })
    this.indexedItemCoords = Array.from({ length: 144 })
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

    if (this.data.showTitles && this.data.titlePosition === 'right') {
      this.titleMap = this.buildTitles()
      maxItemTitleWidth = this.getMaxTitleWidth(fontSize)
    }

    const chartTitleMargin = this.data.title === '' ? 0 : 60

    // assuming 15px margins above and below the text
    const itemTitleHeight = this.data.titlePosition === 'below' ? (fontSize * 2 + 30) : 0

    // leave a margin if we're displaying titles below each item
    const totalItemTitleHeight = (this.data.size.y * itemTitleHeight)

    const itemDimensions = this.data.items.slice(0, this.data.size.x * this.data.size.y).map((item, idx) => {
      if (item) {
        if (this.data.layout === 'tiered') {
          const cellSize = this.getTieredCellSizeByIndex(idx)
          return getScaledDimensions(item.coverImg, cellSize)
        }
        else {
          return getScaledDimensions(item.coverImg, this.cellSize)
        }
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

    if (this.data.layout === 'grid') {
      this.insertGridCoverImages()
    }
    else if (this.data.layout === 'tiered') {
      this.insertTieredCoverImages()
    }

    if (this.data.showTitles) {
      if (this.data.titlePosition === 'right') {
        this.insertTitlesRight()
      }
      else if (this.data.titlePosition === 'below') {
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

  // get the coords for a valid space to drop an item when no item is present
  getPlaceholderCoords(coords: { x: number, y: number }): { x: [number, number], y: [number, number] } {
    const itemTitleGap = this.canvasInfo.itemTitleHeight * coords.y

    const xCoord = (coords.x * (this.cellSize + this.data.gap)) + this.data.gap
    const yCoord = (coords.y * (this.cellSize + this.data.gap)) + this.data.gap + this.canvasInfo.chartTitleMargin + itemTitleGap

    return {
      x: [xCoord, xCoord + this.cellSize],
      y: [yCoord, yCoord + this.cellSize],
    }
  }

  drawCover(cover: HTMLImageElement, gridCoords: { x: number, y: number }, idx: number) {
    const dimensions = this.itemDimensions[idx]

    const pixelCoords = this.data.layout === 'grid'
      ? this.getGridPixelCoordsByIndex(gridCoords, idx)
      : this.getTieredPixelCoordsByIndex(idx)

    this.ctx.drawImage(
      cover,
      pixelCoords.x,
      pixelCoords.y,
      dimensions.width,
      dimensions.height,
    )

    return {
      x: [pixelCoords.x, pixelCoords.x + dimensions.width],
      y: [pixelCoords.y, pixelCoords.y + dimensions.height],
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

  insertGridCoverImages() {
    this.data.items.forEach((item: ChartItem | null, index: number) => {
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

      if (item) {
        const pixelCoords = this.drawCover(
          item.coverImg,
          coords,
          this.itemDimensions[index],
        )
        this.indexedItemCoords[index] = {
          x: [...pixelCoords.x],
          y: [...pixelCoords.y],
        }
      }
      else {
        const placeholderCoords = this.getPlaceholderCoords(coords)
        this.indexedItemCoords[index] = {
          ...placeholderCoords,
          placeholder: true,
        }
      }
    })
  }

  insertTieredCoverImages() {
    this.data.items.forEach((item: ChartItem | null, index: number) => {
      // avoid rendering items that are out of bounds
      const maxIdx = this.data.tieredSize === 'medium'
        ? 42
        : 100

      if (index + 1 > maxIdx) {
        return null
      }

      const coords = this.getTieredGridCoordsByIndex(index)

      if (item) {
        const pixelCoords = this.drawCover(
          item.coverImg,
          coords,
          this.itemDimensions[index],
        )
        this.indexedItemCoords[index] = {
          x: [...pixelCoords.x],
          y: [...pixelCoords.y],
        }
      }
      else {
        const placeholderCoords = this.getPlaceholderCoords(coords)
        this.indexedItemCoords[index] = {
          ...placeholderCoords,
          placeholder: true,
        }
      }
    })
  }

  // should be a replacement for isDroppable
  public getIndexByLocation(coords: { x: number, y: number }) {
    const scaleRatio = this.canvas.clientHeight / this.canvas.height

    // convert the scaled pixel values back to unscaled
    const unscaledX = Math.floor(coords.x / scaleRatio)
    const unscaledY = Math.floor(coords.y / scaleRatio)

    const itemsInScope = this.indexedItemCoords.slice(0, this.data.size.x * this.data.size.y)

    return itemsInScope.findIndex(coords => unscaledX >= coords.x[0] && unscaledX <= coords.x[1] && unscaledY >= coords.y[0] && unscaledY <= coords.y[1])
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

  // WIP
  getTieredPixelCoordsByIndex(idx: number) {
    const dimensions = this.itemDimensions[idx]
    const tieredCellSize = this.getTieredCellSizeByIndex(idx)

    const baseX = this.data.gap + this.findCenteringOffset(dimensions.width, tieredCellSize)
    const baseY = this.data.gap + this.findCenteringOffset(dimensions.height, tieredCellSize)

    if (this.data.tieredSize === 'large') {
      if (idx > 58) {
        // return (idx % )
      }
    }
  }

  getGridPixelCoordsByIndex(coords: { x: number, y: number }, idx: number) {
    const itemTitleGap = this.canvasInfo.itemTitleHeight * coords.y
    const dimensions = this.itemDimensions[idx]

    const xCoord = (coords.x * (this.cellSize + this.data.gap)) + this.data.gap + this.findCenteringOffset(dimensions.width, this.cellSize)
    const yCoord = (coords.y * (this.cellSize + this.data.gap)) + this.data.gap + this.findCenteringOffset(dimensions.height, this.cellSize) + this.canvasInfo.chartTitleMargin + itemTitleGap

    return {
      x: xCoord,
      y: yCoord,
    }
  }

  // gets the coords within the current section
  getTieredGridCoordsByIndex(idx: number) {
    if (this.data.tieredSize === 'large') {
      if (idx > 58) {
        const diff = idx - 58
        return {
          x: (diff % 14),
          y: Math.floor(diff / 14),
        }
      }
      else if (idx > 28) {
        const diff = idx - 28
        return {
          x: (diff % 10),
          y: Math.floor(diff / 10),
        }
      }
      else if (idx > 10) {
        const diff = idx - 10
        return {
          x: (diff % 6),
          y: Math.floor(diff / 6),
        }
      }
      else {
        return {
          x: idx % 5,
          y: Math.floor(idx / 5),
        }
      }
    }
    else if (this.data.tieredSize === 'medium') {
      if (idx > 22) {
        const diff = idx - 22
        return {
          x: (diff % 10),
          y: Math.floor(diff / 10),
        }
      }
      else if (idx > 10) {
        const diff = idx - 10
        return {
          x: (diff % 6),
          y: Math.floor(diff / 6),
        }
      }
      else {
        return {
          x: (idx % 5),
          y: Math.floor(idx / 5),
        }
      }
    }
  }

  getTieredCellSizeByIndex(idx: number) {
    if (this.data.tieredSize === 'large') {
      if (idx > 58) {
        return this.cellSize / 4
      }
      else if (idx > 28) {
        return this.cellSize / 2
      }
      else if (idx > 10) {
        return this.cellSize
      }
      else {
        return this.cellSize * 2
      }
    }
    else {
      if (this.data.tieredSize === 'medium') {
        if (idx > 22) {
          return this.cellSize / 2
        }
        else if (idx > 10) {
          return this.cellSize
        }
        else {
          return this.cellSize * 2
        }
      }
    }
  }
}

export default Chart
