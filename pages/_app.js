import { Footer, Header } from '@scientist-softserv/webstore-component-library'
import { SessionProvider, signIn, signOut } from 'next-auth/react'
import {
  FOOTER_NAME,
  FOOTER_SECTIONS,
  FOOTER_SOCIALS,
  LOGO,
  NAVIGATION_LINKS,
  useCurrentUser,
} from '../utils'
import '../utils/theme/globals.scss'

// putting the header and footer here mean that they automatically surround every page
const Webstore = ({ Component, pageProps: { session } }) => {
  return (
    <SessionProvider session={session}>
      <Header
        auth={{
          signIn: () => signIn(process.env.NEXT_PUBLIC_PROVIDER_NAME),
          signOut: () => signOut,
        }}
        logo={LOGO}
        navLinks={NAVIGATION_LINKS}
        // TODO(alishaevn): find the appropriate way to determine the session, user token, etc.
        // currently, session is always returning "undefined" in this component
        userSession={session}
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
