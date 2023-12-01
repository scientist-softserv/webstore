import {
  deleteCookie,
  getCookie,
  hasCookie,
  setCookie,
} from 'cookies-next'

/**
 * TODO: determine if/how to handle cookies
 * ref: https://assaydepot.slack.com/archives/C05U031L0V9/p1701363833246969
 * tldr: no rx session cookies are being set, and google analytics isn't enabled
 *
 * if we want to handle cookies, we need to readdress enableCookies() and disableCookies()
 */

const cookieConsentGiven = hasCookie('_dl_cookie_consent')

export const getCookieConsent = () => cookieConsentGiven // delete this and uncomment the line below to re-enable cookie consent
// export const getCookieConsent = () => !cookieConsentGiven

export const cookieConsentValue = cookieConsentGiven ? getCookie('_dl_cookie_consent') : 'false'

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
  // TODO(alishaevn): check for the presence of non essential (analytics) cookies. if none, enable them.
  // setCookie('_dl_cookie_consent', 'true', cookieOptions)
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
  // nonEssentialCookies.forEach(cookie => deleteCookie(cookie))
  // TODO(alishaevn): after deleting the cookies, we need to also disable them
  // setCookie('_dl_cookie_consent', 'false', cookieOptions)
}
