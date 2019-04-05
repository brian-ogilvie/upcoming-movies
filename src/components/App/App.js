import React, { Component } from 'react';
import './App.css';

import Sidebar from '../Sidebar/Sidebar'
import MovieDetail from '../MovieDetail/MovieDetail'

class App extends Component {
  constructor() {
    super()
    this.state = {
      selectedMovieId: null,
    }
  }

  handleSelectMovie = selectedMovieId => {
    this.setState({selectedMovieId})
  }

  handleDismiss = () => {
    this.setState({
      selectedMovieId: null
    })
  }

  render() {
    return (
      <div className="App">
        <Sidebar onSelectMovie={this.handleSelectMovie} />
        <MovieDetail movieId={this.state.selectedMovieId} onDismiss={this.handleDismiss} />
      </div>
    );
  }
}

export default App;
