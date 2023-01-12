import themeColors from './theme.module.scss'
const { dark, primary, success, info, secondary, white } = themeColors
export {
  dark,
  primary,
  success,
  info,
  secondary,
  white,
}

// These are the colors used for the requests
export const statusColors = {
  'Supplier Review': {
    bg: info,
    text: dark,
  },
  'SOW Selection': {
    bg: secondary,
    text: white,
  },
  'Work Started': {
    bg: success,
    text: white,
  },
  'Work Completed': {
    bg: dark,
    text: white,
  },
}

