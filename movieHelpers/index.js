const db = require('../models')
const {Genre, Movie} = db

const movieHelpers = {
  async cacheGenres(genres) {
    await Genre.truncate({restartIdentity: true})
    genresToInsert = genres.map(genre => {
      return {
        ...genre,
        ...createTimestamps()
      }
    })
    await Genre.bulkCreate(genresToInsert)
  },
  
  async optimizeMovies(movies) {
    const genres = await Genre.findAll({attributes: ['id','name'], raw: true})
    return movies.map(movie => {
      const theseGenres = movie.genre_ids.map(id => {
        const genreObj = genres.find(genre => {
          return genre.id === id
        })
        return genreObj ? genreObj.name : 'unknown'
      })
      return {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        genres: theseGenres,
        overview: movie.overview,
        release_date: movie.release_date,
      }
    })
  },
  
  async cacheMovies(movies) {
    const dbMovies = movies.map(movie => {
      return {
        ...movie,
        ...createTimestamps()
      }
    })
    await Movie.bulkCreate(dbMovies)
  },
}

function createTimestamps() {
  const now = new Date()
  return {
    created_at: now,
    updated_at: now
  }
}

module.exports = movieHelpers