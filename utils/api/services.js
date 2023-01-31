import useSWR from 'swr'

export const useAllWares = (accessToken) => {
  const { data, error } = useSWR(accessToken ? [`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`, accessToken] : null)

  return {
    wares: data?.ware_refs,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useFilteredWares = (query, accessToken) => {
  // This function has "url" separated to avoid a linting line length error
  const url = accessToken ? [`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json?q=${query}`, accessToken] : null
  const { data, error } = useSWR(url)

  return {
    wares: data?.ware_refs,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useOneWare = (id, accessToken) => {
  const { data, error } = useSWR([`/wares/${id}.json`, accessToken])

  return {
    ware: data?.ware,
    isLoading: !error && !data,
    isError: error,
  }
}
