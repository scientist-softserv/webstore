import NextAuth from 'next-auth'
let rootPath = process.env.NEXTAUTH_URL

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const authOptions = {
  // const authOptions = (req, res) => ({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      id: 'acme',
      name: 'Acme',
      type: 'oauth',
      checks: ['pkce', 'state'],
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: 'https://acme.scientist.com/oauth/authorize',
      token: 'https://acme.scientist.com/oauth/token',
      userinfo: {
        request: () => {}
      },
      // the profile url is the api endpoint. is that correct? do we even need it?
      // profileUrl: '',
      profile(profile) {
        console.log(profile)
        return {
          id: 80322,
          email: 'summer@scientist.com',
          // id: profile.id,
          // name: profile.scientist_account?.profile.nickname,
          // email: profile.scientist_account?.email,
          // image: profile.scientist_account?.profile.profile_image_url,
        }
      },
    }
  ],
  // pages: {
    // signIn: `${rootPath}/login`,
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
  // jwt: {
  //   // The maximum age of the NextAuth.js issued JWT in seconds.
  //   // Defaults to `session.maxAge`.
  //   maxAge: 60 * 60 * 24 * 30,
  //   // You can define your own encode/decode functions for signing and encryption
  //   async encode() {},
  //   async decode() {},
  // },
  session: {
    strategy: 'jwt',
  },
  // useSecureCookies: true,
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log({url, baseUrl})
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log({ user, account, profile, email, credentials })
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  },
  // cookies: {
  //   pkceCodeVerifier: {
  //     name: `${cookiePrefix}next-auth.pkce.code_verifier`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: useSecureCookies,
  //       maxAge: 900
  //     }
  //   },
  //   state: {
  //     name: `${cookiePrefix}next-auth.state`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: useSecureCookies,
  //       maxAge: 900
  //     },
  //   },
  // },
  debug: true,
// })
}

// export default (req, res) => {
//   return NextAuth(req, res, authOptions(req, res))
// }

export default NextAuth(authOptions)
