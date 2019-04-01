const apiKey = process.env.TMDB_API_KEY
const axios = require('axios')
const URL = 'https://api.themoviedb.org/3/'

const TMDB = {
  async getMovies(pageNum = 1) {
    const endpoint = `${URL}movie/upcoming?api_key=${apiKey}&language=en-US&page=${pageNum}`
    try {
      const res = await axios.get(endpoint)
      return {movies: res.data.results}
    } catch (e) {
      return {error: e.message}
    }
  }
}

module.exports = TMDB