require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

const PORT = process.env.PORT || 5000

const TMDB = require('./TMDB')
const db = require('./models')
const {Genre, Movie} = db
const Op = db.Sequelize.Op
const {cacheGenres, cacheMovies, cacheConfig, optimizeMovies, haveRecentCache} = require('./movieHelpers')

const app = new express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use('/', express.static('./build/'))

app.get('/movies', async (req, res, next) => {
  try {
    const {haveRecent} = await haveRecentCache('config', 7)
    if (haveRecent) {
      return next()
    }
    const config = await TMDB.getConfiguration()
    await cacheConfig(config)
    next()
  } catch (e) {
    errorHandler(res, e)
  }
})

// Check for cached genres
app.get('/movies', async (req, res, next) => {
  try {
    const {haveRecent} = await haveRecentCache('genres', 7)
    if (haveRecent) {
      console.log('✅ have recent genres.')
      req.haveGenres = true
    }
    console.log('✅ no recent genres.')
    next()
  } catch (e) {
    errorHandler(res, e)
  }
})

// Get genres from TMDB if necessary
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
      console.log('✅ no recent movies.')
      return next()
    }
    console.log('✅ have recent movies!')

    const page = req.query.page || 1
    const cachedMovies = await Movie.findAll({
      attributes: ['movie_id','title', 'poster_path_small', 'genres', 'release_date'],
      offset: 20 * (page - 1),
      limit: 20,
      order: ['id'],
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

app.get('/movies/search', async (req, res) => {
  try {
    const {haveRecent} = await haveRecentCache('movies', 1)
    if (!haveRecent) {
      return res.json({movies: []})
    }
    const movies = await Movie.findAll({
      attributes: ['movie_id','title', 'poster_path_small', 'genres', 'release_date'],
      where: {
        title: {
          [Op.iLike]: `%${req.query.title}%`
        }
      },
      limit: 10,
      order: ['id'],
    })
    res.json({movies})
  } catch (e) {
    errorHandler(res, e)
  }
})

app.get('/movies/lookup/:movie_id', async (req, res) => {
  try {
    const movie = await Movie.findOne({
      where: {
        movie_id: req.params.movie_id,
      },
      attributes: ['movie_id','title', 'poster_path_large', 'genres', 'release_date', 'overview'],
    })
    res.json({movie})
  } catch (e) {
    errorHandler(res, e)
  }
})

// In production, any request that doesn't match a previous route
// should send the front-end application, which will handle the route.
if (process.env.NODE_ENV == "production") {
  app.get("/*", function(request, response) {
    response.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log('☎️  Express server is listening on port', PORT)
})

const errorHandler = (res, e) => {
  const error = e.message || e
  res.json({error})
}
