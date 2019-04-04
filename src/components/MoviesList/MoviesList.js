import React from 'react'
import './MoviesList.css'

import MovieRow from '../MovieRow/MovieRow'
import ActivityIndicator from '../ActivityIndicator/ActivityIndicator'

class MoviesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 0
    }
  }

  handleScroll = e => {
    const list = e.srcElement
    const listHeight = this.state.height
    const scroll = list.scrollTop
    if (scroll + window.innerHeight >= listHeight + 100) {
      this.props.infiniteScroll()
    }
  }

  updateHeight = () => {
    const height = this.listDiv.offsetHeight
    this.setState({height})
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true)
    window.addEventListener('resize', this.updateHeight)
  }

  componentDidUpdate(prevProps) {
    if (this.props.movies !== prevProps.movies) {
      this.updateHeight()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.updateHeight)
  }

  render() {
    const {movies, onSelectMovie} = this.props
    const allMovies = movies.map(movie => {
      return <MovieRow movie={movie} key={movie.movie_id} onSelectMovie={onSelectMovie} />
    })
    return (
      <div ref={listDiv => this.listDiv = listDiv} className="MoviesList">
        {allMovies}
        {this.props.loading && <ActivityIndicator />}
      </div>
    )
  }
}

export default MoviesList