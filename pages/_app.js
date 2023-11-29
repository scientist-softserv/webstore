import { CookiePreferencesModal, Footer, Header } from '@scientist-softserv/webstore-component-library'
import { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
import {
  SessionProvider,
  signIn,
  signOut,
  useSession,
} from 'next-auth/react'
import {
  FOOTER_NAME,
  FOOTER_SECTIONS,
  FOOTER_SOCIALS,
  LOGO,
  NAVIGATION_LINKS,
  disableCookies,
  enableCookies,
  getCookieConsent,
  fetcher,
  headerAndFooterLinkColors,
} from '../utils'
import '../utils/theme/globals.scss'
import { getCookies } from 'cookies-next'

const WebStore = ({ Component }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const cookies = getCookies()
  console.log('APP.JS >>', { cookies })

  const signOutUser = () => {
    signOut()
    router.push('/')
  }

  return (
    <>
      <CookiePreferencesModal
        disableCookies={disableCookies}
        enableCookies={enableCookies}
        getCookieConsent={getCookieConsent()}
      />
      <Header
        auth={{
          signIn: () => signIn(process.env.NEXT_PUBLIC_PROVIDER_NAME),
          signOut: signOutUser,
        }}
        linkColor={headerAndFooterLinkColors}
        logo={LOGO}
        navLinks={NAVIGATION_LINKS}
        userSession={session}
      />
      <Component session={session} />
      <Footer
        color={headerAndFooterLinkColors}
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
