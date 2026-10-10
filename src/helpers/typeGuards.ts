import type { BookResult, CustomResult, Result, SearchResult, SearchTypes } from '../types'

export function isBookResult(item: Result): item is BookResult {
  if ((item as BookResult).cover_edition_key) {
    return true
  }
  else {
    return false
  }
}

export function isSearchResult(item: Result): item is SearchResult {
  if ((item as SearchResult).name && (item as SearchResult).cover) {
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
