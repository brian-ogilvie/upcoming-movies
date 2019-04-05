import React from 'react'
import './BackButton.css'

const BackButton = ({onClick}) => {
  return (
    <div className="BackButton" onClick={onClick}><i className="fas fa-arrow-left"></i></div>
  )
}

export default BackButton