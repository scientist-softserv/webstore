import { Footer, Header } from 'webstore-component-library'
import { FOOTER_NAME, FOOTER_SECTIONS, FOOTER_SOCIALS, LOGO } from '../constants/wrapper'
import '../styles/globals.css'

// putting the header and footer here mean that they automatically surround every page
const Webstore = ({ Component, pageProps }) => {
  return (
    <>
      <Header
          browseLink='/browse'
          logInLink='/login'
          logo={LOGO}
          logOutLink='/'
          requestsLink='/requests'
        />
      <Component {...pageProps} />
      <Footer
        companyName={FOOTER_NAME}
        sections={FOOTER_SECTIONS}
        socials={FOOTER_SOCIALS}
      />
    </>
  )
}

export default Webstore
