import axios from 'axios'

const API = {
  async getMovies(page = 1) {
    try {
      const url = `/movies?page=${page}`
      const res = await axios.get(url)
      const {movies, error} = res.data
      if (error) {throw error;}
      return movies
    } catch (e) {
      throw e
    }
  },

  async getConfiguration() {
    try {
      const url = '/configuration'
      const res = await axios.get(url)
      const {config, error} = res.data
      if (error) {throw error;}
      return config
    } catch (e) {
      throw e
    }
  },

  async searchMovies(title) {
    try {
      const url = `/movies/search?title=${title}`
      const res = await axios.get(url)
      const {movies, error} = res.data
      if (error) {throw error;}
      return movies
    } catch (e) {
      throw e
    }
  }
}

export default API