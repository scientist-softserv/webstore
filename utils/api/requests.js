import useSWR from 'swr'
import { fetcher } from '.'

export const getAllRequests = () => {
  const { data, error } = useSWR(`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/quote_groups/mine.json`, fetcher)

  return {
    requests: data?.quote_group_refs,
    isLoading: !error && !data,
    isError: error,
  }
}
