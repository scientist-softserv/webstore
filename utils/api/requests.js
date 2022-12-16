import useSWR from 'swr'
import { configure_requests } from './configurations'
import { fetcher, posting } from './base'

export const getAllRequests = () => {
  const { data, error } = useSWR(`/quote_groups/mine.json`, fetcher)
  const requests = data && configure_requests({ data: data.quote_group_refs, path: '/requests' })

  return {
    requests,
    isLoading: !error && !data,
    isError: error,
  }
}

export const getOneRequest = (id) => {
  const { data, error } = useSWR(`/quote_groups/${id}.json`, fetcher)
  let request = data && configure_requests({ data, path: '/requests' })[0]
  if (request) {
    request = {
      ...request,
      createdAt: request.createdAt.slice(0, 12),
      proposedDeadline: request.proposedDeadline.slice(0, 12),
    }
  }

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

export const sendMessage = ({ id, message, files }) => {
  const note = {
    body: message,
    quoted_ware_ids: [id],
    data_files: files,
  }

  posting(`/quote_groups/${id}/notes.json`, note)
}
