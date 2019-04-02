const apiKey = process.env.TMDB_API_KEY
const axios = require('axios')
const URL = 'https://api.themoviedb.org/3/'

const TMDB = {
  async getMovies(pageNum = 1) {
    const endpoint = `${URL}movie/upcoming?api_key=${apiKey}&language=en-US&page=${pageNum}`
    try {
      const res = await axios.get(endpoint)
      const movies = res.data.results
      return {movies}
    } catch (e) {
      throw e
    }
  },

  async getGenres() {
    const endpoint = `${URL}genre/movie/list?api_key=${apiKey}&language=en-US`
    try {
      const res = await axios.get(endpoint)
      const {genres} = res.data
      return {genres}
    } catch (e) {
      throw e
    }
  }
}

module.exports = TMDB