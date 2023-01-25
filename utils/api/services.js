import useSWR from 'swr'
import { fetcher } from './base'

export const useAllWares = (accessToken) => {
  const { data, error } = useSWR([`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`, accessToken])

  return {
    wares: data?.ware_refs,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useFilteredWares = (query) => {
  const { data, error } = useSWR(`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json?q=${query}`, fetcher)

  return {
    wares: data?.ware_refs,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useOneWare = (id) => {
  const { data, error } = useSWR(`/wares/${id}.json`, fetcher)

  return {
    ware: data?.ware,
    isLoading: !error && !data,
    isError: error,
  }
}
