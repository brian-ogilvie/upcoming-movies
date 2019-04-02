const db = require('../models')
const {Genre, Movie} = db

const movieHelpers = {
  async cacheGenres(genres) {
    try {
      await Genre.truncate({restartIdentity: true})
      const genresToInsert = genres.map(genre => {
        return {
          ...genre,
          ...createTimestamps()
        }
      })
      await Genre.bulkCreate(genresToInsert)
    } catch (e) {
      errorHandler(e)
    }
  },
  
  async optimizeMovies(movies) {
    try {
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
    } catch (e) {
      throw e
    }
  },
  
  async cacheMovies(movies) {
    try {
      const dbMovies = movies.map(movie => {
        return {
          ...movie,
          ...createTimestamps()
        }
      })
      await Movie.bulkCreate(dbMovies)
    } catch (e) {
      errorHandler(e)
    }
  },
}

function createTimestamps() {
  const now = new Date()
  return {
    created_at: now,
    updated_at: now
  }
}

function errorHandler(e) {
  console.log('❗️❗️', e.message)
}

module.exports = movieHelpers