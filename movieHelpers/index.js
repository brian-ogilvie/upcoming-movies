const db = require('../models')
const {Genre, Movie, Update} = db
const TMDB = require('../TMDB')

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

  cacheConfig(config) {
    try {
      Update.create({
        model: 'config',
        data: config,
      })
    } catch (e) {
      errorHandler(e)
    }
  },
  
  async optimizeMovies(movies) {
    try {
      const genres = await Genre.findAll({attributes: ['id','name'], raw: true})
      const config = await Update.findOne({
        where: {model: 'config'},
        attributes: ['data'],
        order: [['id', 'DESC']],
        raw: true
      })
      return movies.map(movie => {
        const theseGenres = movie.genre_ids.map(id => {
          const genreObj = genres.find(genre => {
            return genre.id === id
          })
          return genreObj ? genreObj.name : 'unknown'
        })
        const posterPaths = createPosterPaths(config.data, movie.poster_path)
        return {
          movie_id: movie.id,
          title: movie.title,
          ...posterPaths,
          genres: theseGenres,
          overview: movie.overview,
          release_date: movie.release_date,
        }
      })
    } catch (e) {
      throw e
    }
  },

  async getConfiguration() {
    const {haveRecent, data} = await movieHelpers.haveRecentCache('config', 7)
    if (haveRecent) {
      return data
    }
    const config = await TMDB.getConfiguration()
    Update.create({
      model: 'config',
      data: config,
    })
    return config
  },
  
  async cacheMovies(movies, totalPages) {
    try {
      await Movie.truncate({restartIdentity: true})
      const allMovies = [...movies]
      // retrieve all remaining upcoming moveis from TMDB
      const remainingMovies = await getRemainingPages(totalPages)
      if (remainingMovies) {
        const optimizedMovies = await movieHelpers.optimizeMovies(remainingMovies)
        allMovies.push(...optimizedMovies)
      }
      const timestamps = createTimestamps()
      const dbMovies = allMovies.map(movie => {
        return {
          ...movie,
          ...timestamps
        }
      })
      await Movie.bulkCreate(dbMovies)
      Update.create({model: 'movies'})
    } catch (e) {
      errorHandler(e)
    }
  },
  
  async haveRecentCache(model, daysAgo) {
    try {
      const mostRecentUpdate = await Update.findOne({
        where: {model},
        order: [['id', 'DESC']],
        raw: true
      })
      if (!mostRecentUpdate || (new Date() - mostRecentUpdate.createdAt > 1000*60*60*24*daysAgo)) {
        return {haveRecent: false}
      }
      return {haveRecent: true, data: mostRecentUpdate.data}
    } catch (e) {
      return {haveRecent: false, error: e.message}
    }
  }
}

function createTimestamps() {
  const now = new Date()
  return {
    created_at: now,
    updated_at: now
  }
}

async function getRemainingPages(totalPages, startPage = 2) {
  try {
    const promises = []
    for (let page = startPage; page <= totalPages; page++) {
      promises.push(TMDB.getMovies(page))
    }
    const resolved = await Promise.all(promises)
    // flatten the arrays from each promise into one array of movies
    return resolved.map(result => {
      return result.movies
    }).flat()
  } catch (e) {
    errorHandler(e)
    return null
  }
}

function createPosterPaths(config, path) {
  const {base_url, poster_sizes} = config
  const smallString = poster_sizes[0]
  const largeString = poster_sizes[poster_sizes.length - 2]
  const smallUrl = base_url + smallString + path
  const largeUrl = base_url + largeString + path
  return {
    poster_path_small: smallUrl,
    poster_path_large: largeUrl,
  }
}

function errorHandler(e) {
  // end user doesn't need to know about these errors
  console.log('❗️❗️', e.message)
}

module.exports = movieHelpers