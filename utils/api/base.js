import axios from 'axios'
import * as Sentry from '@sentry/nextjs'

const baseURL = `https://${process.env.NEXT_PUBLIC_PROVIDER_NAME}.scientist.com/api/${process.env.NEXT_PUBLIC_SCIENTIST_API_VERSION}`
// Use the user's own access token if they are signed in. If not, fall back to the access token provided through the provider credentials
const defaultHeaders = (token) => ({ Authorization: `Bearer ${token || process.env.NEXT_PUBLIC_TOKEN}` })
const api = axios.create({ baseURL })

export const fetcher = (url, token) => {
  return api.get(url, { headers: `Bearer 1234` })
    .then(res => res.data)
    .catch(error => {
      console.log({ error })
      throw Sentry.captureException(error)
      // Sentry.captureEvent({
      //   message: error,
      //   stacktrace: error.stacktrace,
      //   name: error.name,
      // })
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
