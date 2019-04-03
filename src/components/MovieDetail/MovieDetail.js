import React from 'react'
import './MovieDetail.css'

import Poster from '../Poster/Poster'

const MovieDetail = props => {
  return (
    <div className="MovieDetail">
      <h2>Title</h2>
      <Poster />
    </div>
  )
}

export default MovieDetail