import themeColors from './variables.module.scss'
const { dark, primary, success, info, secondary, white } = themeColors

// These are the colors used for the requests
export const statusColors = {
  'Vendor Review': {
    bg: secondary,
    text: dark,
  },
  'Work In Progress': {
    bg: success,
    text: white,
  },
  'Work Completed': {
    bg: dark,
    text: white,
  },
}
