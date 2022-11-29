// import "../../node_modules/bootstrap/scss/_functions.scss"
// import "../../node_modules/bootstrap/scss/_variables.scss"
import themeColors from '../../styles/default_bootstrap_overrides.module.scss'

// *** Please update the colors below to fit your brand guidelines ***
// For simplicity we've assigned the colors a number, but most brand guidelines will use names instead
export const black = themeColors.dark;
export const darker_grey = themeColors.primary
export const dark_grey = themeColors.success
export const light_grey = themeColors.info
export const lighter_grey = themeColors.secondary
export const white = themeColors.white

// These are the colors used for the requests
export const statusColors = {
  'Vendor Review': {
    bg: lighter_grey,
    text: black,
  },
  'Work In Progress': {
    bg: dark_grey,
    text: white,
  },
  'Work Completed': {
    bg: black,
    text: white,
  },
}

// You can choose to assign colors to elements here
export const buttons = darker_grey
export const header = lighter_grey
export const footer = lighter_grey

// Exporting all of the above variables as an object means that we can import as many or as few variables as we want
export const colors = {
  black,
  buttons,
  darker_grey,
  dark_grey,
  footer,
  header,
  light_grey,
  lighter_grey,
  statusColors,
  white,
}
