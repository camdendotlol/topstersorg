import queryBooks from '../api/books'
import queryGames from '../api/games'
import queryMovies from '../api/movies'
import queryMusic from '../api/music'
import queryTV from '../api/tv'

export const queryMethodMap = {
  music: queryMusic,
  games: queryGames,
  books: queryBooks,
  movies: queryMovies,
  shows: queryTV,
}
