export interface ChartItem {
  title: string,
  creator?: string,
  coverImg: HTMLImageElement,
  coverURL: string
}

export interface ChartSize {
  x: number,
  y: number
}

export interface Chart {
  title: string,
  items: ChartItem[],
  size: ChartSize,
  color: string,
  showTitles: boolean,
  gap: number
}

export interface IgdbItem {
  name: string,
  cover: string
}

export interface SavedChart {
  name?: string,
  data: Chart,
  currentlyActive: boolean
}
