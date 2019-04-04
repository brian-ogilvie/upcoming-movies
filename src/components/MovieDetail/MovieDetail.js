import React from 'react'
import './MovieDetail.css'

import API from '../../API'
import Utils from '../../utils'

import Poster from '../Poster/Poster'
import ActivityIndicator from '../ActivityIndicator/ActivityIndicator'

class MovieDetail extends React.Component {
  constructor() {
    super()
    this.state = {
      movie: null
    }
  }

  getMovie = async () => {
    try {
      const {movieId} = this.props
      if (!movieId) {return;}
      const movie = await API.getMovieById(movieId)
      this.setState({ movie })
    } catch (e) {
      console.log(e.message)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.movieId !== prevProps.movieId) {
      this.getMovie()
    }
  }

  render () {
    const {config} = this.props
    if (this.state.movie) {
      const {title, overview, release_date, genres, poster_path} = this.state.movie
      const allGenres = genres.join(', ')
      return (
        <div className="MovieDetail">
          <h2 className="MovieDetail__title">{title}</h2>
          {poster_path && (
            <div className="MovieDetail__poster">
              <Poster size="large" config={config} path={poster_path} />
            </div>
          )}
          <p className="MovieDetail__info"><strong>Relsease Date:</strong> {Utils.parseDate(release_date)}</p>
          <p className="MovieDetail__info"><strong>Genre:</strong> {allGenres}</p>
          <p className="MovieDetail__info"><strong>Overview:</strong> {overview}</p>
        </div>
      )
    }
    if (this.props.movieId) return (
      <div className="MovieDetail">
        <ActivityIndicator />
      </div>
    )
    return (
      <div className="MovieDetail">
        <h3 className="MovieDetail__instructions">Click on a movie to the left to view more details.</h3>
      </div>
    )
  }
}

export default MovieDetail