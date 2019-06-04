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
    const {size, path} = this.props
    const waitingClass = this.state.imageLoaded ? '' : ' Poster--waiting'
    return (
      <div className="Poster__wrapper">
        <img className={'Poster' + waitingClass} src={path} alt="Movie Poster" onLoad={this.handleImgLoad} />
        {
          !this.state.imageLoaded && <ActivityIndicator size={size} />
        }
      </div>
    )
  }
}

export default Poster