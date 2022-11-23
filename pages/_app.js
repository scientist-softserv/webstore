import { Footer, Header } from 'webstore-component-library'
import { FOOTER_NAME, FOOTER_SECTIONS, FOOTER_SOCIALS, getCurrentUser, LOGO } from '../utils'
import '../styles/globals.css'

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
      <div className='center-content'>
        <Component {...pageProps} {...getCurrentUser()} />
      </div>
      <Footer
        companyName={FOOTER_NAME}
        sections={FOOTER_SECTIONS}
        socials={FOOTER_SOCIALS}
      />
    </>
  )
}

export default Webstore
