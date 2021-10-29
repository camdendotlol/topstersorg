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
  items: Array<ChartItem | null>,
  size: ChartSize,
  color: string,
  showTitles: boolean,
  gap: number
}

export interface IgdbItem {
  name: string,
  cover: string
}

// Charts stored in localStorage
export interface StoredChart {
  timestamp: number,
  name: string | null,
  data: Chart,
  currentlyActive: boolean
}
