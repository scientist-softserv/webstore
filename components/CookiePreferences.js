import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {
  deleteCookie, getCookie, getCookies, setCookie,
} from 'cookies-next'
import { useState } from 'react'

const CookiePreferences = () => {
  const cookieConsent = getCookie('dl_cookie_consent')
  const cookies = getCookies()
  const [show, setShow] = useState(false)
  console.log({ cookieConsent, show, cookies })

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const enableCookies = () => {
    setCookie('dl_cookie_consent', 'true', { path: '/' })
    // set other cookies
    handleClose()
  }
  const disableCookies = () => {
    Object.keys(getCookies()).forEach(cookie => deleteCookie(cookie))
    setCookie('dl_cookie_consent', 'false', { path: '/' })
    handleClose()
  }

  if (!show && (cookieConsent === undefined)) return handleShow()

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Cookie Preferences</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Please provide your consent below to our use of non-essential cookies on our site.
        You may withdraw your consent at any point by visiting our <Link href='legal-notices/cookie-policy'>Cookie Policy</Link> page.
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={enableCookies}>
          Allow Cookies
        </Button>
        <Button variant='secondary' onClick={disableCookies}>
          Disable Cookies
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CookiePreferences

// reference: https://github.com/assaydepot/rx/blob/main/app/actions/cookies_manager.rb#L34-L46
const nonEssentialCookies = [
  '_ga', // this cookie is present in my console logs, but not in the list above
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
