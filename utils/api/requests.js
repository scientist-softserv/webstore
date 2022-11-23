import useSWR from 'swr'
import { fetcher } from './fetcher'

export const getAllRequests = () => {
  const { data, error } = useSWR(`/quote_groups/mine.json`, fetcher)
  // TODO: this hard codes a quote group ID for now, but it will need to dynamically receive the id from.. somewhere?
  //const { sowData } = useSWR(`/quote_groups/512528/proposals.json`, fetcher)
  // const { sowData } = useSWR(`/quote_groups/${data?.quote_group_refs?.id}/proposals.json`, fetcher)
  console.log({data: data})
  // console.log({sowData: sowData})

  return {
    all_requests: data?.quote_group_refs,
    //sows: sowData,
    isLoading: !error && !data,
    isError: error,
  }
}
