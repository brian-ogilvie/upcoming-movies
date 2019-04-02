const db = require('../models')
const {Genre, Movie, Update} = db

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
      Update.create({model: 'genres'})
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
      Update.create({model: 'movies'})
    } catch (e) {
      errorHandler(e)
    }
  },
  
  async haveRecentCache(model, daysAgo) {
    const mostRecentUpdate = await Update.findOne({
      where: {model},
      order: [['id', 'DESC']],
      raw: true
    })
    if (!mostRecentUpdate || (new Date() - mostRecentUpdate.createdAt > 1000*60*60*24*daysAgo)) {
      console.log('either no recent update, or not recent enough.')
      return false
    }
    return true
  }
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