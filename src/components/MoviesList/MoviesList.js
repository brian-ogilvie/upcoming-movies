import React from 'react'
import './MoviesList.css'

import MovieRow from '../MovieRow/MovieRow'
import ActivityIndicator from '../ActivityIndicator/ActivityIndicator'

class MoviesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {movies, config, onSelectMovie} = this.props
    const allMovies = movies.map(movie => {
      return <MovieRow movie={movie} key={movie.id} config={config} onSelectMovie={onSelectMovie} />
    })
    return (
      <div className="MoviesList">
        {allMovies}
        {this.props.loading && <ActivityIndicator />}
      </div>
    )
  }
}

export default MoviesList