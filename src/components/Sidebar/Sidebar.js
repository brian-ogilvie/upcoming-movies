import React from 'react'
import './Sidebar.css'

import API from '../../API'
import SearchBar from '../SearchBar/SearchBar'
import MoviesList from '../MoviesList/MoviesList'

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      loading: true
    }
  }

  getMovies = async (page = 1) => {
    try {
      await this.setState({loading: true})
      const movies = await API.getMovies(page)
      this.setState(prevState => {
        return {
          movies: [
            ...prevState.movies,
            ...movies
          ],
          loading: false,
        }
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  componentDidMount() {
    this.getMovies()
  }

  render() {
    return (
      <div className="Sidebar">
        <SearchBar />
        <MoviesList movies={this.state.movies} loading={this.state.loading} onSelectMovie={this.props.onSelectMovie} />
      </div>
    )
  }
}

export default Sidebar