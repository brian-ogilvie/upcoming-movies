const Utils = {
  parseDate(dateString) {
    if (!dateString) {return null;}

    // const date = new Date(dateString)
    const date = dateString.split('T')[0].split('-')

    const months = 'January February March April May June July August September October November December'.split(' ')
    const year = date[0]
    const month = months[date[1] - 1]
    const day = date[2]
    return `${month} ${day}, ${year}`
  }
}

export default Utils