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
    if (this.state.movie) {
      const {title, overview, release_date, genres, poster_path_large} = this.state.movie
      const allGenres = genres.join(', ')
      return (
        <div className="MovieDetail">
          <h2 className="MovieDetail__title">{title}</h2>
          {poster_path_large && (
            <div className="MovieDetail__poster">
              <Poster size="large" path={poster_path_large} />
            </div>
          )}
          <p className="MovieDetail__info"><strong>Relsease Date:</strong> {Utils.parseDate(release_date)}</p>
          <p className="MovieDetail__info"><strong>Genre:</strong> {allGenres}</p>
          <p className="MovieDetail__info"><strong>Overview:</strong> {overview}</p>
        </div>
      )
    }
    return (
      <div className="MovieDetail">
        <ActivityIndicator />
      </div>
    )
  }
}

export default MovieDetail