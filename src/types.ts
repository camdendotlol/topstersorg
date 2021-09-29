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
  showTitles: boolean
}

export interface IgdbItem {
  name: string,
  cover: string
}

export interface BrowserStore {
  activeTab: 'music' | 'books' | 'games',
  charts: {
    name?: string,
    chart: Chart[],
    currentlyActive: boolean
  }[]
}
