import { Footer, Header } from '@scientist-softserv/webstore-component-library'
import { FOOTER_NAME, FOOTER_SECTIONS, FOOTER_SOCIALS, getCurrentUser, LOGO } from '../utils'
import '../utils/theme/globals.scss'

// putting the header and footer here mean that they automatically surround every page
const Webstore = ({ Component, pageProps }) => {
  // TODO(alishaevn): also make the user accessible to the header
  return (
    <>
      <Header
        browseLink='/browse'
        logInLink='/login'
        logo={LOGO}
        logOutLink='/'
        requestsLink='/requests'
      />
      <Component {...pageProps} {...getCurrentUser()} />
      <Footer
        companyName={FOOTER_NAME}
        sections={FOOTER_SECTIONS}
        socials={FOOTER_SOCIALS}
      />
    </>
  )
}

export default Webstore
