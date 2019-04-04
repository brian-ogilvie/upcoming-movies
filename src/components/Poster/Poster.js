import React from 'react'
import './Poster.css'

import ActivityIndicator from '../ActivityIndicator/ActivityIndicator'

class Poster extends React.PureComponent {
  constructor() {
    super()
    this.state = {
      imageLoaded: false
    }
  }

  handleImgLoad = (e) => {
    this.setState({imageLoaded: true})
  }

  componentDidUpdate(prevProps) {
    if (this.props.path !== prevProps.path) {
      this.setState({imageLoaded: false})
    }
  }

  render() {
    const {config, size, path} = this.props
    if (!config) {
      return <div className="Poster"></div>
    }
    const {base_url, poster_sizes} = config
    const sizeString = size === 'large' ? poster_sizes[poster_sizes.length - 2] : poster_sizes[0]
    const url = base_url + sizeString + path
    const waitingClass = this.state.imageLoaded ? '' : ' Poster--waiting'
    return (
      <div className="Poster__wrapper">
        <img className={'Poster' + waitingClass} src={url} alt="Movie Poster" onLoad={this.handleImgLoad} />
        {
          !this.state.imageLoaded && <ActivityIndicator size={size} />
        }
      </div>
    )
  }
}

export default Poster