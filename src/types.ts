export interface ChartItem {
  title: string,
  creator: string,
  coverImg: HTMLImageElement
}

export interface ChartSize {
  x: number,
  y: number
}

export interface Chart {
  title: string,
  items: ChartItem[],
  size: ChartSize,
  color: string
}

export interface IgdbItem {
  name: string,
  cover: string
}
