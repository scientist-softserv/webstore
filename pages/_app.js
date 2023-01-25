import { Footer, Header } from '@scientist-softserv/webstore-component-library'
import {
  SessionProvider, signIn, signOut, useSession 
} from 'next-auth/react'

import {
  FOOTER_NAME,
  FOOTER_SECTIONS,
  FOOTER_SOCIALS,
  LOGO,
  NAVIGATION_LINKS,
} from '../utils'
import '../utils/theme/globals.scss'

const WebStore = ({ Component }) => {
  const { data: session } = useSession()

  return (
    <>
      <Header
        auth={{
          signIn: () => signIn(process.env.NEXT_PUBLIC_PROVIDER_NAME),
          signOut: signOut,
        }}
        logo={LOGO}
        navLinks={NAVIGATION_LINKS}
        userSession={session}
      />
      <Component />
      <Footer
        companyName={FOOTER_NAME}
        sections={FOOTER_SECTIONS}
        socials={FOOTER_SOCIALS}
      />
    </>
  )
}

const App = ({ Component, pageProps: { session } }) => {
  return (
    <SessionProvider session={session}>
      <WebStore Component={Component} />
    </SessionProvider>
  )
}

export default App
