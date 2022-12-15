import useSWR from 'swr'
import { configureMessages, configure_status } from './configurations'
import { fetcher } from './fetcher'

export const getAllRequests = () => {
  const { data, error } = useSWR(`/quote_groups/mine.json`, fetcher)

  const all_requests = data?.quote_group_refs.map(quote_group => ({
    ...quote_group,
    status: configure_status(quote_group.status),
  }))

  return {
    all_requests,
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

export const getAllMessages = (id) => {
  const { data, error } = useSWR(`/quote_groups/${id}/notes.json`, fetcher)
  let messages
  if (data) messages = configureMessages(data.notes)

  return {
    messages,
    isLoadingMessages: !error && !data,
    isMessageError: error,
  }
}
