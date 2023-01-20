import { Footer, Header } from '@scientist-softserv/webstore-component-library'
import { SessionProvider } from 'next-auth/react'
import {
  FOOTER_NAME,
  FOOTER_SECTIONS,
  FOOTER_SOCIALS,
  LOGO,
  NAVLINKS,
  useCurrentUser,
} from '../utils'
import '../utils/theme/globals.scss'

// the default sign in page comes from the below
// https://next-auth.js.org/v3/configuration/pages#oauth-sign-in

// putting the header and footer here mean that they automatically surround every page
const Webstore = ({ Component, pageProps: { session, ...pageProps } }) => {
  // TODO(alishaevn): also make the user accessible to the header
  // so we know whether we're logged in or not
  // we cannot use the session outside of session provider though :(
  return (
    <SessionProvider session={session}>
      <Header
        logo={LOGO}
        navLinks={NAVLINKS}
      />
      <Component {...useCurrentUser()} />
      <Footer
        companyName={FOOTER_NAME}
        sections={FOOTER_SECTIONS}
        socials={FOOTER_SOCIALS}
      />
    </SessionProvider>
  )
}

export default Webstore
