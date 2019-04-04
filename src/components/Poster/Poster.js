import React from 'react'
import './Poster.css'

const Poster = ({size, config, path}) => {
  if (!config) {
    return <div className="Poster"></div>
  }
  const {base_url, poster_sizes} = config
  const sizeString = size === 'large' ? poster_sizes[poster_sizes.length - 2] : poster_sizes[0]
  const url = base_url + sizeString + path
  
  return (
    <img className="Poster" src={url} alt="Movie Poster" />
  )
}

export default Poster