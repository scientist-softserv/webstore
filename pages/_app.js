import { Footer, Header } from 'webstore-component-library'
import { FOOTER_NAME, FOOTER_SECTIONS, FOOTER_SOCIALS, LOGO } from '../constants/wrapper'
import { fetcherB } from '../services/fetcher'
import '../styles/globals.css'

// putting the header and footer here mean that they automatically surround every page
const Webstore = ({ Component, pageProps, data }) => {
  const services = (path) => {
    return data?.map(ware => {
      const img = ware.promo_image
        ? { src: ware.promo_image, alt: `The promotional image for ${ware.name}` }
        : DEFAULT_WARE_IMAGE

      return {
        description: ware.snippet,
        id: ware.reference_of_id,
        img: {
          src: ware.promo_image,
          alt: `The promotional image for ${ware.name}`
        },
        name: ware.name,
        href: `${path}/${ware.slug}`,
      }
    })
  }

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
  const data = await fetcher(url)

  return { data: data.ware_refs }
}

export default Webstore


