interface ChartItem {
  title: string,
  coverURL: string
}

interface BookItem extends ChartItem {
  author: string,
}

interface AlbumItem extends ChartItem {
  artist: string,
}

interface MovieItem extends ChartItem {
  director: string,
}

interface ChartSize {
  x: number,
  y: number
}

export interface Chart {
  title: string,
  items: Array<BookItem | AlbumItem | MovieItem>,
  size: ChartSize
}
