import type { BookResult, CustomResult, GameResult, MovieResult, MusicResult, Result, SearchTypes, TVResult } from '../types'

export function isBookResult(item: Result): item is BookResult {
  if ((item as BookResult).cover_edition_key) {
    return true
  }
  else {
    return false
  }
}

export function isMusicResult(item: Result): item is MusicResult {
  if ((item as MusicResult).artist) {
    return true
  }
  else {
    return false
  }
}

export function isGameResult(item: Result): item is GameResult {
  if ((item as GameResult).cover) {
    return true
  }
  else {
    return false
  }
}

export function isMovieResult(item: Result): item is MovieResult {
  if ((item as MovieResult).title && (item as MovieResult).poster_path) {
    return true
  }
  else {
    return false
  }
}

export function isTVResult(item: Result): item is TVResult {
  if ((item as TVResult).name && (item as MovieResult).poster_path) {
    return true
  }
  else {
    return false
  }
}

export function isCustomResult(item: Result): item is CustomResult {
  if ((item as CustomResult).type === 'custom') {
    return true
  }
  else {
    return false
  }
}

export function isValidSearchType(str: string): str is SearchTypes {
  return ['music', 'books', 'games', 'movies', 'shows', 'custom'].includes(str)
}
