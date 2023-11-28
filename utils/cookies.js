import {
  deleteCookie,
  getCookie,
  getCookies,
  hasCookie,
  setCookie,
} from 'cookies-next'

// once the feature is ready, uncomment the line below
const cookieConsentGiven = hasCookie('_dl_cookie_consent')
export const cookieConsentValue = cookieConsentGiven ? JSON.parse(getCookie('_dl_cookie_consent')).value : true
const cookieConsent = {
  expires: new Date().setFullYear(new Date().getFullYear() + 1), // 1 year from now in milliseconds
  domain: process.env.NEXT_PUBLIC_PROVIDER_NAME,
}

export const enableCookies = () => {
  const cookie = JSON.stringify({ value: true, ...cookieConsent })
  setCookie('_dl_cookie_consent', cookie, { path: '/' })
  // set other cookies
}

export const disableCookies = () => {
  const cookie = JSON.stringify({ value: false, ...cookieConsent })
  // will account for this in a future pr
  // Object.keys(getCookies()).forEach(cookie => deleteCookie(cookie))

  setCookie('_dl_cookie_consent', cookie, { path: '/' })
}

export const getCookieConsent = () => {
  const cookieExpiration = cookieConsentGiven ? JSON.parse(getCookie('_dl_cookie_consent')).expires : undefined

  if ((!cookieConsentGiven) || (new Date() > cookieExpiration)) return true
  return false
}
