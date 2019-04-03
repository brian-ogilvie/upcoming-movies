require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const PORT = process.env.EXPRESS_PORT

const TMDB = require('./TMDB')
const db = require('./models')
const {Genre, Movie} = db
const Op = db.Sequelize.Op
const {cacheGenres, cacheMovies, cacheConfig, optimizeMovies, haveRecentCache} = require('./movieHelpers')

const app = new express()
app.use(morgan('dev'))
app.use(bodyParser.json())

app.get('/config', async (req, res, next) => {
  try {
    const {haveRecent, data} = await haveRecentCache('config', 7)
    if (haveRecent) {
      return res.json({config: data})
    }
    const config = await TMDB.getConfiguration()

    res.json({config})
    cacheConfig(config)
  } catch (e) {
    errorHandler(res, e)
  }
})

// Check for cached genres
app.get('/movies', async (req, res, next) => {
  try {
    const {haveRecent} = await haveRecentCache('genres', 7)
    if (haveRecent) {
      req.haveGenres = true
    }
    next()
  } catch (e) {
    errorHandler(res, e)
  }
})

// Get genres from TMDB
app.get('/movies', async (req, res, next) => {
  try {
    if (req.haveGenres) {
      return next()
    }
    const {genres, error} = await TMDB.getGenres()
    if (error) {
      throw error
    }
    req.genres = genres
    cacheGenres(genres)
    req.haveGenres = true
    next()
  } catch (e) {
    errorHandler(res, e)
  }
})

//check for movies in cache
app.get('/movies', async (req, res, next) => {
  try {
    const {haveRecent} = await haveRecentCache('movies', 1)
    if (!haveRecent) {
      return next()
    }
    const page = req.query.page || 1
    const cachedMovies = await Movie.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      offset: 20 * (page - 1),
      limit: 20,
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

app.get('/movies/search', async (req, res, next) => {
  try {
    const {haveRecent} = await haveRecentCache('movies', 1)
    if (!haveRecent) {
      res.json({movies: []})
    }
    const movies = await Movie.findAll({
      where: {
        title: {
          [Op.iLike]: `%${req.query.title}%`
        }
      }
    })
    res.json({movies})
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
