import axios from 'axios'

const baseURL = `https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}.scientist.com/api/${process.env.NEXT_PUBLIC_SCIENTIST_API_VERSION}`
const defaultHeaders = { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` }

const a = axios.create({ baseURL, headers: defaultHeaders })

export const fetcher = (str) => {

  return a.get(str)
    .then(res => res.data)

}
