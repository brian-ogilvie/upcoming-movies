require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const PORT = process.env.EXPRESS_PORT

const TMDB = require('./TMDB')
const db = require('./models')
const {Genre, Movie, Update} = db
const {cacheGenres, cacheMovies, optimizeMovies, haveRecentCache} = require('./movieHelpers')

const app = new express()
app.use(morgan('dev'))
app.use(bodyParser.json())

//check for movies in cache
app.get('/movies', async (req, res, next) => {
  try {
    const recent = await haveRecentCache('movies', 1)
    if (!recent) {
      return next()
    }
    const cachedMovies = await Movie.findAll({
      attributes: {
        exclude: ['created_at', 'updated_at']
      }
    })
    if (cachedMovies.length) {
      return res.json({movies: cachedMovies})
    }
    next()
  } catch (e) {
    errorHandler(res, e)
  }
})

// fallback query API for movies
app.get('/movies', async (req, res) => {
  try {
    const page = req.query.page || null
    const {movies, totalPages, error} = await TMDB.getMovies(page)
    if (error) {
      throw error
    }
    const smallMovies = await optimizeMovies(movies)
    res.json({movies: smallMovies})
    cacheMovies(smallMovies, totalPages)
  } catch (e) {
    errorHandler(res, e)
  }
})

// check for cached genres
app.get('/genres', async (req, res, next) => {
  try {
    const recent = await haveRecentCache('genres', 7)
    if (!recent) {
      return next()
    }
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
    req.genres = genres
    res.json({genres})
    cacheGenres(genres)
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
