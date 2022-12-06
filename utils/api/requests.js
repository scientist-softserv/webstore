import useSWR from 'swr'
import { configure_status } from './configurations'
import { fetcher } from './fetcher'

export const getAllRequests = () => {
  const { data, error } = useSWR(`/quote_groups/mine.json`, fetcher)

  return {
    all_requests: data?.quote_group_refs,
    isLoading: !error && !data,
    isError: error,
  }
}

export const getOneRequest = (id) => {
  const { data, error } = useSWR(`/quote_groups/${id}.json`, fetcher)

  const status = configure_status(data?.status)
  const request = {
    ...data,
    status,
  }

  // TODO: configure the rest of the request to have the other properties we need

  return {
    request,
    isLoadingRequest: !error && !data,
    isRequestError: error,
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
