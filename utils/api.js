import useSWR from 'swr'
import { fetcher } from './fetcher'

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
