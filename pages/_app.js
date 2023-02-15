import { Footer, Header } from '@scientist-softserv/webstore-component-library'
import { SWRConfig } from 'swr'
import {
  SessionProvider, signIn, signOut, useSession
} from 'next-auth/react'

import {
  FOOTER_NAME,
  FOOTER_SECTIONS,
  FOOTER_SOCIALS,
  LOGO,
  NAVIGATION_LINKS,
  fetcher,
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
        linkColor='white'
        logo={LOGO}
        navLinks={NAVIGATION_LINKS}
        userSession={session}
      />
      <Component />
      <Footer
        color='white'
        companyName={FOOTER_NAME}
        sections={FOOTER_SECTIONS}
        socials={FOOTER_SOCIALS}
      />
    </>
  )
}

const App = ({ Component, pageProps: { session } }) => {
  // We are providing the fetcher function globally so that it doesn't need passing into every `get` request.
  // This can be overridden in individual functions, re: https://swr.vercel.app/docs/global-configuration

  // We are wrapping the app in a SessionProvider so that we have the ability to gain access to the user session on each page
  return (
    <SWRConfig value={{ fetcher }}>
      <SessionProvider session={session}>
        <WebStore Component={Component} />
      </SessionProvider>
    </SWRConfig>
  )
}

export default App
