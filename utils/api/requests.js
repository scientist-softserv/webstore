import useSWR from 'swr'
import { fetcher } from './fetcher'

export const getAllRequests = () => {
  const { data, error } = useSWR(`/quote_groups/mine.json`, fetcher)

  return {
    all_requests: data?.quote_group_refs,
    isLoading: !error && !data,
    isError: error,
  }
}

export const getAllSOWs = (id) => {
  const { data, error } = useSWR(`/quote_groups/${id}/proposals.json`, fetcher)
  
  return {
    all_sows: data,
    isLoadingSOWs: !error && !data,
    isSOWError: error,
  }
}
