import NextAuth from 'next-auth'

// For more information on each option (and a full list of options) go to: https://next-auth.js.org/configuration/options
const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      id: process.env.NEXT_PUBLIC_PROVIDER_NAME,
      name: process.env.NEXT_PUBLIC_PROVIDER_NAME,
      type: 'oauth',
      checks: ['pkce', 'state'],
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: `https://${process.env.NEXT_PUBLIC_PROVIDER_NAME}.scientist.com/oauth/authorize`,
      token: `https://${process.env.NEXT_PUBLIC_PROVIDER_NAME}.scientist.com/oauth/token`,
      userinfo: {
        // The result of this function will be the input to the `profile` callback.
        async request(context) {
          // context contains useful properties to help you make the request.
          return context
        }
      },
      profile({ tokens }) {
        return tokens.user
      }
    }
  ],
  theme: {
    logo: '/Logo.svg', // requires a file in the public folder
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Triggered on the initial sign
      if (account && user) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Send additional properties to the client
      session.accessToken = token.accessToken
      return session
    },
  }
}

export default NextAuth(authOptions)
