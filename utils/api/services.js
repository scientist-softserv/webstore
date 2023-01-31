import useSWR from 'swr'

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
  console.log({ accessToken, id })
  const { data, error } = useSWR([`/wares/${id}.json`, accessToken])

  return {
    ware: data?.ware,
    isLoading: !error && !data,
    isError: error,
  }
}
