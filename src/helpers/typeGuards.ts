import { BookResult, GameResult, MusicResult, Result } from '@/types'

export const isBookResult = (item: Result): item is BookResult => {
  if ((item as BookResult).cover_edition_key) {
    return true
  } else {
    return false
  }
}

export const isMusicResult = (item: Result): item is MusicResult => {
  if ((item as MusicResult).artist) {
    return true
  } else {
    return false
  }
}

export const isGameResult = (item: Result): item is GameResult => {
  if ((item as GameResult).cover) {
    return true
  } else {
    return false
  }
}
