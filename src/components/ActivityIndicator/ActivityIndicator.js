import React from 'react'
import './ActivityIndicator.css'

const ActivityIndicator = ({size}) => {
  const smallClass = size === 'small' ? ' ActivityIndicator__spinner--small' : '' 
  return (
    <div className="ActivityIndicator">
      <div className={'ActivityIndicator__spinner' + smallClass}></div>
    </div>
  )
}

export default ActivityIndicator