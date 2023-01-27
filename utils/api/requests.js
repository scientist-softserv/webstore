import useSWR from 'swr'
import {
  configureDocuments,
  configureMessages,
  configureRequests,
} from './configurations'
import { posting } from './base'

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
  const { data, error } = useSWR([`/quote_groups/${id}.json`, accessToken])
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
  const { data, error } = useSWR([`/quote_groups/${id}/proposals.json`, accessToken])
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

export const useAllMessages = (id, accessToken) => {
  const { data, error, mutate } = useSWR([`/quote_groups/${id}/notes.json`, accessToken])
  let messages
  if (data) messages = configureMessages(data.notes)

  return {
    data,
    messages,
    mutate,
    isLoadingMessages: !error && !data,
    isMessageError: error,
  }
}

// TODO(alishaevn): refactor the below once the direction of https://github.com/scientist-softserv/webstore/issues/156 has been decided
export const postMessageOrAttachment = ({ id, message, files, accessToken }) => {
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
  postMessageOrAttachment({ id: response.requestID, files: data.attachments })

  return response
  /* eslint-enable camelcase */
}

export const useInitializeRequest = (id, accessToken) => {
  const { data, error } = useSWR([`/wares/${id}/quote_groups.json`, accessToken])
  let dynamicForm = { name: data?.name }

  if (data?.dynamic_form) {
    const defaultSchema = data.dynamic_form.schema
    const defaultOptions = data.dynamic_form.options
    const schema = dynamicFormSchema(defaultSchema)

    dynamicForm = {
      ...dynamicForm,
      schema,
      uiSchema: dynamicFormUiSchema(schema, defaultOptions),
    }
  }

  return {
    dynamicForm,
    isLoadingInitialRequest: !error && !data,
    isInitialRequestError: error,
  }
}

// TODO(alishaevn): https://github.com/assaydepot...scientist_api_v2/app/serializers/scientist_api_v2/dynamic_form_serializer.rb#L39
// update the method at the code above to return the configured schema below
export const dynamicFormSchema = (defaultSchema) => {
  // TODO(alishaevn): may need to account for multiple forms

  const removedProperties = [
    'concierge_support', 'suppliers_identified', 'price_comparison', 'number_suppliers',
    'supplier_criteria', 'supplier_confirmation'
  ]
  let propertyFields = {}
  let requiredFields = []
  let dependencyFields = {}

  Object.entries(defaultSchema.properties).forEach(prop => {
    const [key, value] = prop
    let adjustedProperty

    if (!removedProperties.includes(key)) {
      if (value.required) {
        requiredFields.push(key)
        let { required, ...remainingProperties } = value
        adjustedProperty = { ...remainingProperties }
      }

      if (value.dependencies) {
        dependencyFields[key] = [value['dependencies']]
        // fallback to the initial value in case "required" wasn't on this property
        let { dependencies, ...remainingProperties } = adjustedProperty || value
        adjustedProperty = { ...remainingProperties }
      }

      propertyFields[key] = adjustedProperty
    }
  })

  return {
    'type': defaultSchema.type,
    'required': requiredFields,
    'properties': propertyFields,
    'dependencies': dependencyFields,
  }
}

export const useDefaultWare = (accessToken) => {
  const { data, error } = useSWR([`/wares.json?q=make-a-request`, accessToken], fetcher)

  return {
    defaultWareID: data?.ware_refs?.[0]?.id.toString(),
    isLoadingDefaultWare: !error && !data,
    isDefaultWareError: error,
  }
}

// TODO(alishaevn): https://github.com/assaydepot...scientist_api_v2/app/serializers/scientist_api_v2/dynamic_form_serializer.rb#L39
// update the method at the code above to return the configured options below
// when updating, change the "helper" sentence to say "supplier" instead of "suppliers"
// also don't make fields dependent on "suppliers_identified" since that will always be true for a webstore
export const dynamicFormUiSchema = (schema, defaultOptions) => {
  let UiSchema = {}
  const { fields } = defaultOptions

  if (fields) {
    for (let key in schema.properties) {
      if (fields.hasOwnProperty(key)) {
        let fieldOptions = { 'ui:classNames': 'mb-4' }

        if(fields[key].helper) fieldOptions['ui:help'] = fields[key].helper
        if(fields[key].placeholder) fieldOptions['ui:placeholder'] = fields[key].placeholder
        if(fields[key].type) fieldOptions['ui:inputType'] = fields[key].type
        if(fields[key].rows) {
          fieldOptions['ui:options']= {
            widget: 'textarea',
            rows: fields[key].rows,
          }
        }

        UiSchema[key] = fieldOptions
      }
    }
  }

  return UiSchema
}
