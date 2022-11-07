import { Footer, Header } from 'webstore-component-library'
import { FOOTER_NAME, FOOTER_SECTIONS, FOOTER_SOCIALS, LOGO } from '../constants/wrapper'
import { fetcherB } from '../services/fetcher'
import '../styles/globals.css'

// putting the header and footer here mean that they automatically surround every page
const Webstore = ({ Component, pageProps, services }) => {
  return (
    <>
      <Header
          browseLink='/browse'
          logInLink='/login'
          logo={LOGO}
          logOutLink='/'
          requestsLink='/requests'
        />
      <Component {...pageProps} services={services} />
      <Footer
        companyName={FOOTER_NAME}
        sections={FOOTER_SECTIONS}
        socials={FOOTER_SOCIALS}
      />
    </>
  )
}

Webstore.getInitialProps = async () => {
  const url = `/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`
  const data = await fetcherB(url)

  return { services: data?.ware_refs }
}

export default Webstore


