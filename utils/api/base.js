import axios from 'axios'

const baseURL = `https://${process.env.NEXT_PUBLIC_PROVIDER_NAME}.scientist.com/api/${process.env.NEXT_PUBLIC_SCIENTIST_API_VERSION}`
// Use the user's own access token if they are signed in. If not, fall back to the access token provided through the provider credentials
const defaultHeaders = (token) => ({ Authorization: `Bearer ${token || process.env.NEXT_PUBLIC_TOKEN}` })
const api = axios.create({ baseURL })

export const fetcher = (url, token) => {
  try {
    return api.get(url, { headers: defaultHeaders(token) })
      .then(res => res.data)
  } catch (error) {
    // TODO(alishaevn): handle the error when sentry is set up
    console.error(`The following error occurred when trying to retrieve data:`, error)
  }
}

export const posting = async (url, data, token) => {
  try {
    const response = await api.post(url, data, { headers: defaultHeaders(token) })
    let quotedWareID = response.data.quoted_ware_refs?.[0].id
    let requestID = response.data.id
    if (requestID) {
      return {
        success: true,
        error: false,
        requestID,
        quotedWareID
      }
    }
  } catch (error) {
    // TODO(alishaevn): handle the error when sentry is set up
    console.error(`The following error occurred when trying to post new data:`, error)
    return { success: false, error, requestID: undefined }
  }
}
