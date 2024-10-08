import queryIGDB from '../api/igdb'
import queryLastFM from '../api/lastfm'
import queryOpenLibrary from '../api/openlibrary'
import { tmdbMovieSearch, tmdbTVSearch } from '../api/tmdb'

export const queryMethodMap = {
  music: queryLastFM,
  games: queryIGDB,
  books: queryOpenLibrary,
  movies: tmdbMovieSearch,
  shows: tmdbTVSearch,
}
