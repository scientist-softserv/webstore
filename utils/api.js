import axios from 'axios'
import useSWR from 'swr'

const baseURL = `https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}.scientist.com/api/${process.env.NEXT_PUBLIC_SCIENTIST_API_VERSION}`
const defaultHeaders = { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` }

export const a = axios.create({ baseURL, headers: defaultHeaders })

const fetcher = (...args) => {
  return a.get(...args)
    .then(res => res.data)
}

export const getAllWares = () => {
  const { data, error } = useSWR(`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`, fetcher)

  return {
    wares: data?.ware_refs,
    isLoading: !error && !data,
    isError: error,
  }
}

export const getFilteredWares = (query) => {
  const { data, error } = useSWR(`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json&q=${query}`, fetcher)

  return {
    wares: data?.ware_refs,
    isLoading: !error && !data,
    isError: error,
  }
}

export const getOneWare = (id) => {
  const { data, error } = useSWR(`/wares/${id}.json`, fetcher)

  return {
    ware: data?.ware,
    isLoading: !error && !data,
    isError: error,
  }
}
