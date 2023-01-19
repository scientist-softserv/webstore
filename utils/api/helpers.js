
export const normalizeHtmlDescription = (text) => {
  const regex = / style="white-space: pre-line;"/g
  return text.replace(regex, '')
}

export const normalizeDescription = (text) => {
  // removes html elements, new lines, html comments and sections with 3 spaces from the string
  const regex = /(<([^>]+)>)|\n|-+>|   /g
  const description = text.replace(regex, '')
  const length = 350

  return description.length > length
    ? `${description.substring(0, length - 3)}...`
    : description
}

export const normalizeDate = (str) => {
  if (str) {
    const date = new Date(str)
    return `${date.toDateString().substring(3)} at ${date.toLocaleTimeString()}`
  }

  return 'No deadline set'
}

export const timeSince = function(date) {
  if (typeof date !== 'object') {
    date = new Date(date)
  }

  let seconds = Math.floor((new Date() - date) / 1000)
  let intervalType

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    intervalType = 'year'
  } else {
    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) {
      intervalType = 'month'
    } else {
      interval = Math.floor(seconds / 86400)
      if (interval >= 1) {
        intervalType = 'day'
      } else {
        interval = Math.floor(seconds / 3600)
        if (interval >= 1) {
          intervalType = 'hour'
        } else {
          interval = Math.floor(seconds / 60)
          if (interval >= 1) {
            intervalType = 'minute'
          } else {
            interval = seconds
            intervalType = 'second'
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's'
  }

  return interval + ' ' + intervalType
}

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}