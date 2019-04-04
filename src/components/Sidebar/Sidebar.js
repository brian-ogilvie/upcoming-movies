import React from 'react'
import './Sidebar.css'

import API from '../../API'
import SearchBar from '../SearchBar/SearchBar'
import MoviesList from '../MoviesList/MoviesList'

class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      loading: true,
      page: 0,
      activeSearch: false
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
          page: page
        }
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  infiniteScroll = () => {
    if (this.state.loading) {return}
    const page = this.state.page + 1
    this.getMovies(page)
  }

  searchMovies = async searchTerm => {
    try {
      await this.setState({
        loading: true,
        movies: []
      })
      const movies = await API.searchMovies(searchTerm)
      this.setState({
        movies,
        loading: false,
        activeSearch: true
      })
    } catch (e) {
      console.log(e.message);
    }
  }

  clearSearch = async () => {
    if (!this.state.activeSearch) {return}
    await this.setState({
      movies: [],
      activeSearch: false,
    })
    this.getMovies()
  }

  componentDidMount() {
    this.getMovies()
  }

  render() {
    const {config, onSelectMovie} = this.props
    return (
      <div className="Sidebar">
        <SearchBar onSearch={this.searchMovies} onClear={this.clearSearch} />
        <MoviesList 
          movies={this.state.movies} 
          loading={this.state.loading} 
          config={config} 
          onSelectMovie={onSelectMovie} 
          infiniteScroll={this.infiniteScroll} 
        />
      </div>
    )
  }
}

export default Sidebar