import useSWR from 'swr'

/** GET METHODS */
export const useAllWares = (accessToken) => {
  const { data, error } = useSWR([`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`, accessToken])

  return {
    wares: data?.ware_refs,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useFilteredWares = (query, accessToken) => {
  const { data, error } = useSWR([`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json?q=${query}`, accessToken])

  return {
    wares: data?.ware_refs,
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
