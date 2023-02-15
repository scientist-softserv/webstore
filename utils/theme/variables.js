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
    bg: light,
    text: dark,
  },
  'SOW Selection': {
    bg: secondary,
    text: light,
  },
  'Work Started': {
    bg: primary,
    text: light,
  },
  'Work Completed': {
    bg: dark,
    text: light,
  },
}
