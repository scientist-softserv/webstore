import useSWR from 'swr'
import {
  configureFiles,
  configureDynamicFormSchema,
  configureDynamicFormUiSchema,
  configureMessages,
  configurePO,
  configureRequests,
  configureSOWs,
} from './configurations'
import { fetcher, posting, updating } from './base'

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
    allSOWs = configureSOWs(data, requestIdentifier)
  }

  return {
    allSOWs,
    isLoadingSOWs: !error && !data,
    isSOWError: error,
  }
}

// The name of this function is getAllPOs vs. useAllPOs. Since it is not a hook, it should not start with "use".
export const getAllPOs = async (quotedWareId, uuid, requestIdentifier, accessToken) => {
  try {
    // TODO(summer-cook): eventually we can use the useSWRList hook here instead of mapping & calling the fetcher.
    // This hook is actively being contributed to the swr repo, but the semantics of the work are still being debated.
    // See https://github.com/vercel/swr/discussions/1988 for the RFC and https://github.com/vercel/swr/pull/2047 for the PR.
    const data = await fetcher(`quote_groups/${uuid}/quoted_wares/${quotedWareId}/purchase_orders.json`, accessToken)
    const configuredPOs = data.map(async (po) => {
      const purchaseOrder = await fetcher(`quote_groups/${uuid}/quoted_wares/${quotedWareId}/purchase_orders/${po.id}.json`, accessToken)
      return configurePO(purchaseOrder, requestIdentifier)
    })
    const allPOs = await Promise.all(configuredPOs).then(res => res)

    return {
      allPOs,
      isLoadingPOs: !allPOs,
      isPOError: false,
    }
  } catch (error) {
    return {
      allPOs: [],
      isLoadingPOs: false,
      isPOError: error,
    }
  }
}

export const useMessages = (requestUuid, accessToken) => {
  const { data, error, mutate } = useSWR(requestUuid ? [`/quote_groups/${requestUuid}/messages.json`, accessToken] : null)
  let messages
  if (data) {
    messages = configureMessages(data.messages)
  }

  return {
    messages,
    mutateMessages: mutate,
    messagesData: data,
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
    files: files || [],
    mutateFiles: mutate,
    filesData: data,
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
export const createMessageOrFile = ({ id, quotedWareID, message, files, accessToken }) => {
  /* eslint-disable camelcase */

  // in the scientist marketplace, both user messages sent on a request's page and
  // attachments to a request of any kind are considered "notes"
  // only user messages will have a body, attachments to requests will not.
  // only attachments that are added when creating a new request should have a title & status.
  const note = {
    title: message ? null : 'New Attachment',
    status: message ? null : 'Other File',
    body: message || null,
    quoted_ware_ids: [quotedWareID],
    data_files: files,
  }
  /* eslint-enable camelcase */

  return posting(`/quote_groups/${id}/notes.json`, note, accessToken)
}

const requestData = ({request, shipping, billing}) => {
  return {
    /* eslint-disable camelcase */
    provider_ids: [process.env.NEXT_PUBLIC_PROVIDER_ID],
    proposed_deadline_str: request.proposedDeadline,
    site: {
      billing_same_as_shipping: request.billingSameAsShipping,
      name: process.env.NEXT_PUBLIC_PROVIDER_NAME,
    },
    shipping_address_attributes: {
      city: shipping.city,
      country: shipping.country,
      state: shipping.state,
      street: shipping.street,
      street2: shipping.street2,
      zipcode: shipping.zipcode,
      organization_name: process.env.NEXT_PUBLIC_PROVIDER_NAME
    },
    billing_address_attributes: {
      city: billing.city,
      country: billing.country,
      state: billing.state,
      street: billing.street,
      street2: billing.street2,
      zipcode: billing.zipcode,
      organization_name: process.env.NEXT_PUBLIC_PROVIDER_NAME
    },
    /* eslint-enable camelcase */
  }
}

export const createRequest = async ({ dynamicFormData, wareID, accessToken }) => {
  /* eslint-disable camelcase */
  // the api currently doesn't account for attachments
  let requestDescription = dynamicFormData.description
  let requestTimeline = dynamicFormData.timeline
  let formData = dynamicFormData.formData

  // if the ware had a dynamic form, the description would come as part of the formData. otherwise, it comes from the local state
  if (dynamicFormData.formData.description) {
    const { description, timeline, ...remainingFormData } = dynamicFormData.formData
    formData = remainingFormData
    requestDescription = description
    requestTimeline = timeline
  }

  let sharedRequestData = requestData({
    request: dynamicFormData,
    shipping: dynamicFormData.shipping,
    billing: dynamicFormData.billing,
  })

  const pg_quote_group = {
    ...formData,
    ...sharedRequestData,
    name: dynamicFormData.name,
    suppliers_identified: 'Yes',
    description: requestDescription,
    no_proposed_deadline: dynamicFormData.proposedDeadline ? false : true,
    timeline: requestTimeline,
  }

  let { data, error } = await posting(`/wares/${wareID}/quote_groups.json`, { pg_quote_group }, accessToken)

  if (data && dynamicFormData.attachments) {
    /**
     * TODO(alishaevn): I'm not sure why, but sometimes our data does not have the "quoted_ware_refs" property on it.
     * a search for the request in postman however, returns the property. we should find the underlying commonality on
     * requests that don't return the value so we can fix it. (ref: https://github.com/scientist-softserv/webstore/issues/252)
     */
    let quotedWareID = data.quoted_ware_refs?.[0]?.id
    if (!quotedWareID) {
      // we have to explicity use fetcher because "useOneRequest" is a hook
      const res = await fetcher(`/quote_groups/${data.id}.json`, accessToken)
      quotedWareID = res.quoted_ware_refs?.[0]?.id
    }

    const attachedFiles = await createMessageOrFile({
      accessToken,
      id: data.id,
      files: dynamicFormData.attachments,
      quotedWareID,
    })

    if (attachedFiles.error) {
      // acknowledges that the request was created, but the file attachment failed
      error = attachedFiles.error
    }
  }

  return { data, error }
  /* eslint-enable camelcase */
}

export const acceptSOW = (request, sowID, accessToken) => {
  let sharedRequestData = requestData({
    request: request,
    shipping: request.shippingAddress,
    billing: request.billingAddress,
  })

  const sow = {
    ...sharedRequestData,
    name: request.title,
    description: request.description,
    /* eslint-disable camelcase */
    provider_names: [process.env.NEXT_PUBLIC_PROVIDER_NAME],
    winning_proposal_id: sowID,
    purchase_justifications: [''],
    purchase_justification_comment: '',
  }

  return posting(`/quote_groups/${request.id}/accept_sow.json`, { pg_quote_group: sow }, accessToken)
  /* eslint-enable camelcase */
}

/** PUT METHODS */
export const sendRequestToVendor = async (requestID, accessToken) => {
  const { data, error } = await updating(`/quote_groups/${requestID}/send_to_vendors.json`, {}, accessToken)

  return { data, error }
}
