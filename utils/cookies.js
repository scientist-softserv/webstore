import {
  deleteCookie,
  getCookie,
  hasCookie,
  setCookie,
} from 'cookies-next'

const cookieConsentGiven = hasCookie('_dl_cookie_consent')

export const getCookieConsent = () => !cookieConsentGiven

export const cookieConsentValue = cookieConsentGiven ? getCookie('_dl_cookie_consent') : 'true'

/**
 * setting the maxAge means that the cookie will be "deleted" after the maxAge has passed.
 * it can still be found in dev tools, but hasCookie() will return false.
 * therefore, we will be prompted in getCookieConsent() to ask for consent again.
 */
const cookieOptions = {
  maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
  path: '/',
  sameSite: 'lax',
}

export const enableCookies = () => {
  setCookie('_dl_cookie_consent', 'true', cookieOptions)
  setCookie('_dl_cookie_consent', cookie, { path: '/' })
  // set other cookies
}

const nonEssentialCookies = [
  '__ga',
  '__gid',
  '__utma',
  '__utmt',
  '__utmb',
  '__utmc',
  '__utmz',
  '__utmv',
  'pll_language'
]

export const disableCookies = () => {
  nonEssentialCookies.forEach(cookie => deleteCookie(cookie))
  setCookie('_dl_cookie_consent', 'false', cookieOptions)
}
