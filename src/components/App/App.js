import React, { Component } from 'react';
import './App.css';

import Sidebar from '../Sidebar/Sidebar'
import MovieDetail from '../MovieDetail/MovieDetail'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Sidebar />
        <MovieDetail />
      </div>
    );
  }
}

export default App;
