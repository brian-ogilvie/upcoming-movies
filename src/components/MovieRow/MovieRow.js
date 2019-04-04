import React from 'react'
import './MovieRow.css'
import Utils from '../../utils'

import Poster from '../Poster/Poster'

const MovieRow = ({movie, onSelectMovie}) => {
  const {id, title, genres, poster_path, release_date} = movie
  const allGenres = genres.join(', ')

  const handleClick = e => {
    onSelectMovie(id)
  }

  return (
    <div className="MovieRow" onClick={handleClick}>
      <div className="MovieRow__content">
        <h3>{title}</h3>
        <p>{allGenres}</p>
        <p>Release Date: {Utils.parseDate(release_date)}</p>
      </div>
      <div className="MovieRow__poster">
        <Poster size="small" path={poster_path} />
      </div>
    </div>
  )
}

export default MovieRow