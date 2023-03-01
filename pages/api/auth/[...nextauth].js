import NextAuth from 'next-auth'
import axios from 'axios'
// TODO(alishaevn): use the api value from https://github.com/assaydepot/rx/issues/21497 in the next phase
import { EXPIRATION_DURATION } from '../../../utils'

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
  callbacks: {
    async jwt({ token, account, user }) {
      // Triggered on the initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + EXPIRATION_DURATION,
          refreshToken: account.refresh_token,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && (Date.now() < token.accessTokenExpires)) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      // Send additional properties to the client
      session.accessToken = token.accessToken
      return session
    },
  }
}

/**
 * Takes a token, and returns a new token with an updated `accessToken`.
 * If an error occurs, returns the old token and an error property
 */
const refreshAccessToken = async (token) => {
  try {
    const url = `https://${process.env.NEXT_PUBLIC_PROVIDER_NAME}.scientist.com/oauth/token`
    const encodedString = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
    })

    const response = await axios.post(url, params, {
      headers: {
        'Authorization': `Basic ${encodedString}`,
      },
    })
    const refreshedTokens = response.data

    if (response.status !== 200) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + EXPIRATION_DURATION,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to the old refresh token
    }
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export default NextAuth(authOptions)
