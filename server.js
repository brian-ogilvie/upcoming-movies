require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const PORT = process.env.EXPRESS_PORT

const TMDB = require('./TMDB')
const db = require('./models')
const {Genre, Movie} = db
const {cacheGenres, cacheMovies, optimizeMovies} = require('./movieHelpers')

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
