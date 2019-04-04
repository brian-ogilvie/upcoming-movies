import React, { Component } from 'react';
import './App.css';

import API from '../../API'

import Sidebar from '../Sidebar/Sidebar'
import MovieDetail from '../MovieDetail/MovieDetail'

class App extends Component {
  constructor() {
    super()
    this.state = {
      selectedMovieId: null,
      config: null,
    }
  }

  getImageConfig = async () => {
    try {
      const config = await API.getConfiguration()
      this.setState({config})
    } catch (e) {
      console.log(e.message)
    }
  }

  handleSelectMovie = selectedMovieId => {
    this.setState({selectedMovieId})
  }

  componentDidMount() {
    this.getImageConfig()
  }

  render() {
    const {config} = this.state
    return (
      <div className="App">
        <Sidebar onSelectMovie={this.handleSelectMovie} config={config} />
        <MovieDetail movieId={this.state.selectedMovieId} config={config} />
      </div>
    );
  }
}

export default App;
