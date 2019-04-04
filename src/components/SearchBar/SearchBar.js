import React from 'react'
import './SearchBar.css'

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="SearchBar">
        <input className="SearchBar__input" type="text" placeholder="Search Movies" />
        <div className="SearchBar__buttons">
          <button>Search</button>
          <button>Clear</button>
        </div>
      </div>
    )
  }
}

export default SearchBar