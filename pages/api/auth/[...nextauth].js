import NextAuth from 'next-auth'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const authOptions = {
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
        // url: "https://example.com/oauth/userinfo",
        // The result of this method will be the input to the `profile` callback.
        async request(context) {
          // context contains useful properties to help you make the request.
          // return await makeUserinfoRequest(context)
          console.log('userinfo request', context)
          return context
        }
      },
      profile({ provider, tokens }) {
        console.log(tokens);
        return tokens.user
      }
    }
  ],

}

export default NextAuth(authOptions)
