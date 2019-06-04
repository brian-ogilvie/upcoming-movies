import React from 'react'
import './SearchBar.css'

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: ''
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.onSearch(this.state.searchTerm)
  }

  handleChange = e => {
    const {value} = e.target
    this.setState({
      searchTerm: value
    })
  }

  handleClearClick = e => {
    this.setState({
      searchTerm: ''
    })
    this.props.onClear()
  }

  render() {
    return (
      <div className="SearchBar">
        <form onSubmit={this.handleSubmit}>
          <input 
            className="SearchBar__input" 
            type="text" 
            placeholder="Search Movies"
            value={this.state.searchTerm}
            onChange={this.handleChange}
          />
          <div className="SearchBar__buttons">
            <button type="submit">Search</button>
            <button type="reset" onClick={this.handleClearClick}>Clear</button>
          </div>
        </form>
      </div>
    )
  }
}

export default SearchBar