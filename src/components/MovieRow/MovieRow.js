import React from 'react'
import './MovieRow.css'
import Utils from '../../utils'

import Poster from '../Poster/Poster'

const MovieRow = ({movie, onSelectMovie, config}) => {
  const {id, title, genres, poster_path, release_date} = movie
  const allGenres = genres.join(', ')

  const handleClick = e => {
    onSelectMovie(id)
  }

  return (
    <div className="MovieRow" onClick={handleClick}>
      <div className="MovieRow__content">
        <h3 className="MovieRow__title">{title}</h3>
        <p>{allGenres}</p>
        <p className="MovieRow__date">Release Date: {Utils.parseDate(release_date)}</p>
      </div>
      <div className="MovieRow__poster">
        <Poster size="small" config={config} path={poster_path} />
      </div>
    </div>
  )
}

export default MovieRow