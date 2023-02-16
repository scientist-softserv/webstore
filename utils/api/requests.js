import useSWR from 'swr'
import {
  configureFiles,
  configureDocuments,
  configureDynamicFormSchema,
  configureDynamicFormUiSchema,
  configureMessages,
  configureRequests,
} from './configurations'
import { posting } from './base'

/** GET METHODS */
export const useAllRequests = (accessToken) => {
  const { data, error } = useSWR([`/quote_groups/mine.json`, accessToken])
  const requests = data && configureRequests({ data: data.quote_group_refs, path: '/requests' })

  return {
    requests,
    isLoadingAllRequests: !error && !data,
    isAllRequestsError: error,
  }
}

export const useOneRequest = (id, accessToken) => {
  const { data, error } = useSWR(id ? [`/quote_groups/${id}.json`, accessToken] : null)
  let request = data && configureRequests({ data, path: '/requests' })[0]
  if (request) {
    request = {
      ...request,
      createdAt: request.createdAt.slice(0, 12),
      proposedDeadline: request.proposedDeadline === 'No deadline set'
        ? request.proposedDeadline
        : request.proposedDeadline.slice(0, 12), // remove the time stamp
    }
  }

  return {
    request,
    isLoadingRequest: !error && !data,
    isRequestError: error,
  }
}

export const useAllSOWs = (id, requestIdentifier, accessToken) => {
  const { data, error } = useSWR(id ? [`/quote_groups/${id}/proposals.json`, accessToken] : null)
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

export const useMessages = (requestUuid, accessToken) => {
  const { data, error, mutate } = useSWR(requestUuid ? [`/quote_groups/${requestUuid}/messages.json`, accessToken] : null)
  let messages
  if (data) {
    messages = configureMessages(data.messages)
  }

  return {
    data,
    messages,
    mutate,
    isLoadingMessages: !error && !data,
    isMessagesError: error,
  }
}

export const useFiles = (id, accessToken) => {
  const { data, error, mutate } = useSWR(id ? [`/quote_groups/${id}/notes.json`, accessToken] : null)
  let files
  if (data) {
    files =  configureFiles(data.notes)
  }

  return {
    files,
    isLoadingFiles: !error && !data,
    isFilesError: error,
  }
}


export const useInitializeRequest = (id, accessToken) => {
  const { data, error } = useSWR(id ? [`/wares/${id}/quote_groups/new.json`, accessToken] : null)
  let dynamicForm = { name: data?.name }
  let dynamicFormInfo = data?.dynamic_forms[0]

  if (dynamicFormInfo) {
    const defaultSchema = dynamicFormInfo.schema
    const defaultOptions = dynamicFormInfo.options
    const schema = configureDynamicFormSchema(defaultSchema)

    dynamicForm = {
      ...dynamicForm,
      schema,
      uiSchema: configureDynamicFormUiSchema(schema, defaultOptions),
    }
  }

  return {
    dynamicForm,
    isLoadingInitialRequest: !error && !data,
    isInitialRequestError: error,
  }
}

export const useDefaultWare = (accessToken) => {
  const { data, error } = useSWR([`/wares.json?q=make-a-request`, accessToken])

  return {
    defaultWareID: data?.ware_refs?.[0]?.id,
    isLoadingDefaultWare: !error && !data,
    isDefaultWareError: error,
  }
}

/** POST METHODS */
// TODO(alishaevn): refactor the below once the direction of https://github.com/scientist-softserv/webstore/issues/156 has been decided
export const createMessageOrFile = ({ id, message, files, accessToken }) => {
  /* eslint-disable camelcase */

  // in the scientist marketplace, both user messages sent on a request's page and
  // attachments to a request of any kind are considered "notes"
  // only user messages will have a body, attachments to requests will not.
  // only attachments that are added when creating a new request should have a title & status.
  const note = {
    title: message ? null : 'New Attachment',
    status: message ? null : 'Other File',
    body: message || null,
    quoted_ware_ids: [id],
    data_files: files,
  }
  /* eslint-enable camelcase */

  // posting(`/quote_groups/${id}/notes.json`, note, accessToken)
}

export const createRequest = async ({ data, wareID, accessToken }) => {
  /* eslint-disable camelcase */
  // the api currently doesn't account for attachments
  let requestDescription = data.description
  let requestTimeline = data.timeline
  let formData = data.formData

  // if the ware had a dynamic form, the description would come as part of the formData. otherwise, it comes from the local state
  if (data.formData.description) {
    const { description, timeline, ...remainingFormData } = data.formData
    formData = remainingFormData
    requestDescription = description
    requestTimeline = timeline
  }

  const pg_quote_group = {
    ...formData,
    name: data.name,
    provider_ids: [process.env.NEXT_PUBLIC_PROVIDER_ID],
    suppliers_identified: 'Yes',
    description: requestDescription,
    proposed_deadline_str: data.proposedDeadline,
    no_proposed_deadline: data.proposedDeadline ? false : true,
    timeline: requestTimeline,
    site: {
      billing_same_as_shipping: data.billingSameAsShipping,
      name: data.name,
    },
    shipping_address_attributes: {
      city: data.shipping.city,
      country: data.shipping.country,
      state: data.shipping.state,
      street: data.shipping.street,
      street2: data.shipping.street2,
      zipcode: data.shipping.zipcode,
      organization_name: process.env.NEXT_PUBLIC_PROVIDER_NAME
    },
    billing_address_attributes: {
      city: data.shipping.city,
      country: data.shipping.country,
      state: data.shipping.state,
      street: data.shipping.street,
      street2: data.shipping.street2,
      zipcode: data.shipping.zipcode,
      organization_name: process.env.NEXT_PUBLIC_PROVIDER_NAME
    },
  }

  const response = await posting(`/wares/${wareID}/quote_groups.json`, { pg_quote_group }, accessToken)
  createMessageOrFile({ id: response.requestID, files: data.attachments })

  return response
  /* eslint-enable camelcase */
}
