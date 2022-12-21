import { Footer, Header } from 'webstore-component-library'
import { SessionProvider } from 'next-auth/react'
import { FOOTER_NAME, FOOTER_SECTIONS, FOOTER_SOCIALS, useCurrentUser, LOGO } from '../utils'
import '../utils/theme/globals.scss'

// putting the header and footer here mean that they automatically surround every page
const Webstore = ({ Component, pageProps, session }) => {
  // TODO(alishaevn): also make the user accessible to the header
  return (
    <SessionProvider session={session}>
      <Header
        browseLink='/browse'
        logInLink='/login'
        logo={LOGO}
        logOutLink='/'
        requestsLink='/requests'
      />
      <Component {...pageProps} {...useCurrentUser()} />
      <Footer
        companyName={FOOTER_NAME}
        sections={FOOTER_SECTIONS}
        socials={FOOTER_SOCIALS}
      />
    </SessionProvider>
  )
}

export default Webstore
