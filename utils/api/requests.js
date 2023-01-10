import useSWR from 'swr'
import {
  configureDocuments,
  configureMessages,
  configureRequests,
} from './configurations'
import { fetcher, posting } from './base'

export const useAllRequests = () => {
  const { data, error } = useSWR(`/quote_groups/mine.json`, fetcher)
  const requests = data && configureRequests({ data: data.quote_group_refs, path: '/requests' })

  return {
    requests,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useOneRequest = (id) => {
  const { data, error } = useSWR(`/quote_groups/${id}.json`, fetcher)
  let request = data && configureRequests({ data, path: '/requests' })[0]
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

export const useAllSOWs = (id, requestIdentifier) => {
  const { data, error } = useSWR(`/quote_groups/${id}/proposals.json`, fetcher)
  let allSOWs
  if (data) {
    allSOWs = configureDocuments(data, requestIdentifier)
  }

  return {
    allSOWs,
    isLoadingSOWs: !error && !data,
    isSOWError: error,
  }
}

export const useAllMessages = (id) => {
  const { data, error } = useSWR(`/quote_groups/${id}/notes.json`, fetcher)
  let messages
  if (data) messages = configureMessages(data.notes)

  return {
    messages,
    isLoadingMessages: !error && !data,
    isMessageError: error,
  }
}

export const sendMessage = ({ id, message, files }) => {
  /* eslint-disable camelcase */
  const note = {
    body: message,
    quoted_ware_ids: [id],
    data_files: files,
  }
  /* eslint-enable camelcase */

  posting(`/quote_groups/${id}/notes.json`, note)
}

export const useInitializeRequest = (id) => {
  const { data, error } = useSWR(`/wares/${id}/quote_groups.json`, fetcher)
  const acceptableProperties = ['quote_information', 'description', 'timeline']

  let propertiesArray = []
  let filteredProperties = []
  let requiredFields = []
  if (data) {
    propertiesArray = Object.entries(data?.dynamic_form.schema.properties)
    filteredProperties = propertiesArray.filter(prop => acceptableProperties.includes(prop[0]))
    requiredFields = filteredProperties.map(prop => { if (prop[1].required) return prop[0] })
  }

  // TODO:(alishaevn): this may need to be altered for a blank request
  /* eslint-disable camelcase */
  return {
    dynamicForm: {
      // TODO:(alishaevn): the description is just a list of questions. the empty string momentarily displays error text on the page
      description: '',
      properties: Object.fromEntries(filteredProperties),
      requiredFields,
      title: data?.name,
      type: data?.dynamic_form.schema.type,
    },
    isLoadingInitialRequest: !error && !data,
    isInitialRequestError: error,
  }
  /* eslint-enable camelcase */
}
