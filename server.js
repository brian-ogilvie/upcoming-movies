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


// fallback query API for movies
app.get('/movies', async (req, res) => {
  try {
    const page = req.query.page || null
    const {movies, error} = await TMDB.getMovies(page)
    if (error) {
      throw error
    }
    res.json({movies})
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
  const now = new Date()
  genresToInsert = genres.map(genre => {
    return {
      ...genre,
      created_at: now,
      updated_at: now
    }
  })
  await Genre.bulkCreate(genresToInsert)
}

async function cacheMovies(movies) {
  const now = new Date()
  
}
