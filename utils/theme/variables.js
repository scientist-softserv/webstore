import themeColors from './theme.module.scss'
const {
  black,
  danger,
  info,
  light,
  primary,
  dark,
  secondary,
  success,
  warning,
  white,
} = themeColors
export {
  black,
  dark,
  danger,
  info,
  light,
  primary,
  secondary,
  success,
  warning,
  white,
}

// These are used for the request and document statuses
export const statusColors = {
  'Supplier Review': {
    bg: primary,
    text: light,
  },
  'SOW Selection': {
    bg: primary,
    text: light,
  },
  'Work Started': {
    bg: secondary,
    text: light,
  },
  'Work Completed': {
    bg: dark,
    text: light,
  },
}
