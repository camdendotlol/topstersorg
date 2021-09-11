export interface ChartItem {
  title: string,
  coverURL: string
}

export interface BookItem extends ChartItem {
  author: string,
}

export interface AlbumItem extends ChartItem {
  artist: string,
}

export interface MovieItem extends ChartItem {
  director: string,
}

interface ChartSize {
  x: number,
  y: number
}

export type ChartContent = Array<BookItem | AlbumItem | MovieItem>

export interface Chart {
  title: string,
  items: ChartContent,
  size: ChartSize
}
