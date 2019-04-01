require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const PORT = process.env.EXPRESS_PORT

const TMDB = require('./TMDB')

const app = new express()
app.use(morgan('dev'))
app.use(bodyParser.json())

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

app.listen(PORT, () => {
  console.log('☎️  Express server is listening on port', PORT)
})

const errorHandler = (res, e) => {
  const error = e.message || e
  res.json({error})
}
