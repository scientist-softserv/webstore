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
  const { data, error } = useSWR(accessToken ? [`/quote_groups/mine.json`, accessToken] : null)
  const requests = data && configureRequests({ data: data.quote_group_refs, path: '/requests' })

  return {
    requests,
    isLoadingAllRequests: !error && !data,
    isAllRequestsError: error,
  }
}

export const useOneRequest = (uuid, accessToken) => {
  const { data, error } = useSWR(accessToken ? [`/quote_groups/${uuid}.json`, accessToken] : null)
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
  const { data, error } = useSWR(accessToken ? [`/quote_groups/${id}/proposals.json`, accessToken] : null)
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
    const url = () => accessToken ? `quote_groups/${uuid}/quoted_wares/${quotedWareId}/purchase_orders.json` : null
    const data = await fetcher(url(), accessToken)
    const configuredPOs = data?.purchase_orders.map(async (po) => {
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
  const { data, error, mutate } = useSWR(accessToken ? [`/quote_groups/${requestUuid}/messages.json`, accessToken] : null)
  let messages
  if (data) {
    messages = configureMessages(data.messages)
  }

  // TODO(alishaevn): check that we don't need to change anything here when
  // https://github.com/assaydepot/scientist_api_v2/issues/251 is resolved
  return {
    messages,
    mutateMessages: mutate,
    messagesData: data,
    isLoadingMessages: !error && !data,
    isMessagesError: error,
  }
}

export const useFiles = (id, accessToken) => {
  const { data, error, mutate } = useSWR(accessToken ? [`/quote_groups/${id}/notes.json`, accessToken] : null)
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
  const { data, error } = useSWR(accessToken ? [`/wares/${id}/quote_groups/new.json`, accessToken] : null)
  let dynamicForm = { name: data?.name }
  let dynamicFormInfo = data?.dynamic_forms[0]

  if (dynamicFormInfo) {
    const defaultSchema = dynamicFormInfo.schema
    const defaultOptions = dynamicFormInfo.options
    const { adjustedSchemaProperties, uiSchema } = configureDynamicFormUiSchema(defaultSchema.properties, defaultOptions.fields)

    dynamicForm = {
      ...dynamicForm,
      schema,
      uiSchema,
    }
  }

  return {
    dynamicForm,
    isLoadingInitialRequest: !error && !data,
    isInitialRequestError: error,
  }
}

export const useDefaultWare = (accessToken) => {
  const { data, error } = useSWR(accessToken ? [`/wares.json`, accessToken] : null)
  const defaultWare = data?.ware_refs?.find(item => item.slug === 'make-a-request')

  return {
    // TODO(alishaevn): check this still works with the next client
    defaultWareID: defaultWare?.id,
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

  const url = () => accessToken ? `/quote_groups/${id}/notes.json` : null
  return posting(url(), note, accessToken)
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

  const url = () => accessToken ? `/wares/${wareID}/quote_groups.json` : null
  let { data, error } = await posting(url(), { pg_quote_group }, accessToken)

  if (data && dynamicFormData.attachments.length) {
    /**
     * TODO(alishaevn): I'm not sure why, but sometimes our data does not have the "quoted_ware_refs" property on it.
     * a search for the request in postman however, returns the property. we should find the underlying commonality on
     * requests that don't return the value so we can fix it. (ref: https://github.com/scientist-softserv/webstore/issues/252)
     */
    let quotedWareID = data.quoted_ware_refs?.[0]?.id
    if (!quotedWareID) {
      // we have to explicity use fetcher because "useOneRequest" is a hook
      const url = () => accessToken ? `/quote_groups/${data.id}.json` : null
      const res = await fetcher(url(), accessToken)
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

export const acceptSOWandCreatePO = (request, sow, accessToken) => {
  let sharedRequestData = requestData({
    request: request,
    shipping: request.shippingAddress,
    billing: request.billingAddress,
  })

  /* eslint-disable camelcase */
  const pg_quote_group = {
    ...sharedRequestData,
    name: request.title,
    description: request.description,
    provider_names: [process.env.NEXT_PUBLIC_PROVIDER_NAME],
    winning_proposal_id: sow.id,
    purchase_justifications: [''],
    purchase_justification_comment: '',
    po_number: `PO${sow.identifier}`,
  }

  const url = () => accessToken ? `/quote_groups/${request.id}/accept_sow.json` : null
  return posting(url(), { pg_quote_group }, accessToken)
  /* eslint-enable camelcase */
}

/** PUT METHODS */
export const sendRequestToVendor = async (requestID, accessToken) => {
  const url = () => accessToken ? `/quote_groups/${requestID}/send_to_vendors.json` : null
  const { data, error } = await updating(url(), {}, accessToken)

  return { data, error }
}
