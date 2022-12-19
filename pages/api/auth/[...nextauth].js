import NextAuth from 'next-auth'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    {
      id: 'scientist',
      name: 'Scientist',
      type: 'oauth',
      authorization: 'https://acme.scientist.com/oauth/authorize',
      token: 'https://acme.scientist.com/oauth/token',
      profileUrl: 'https://acme.scientist.com/users/profile.json',
      profile(profile) {
        console.log(profile)
        // return profile
        return {
          id: profile.id,
          name: profile.scientist_account?.profile.nickname,
          email: profile.scientist_account?.email,
          image: profile.scientist_account?.profile.profile_image_url,
        }
      },
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    }
    // ...add more providers here
  ],
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     console.log({url, baseUrl})
  //     // Allows relative callback URLs
  //     if (url.startsWith('/')) return `${baseUrl}${url}`
  //     // Allows callback URLs on the same origin
  //     else if (new URL(url).origin === baseUrl) return url
  //     return baseUrl
  //   }
  // }
}
export default NextAuth(authOptions)