import axios from 'axios'

const baseURL = `https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}.scientist.com/api/${process.env.NEXT_PUBLIC_SCIENTIST_API_VERSION}`
// TODO(alishaevn): delete or reinstate the defaultHeaders variable and use case after we determine how to handle an authenticated user.
// const defaultHeaders = { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` }

// const api = axios.create({ baseURL, headers: defaultHeaders })
const api = axios.create({ baseURL })

export const fetcher = (url, token) => {
  const headers = { Authorization: `Bearer ${token}` }

  return api.get(url, { headers })
    .then(res => res.data)
}

export const posting = async (url, data) => {
  try {
    const response = await api.post(url, data)
    if (response.data.id) {
      return {
        success: true,
        error: false,
        requestID: response.data.id,
      }
    }
  } catch (error) {
    // TODO(alishaevn): handle the error when sentry is set up
    console.error(`The following error occurred when trying to post new data:`, error)
    return { success: false, error, requestID: undefined }
  }
}
