export interface ChartItem {
  title: string,
  creator: string,
  coverImg: HTMLImageElement
}

export interface ChartSize {
  x: number,
  y: number
}

export type ChartContent = ChartItem[]

export interface Chart {
  title: string,
  items: ChartContent,
  size: ChartSize,
  color: string
}

export interface IgdbItem {
  name: string,
  cover: string
}
