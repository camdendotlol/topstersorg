/* eslint-disable camelcase */

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

export enum BackgroundTypes {
  Color = 'color',
  Image = 'image'
}

export interface Chart {
  title: string,
  items: Array<ChartItem | null>,
  size: ChartSize,
  background: {
    type: BackgroundTypes,
    value: string,
    img: HTMLImageElement | null
  }
  showTitles: boolean,
  gap: number,
  font?: string,
  textColor?: string,
  shadows?: boolean
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

// There's way more stuff from the APIs but this is all that's relevant here.
export interface BookResult {
  title: string,
  author_name: string,
  cover_edition_key?: string
}

export interface MusicResult {
  name: string,
  artist: string,
  image: {
    '#text': string,
    size: string
  }[]
}

export interface GameResult {
  name: string,
  cover: string
}

export interface MovieResult {
  title: string,
  poster_path: string
}

export interface TVResult {
  name: string,
  poster_path: string
}

export type Result = BookResult | MusicResult | GameResult | MovieResult | TVResult
