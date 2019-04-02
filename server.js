require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const PORT = process.env.EXPRESS_PORT

const TMDB = require('./TMDB')
const db = require('./models')
const {Genre, Movie} = db

const app = new express()
app.use(morgan('dev'))
app.use(bodyParser.json())

//check for movies in cache
app.get('/movies', async (req, res, next) => {
  try {
    const cachedMovies = await Movie.findAll({
      attributes: {
        exclude: ['created_at', 'updated_at']
      }
    })
    if (cachedMovies.length) {
      console.log('sending cached movies')
      return res.json({movies: cachedMovies})
    }
    next()
  } catch (e) {
    errorHandler(res, e)
  }
})

// fallback query API for movies
app.get('/movies', async (req, res) => {
  console.log('querying TMDB for movies')
  try {
    const page = req.query.page || null
    const {movies, error} = await TMDB.getMovies(page)
    if (error) {
      throw error
    }
    const smallMovies = await optimizeMovies(movies)
    cacheMovies(smallMovies)
    res.json({movies: smallMovies})
  } catch (e) {
    errorHandler(res, e)
  }
})

// check for cached genres
app.get('/genres', async (req, res, next) => {
  try {
    const cachedGenres = await Genre.findAll({attributes: ['id', 'name']})
    if (cachedGenres.length) {
      return res.json({genres: cachedGenres})
    }
    next()
  } catch (e) {
    errorHandler(res, e)
  }
})

// fallback query API for genres
app.get('/genres', async (req, res) => {
  try {
    const {genres, error} = await TMDB.getGenres()
    if (error) {
      throw error
    }
    cacheGenres(genres)
    res.json({genres})
  } catch (e) {
    errorHandler(res, e)
  }
})

app.listen(PORT, () => {
  console.log('☎️  Express server is listening on port', PORT)
})

const errorHandler = (res, e) => {
  const error = e.message || e
  res.json({error})
}

async function cacheGenres(genres) {
  await Genre.truncate({restartIdentity: true})
  genresToInsert = genres.map(genre => {
    return {
      ...genre,
      ...createTimestamps()
    }
  })
  await Genre.bulkCreate(genresToInsert)
}

async function optimizeMovies(movies) {
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
}

async function cacheMovies(movies) {
  const dbMovies = movies.map(movie => {
    return {
      ...movie,
      ...createTimestamps()
    }
  })
  await Movie.bulkCreate(dbMovies)
}

function createTimestamps() {
  const now = new Date()
  return {
    created_at: now,
    updated_at: now
  }
}
