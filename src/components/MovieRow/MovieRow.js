import React from 'react'
import './MovieRow.css'
import Utils from '../../utils'

import Poster from '../Poster/Poster'

const MovieRow = ({movie, onSelectMovie}) => {
  const {movie_id, title, genres, poster_path_small, release_date} = movie
  const allGenres = genres.join(', ')

  const handleClick = e => {
    onSelectMovie(movie_id)
  }

  return (
    <div className="MovieRow" onClick={handleClick}>
      <div className="MovieRow__content">
        <h3 className="MovieRow__title">{title}</h3>
        <p>{allGenres}</p>
        <p className="MovieRow__date">Release Date: {Utils.parseDate(release_date)}</p>
      </div>
      {poster_path_small && (
        <div className="MovieRow__poster">
          <Poster size="small" path={poster_path_small} />
        </div>
      )}
    </div>
  )
}

export default MovieRow