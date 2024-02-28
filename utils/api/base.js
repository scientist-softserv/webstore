import axios from 'axios'
import * as Sentry from '@sentry/nextjs'

const baseURL = `https://${process.env.NEXT_PUBLIC_PROVIDER_NAME}.scientist.com/api/${process.env.NEXT_PUBLIC_SCIENTIST_API_VERSION}`
// Use the user's own access token if they are signed in. If not, fall back to the access token provided through the provider credentials
const defaultHeaders = (token) => ({ Authorization: `Bearer ${token || process.env.NEXT_PUBLIC_TOKEN}` })
const api = axios.create({ baseURL })

export const fetcher = (url, token) => {
  return api.get(url, { headers: defaultHeaders(token) })
    .then(res => res.data)
    .catch(error => {
      Sentry.captureException(error)
      // the `signIn` function from "next-auth/react" uses `fetcher` and returns a 404 error response. throwing that error causes an
      // `OAUTH_CALLBACK_HANDLER_ERROR`, which prevents users from signing in. `signIn` doesn't pass a url to `fetcher`. the check below
      // ensures that other errors still get thrown
      if (error.config.url !== null) throw error
    })
}

export const posting = async (url, data, token) => {
  try {
    const response = await api.post(url, data, { headers: defaultHeaders(token) })

    return {
      data: response.data,
      error: false,
    }
  } catch (error) {
    Sentry.captureException(error)

    return {
      data: undefined,
      error,
    }
  }
}

export const updating = async (url, data, token) => {
  try {
    const response = await api.put(url, data, { headers: defaultHeaders(token) })

    return {
      data: response.data,
      error: false,
    }
  } catch (error) {
    Sentry.captureException(error)

    return {
      data: undefined,
      error,
    }
  }
}
