import themeColors from './theme.module.scss'
const {
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
} = themeColors

// sometimes we pass the variable itself because the hexadecimal value is needed
// other times, we pass a string because it's being concatenated into a bootstrap class in the component library
export const buttonBg = primary
export const headerAndFooterLinkColors = 'white'
export const requestActionsBg = 'secondary'
export const requestFormHeaderBg = 'light'
export const requestStatsHeaderBg = 'bg-secondary-8'
export const requestListBg = 'light'
export const statusBarBg = 'light'

// These are the colors used for the request and document statuses
export const statusColors = {
  'Supplier Review': {
    bg: primary,
    text: white,
  },
  'SOW Selection': {
    bg: primary,
    text: white,
  },
  'Work Started': {
    bg: secondary,
    text: white,
  },
  'Work Completed': {
    bg: dark,
    text: white,
  },
}
