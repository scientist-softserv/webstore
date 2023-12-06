import {
  deleteCookie,
  getCookie,
  hasCookie,
  setCookie,
} from 'cookies-next'

/**
 * if/when we add analytics, we need to address each TODO below
 */

const cookieConsentGiven = hasCookie('_dl_cookie_consent')

export const getCookieConsent = () => !cookieConsentGiven

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
  setCookie('_dl_cookie_consent', 'true', cookieOptions)
}

const nonEssentialCookies = [
  // TODO(alishaevn): create this list
  // TODO(alishaevn): add these cookies to pages/legal-notices/cookie-policy.js under "Non-essential cookies" with a description and expiration time frame
]

export const disableCookies = () => {
  nonEssentialCookies.forEach(cookie => deleteCookie(cookie))
  // TODO(alishaevn): after deleting the cookies, we need to also disable them
  setCookie('_dl_cookie_consent', 'false', cookieOptions)
}
