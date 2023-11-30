import useSWR from 'swr'
import { API_PER_PAGE } from '../constants'

/** GET METHODS */
export const useAllWares = (accessToken) => {
  const { data, error } = useSWR([`/wares.json?per_page=${API_PER_PAGE}`, accessToken])

  return {
    wares: data?.ware_refs,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useFilteredWares = (query, accessToken) => {
  const { data, error } = useSWR([`/wares.json?per_page=${API_PER_PAGE}&q=${query}`, accessToken])

  return {
    wares: data?.ware_refs.filter(item => item.slug !== 'make-a-request'),
    isLoading: !error && !data,
    isError: error,
  }
}

export const useOneWare = (id, accessToken) => {
  const { data, error } = useSWR(id ? [`/wares/${id}.json`, accessToken] : null)

  return {
    ware: data?.ware,
    isLoading: !error && !data,
    isError: error,
  }
}
