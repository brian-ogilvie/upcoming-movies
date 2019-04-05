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
    const {selectedMovieId} = this.state
    const sidebarInvisible = window.innerWidth < 500 && selectedMovieId !== null
    return (
      <div className="App">
        {!sidebarInvisible &&
          <Sidebar onSelectMovie={this.handleSelectMovie} />
        }
        <MovieDetail movieId={selectedMovieId} onDismiss={this.handleDismiss} />
      </div>
    );
  }
}

export default App;
