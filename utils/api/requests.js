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
  let dynamicForm

  if (data) {
    const defaultSchema = data.dynamic_form.schema
    const defaultOptions = data.dynamic_form.options
    const schema = dynamicFormSchema(defaultSchema)

    dynamicForm = {
      schema,
      title: data.name,
      uiSchema: dynamicFormUiSchema(schema, defaultOptions),
    }
  }

  // TODO:(alishaevn): this may need to be altered for a blank request
  return {
    dynamicForm,
    isLoadingInitialRequest: !error && !dynamicForm,
    isInitialRequestError: error,
  }
}

export const dynamicFormSchema = (defaultSchema) => {
  const acceptableProperties = [
    'quote_information',
    'description',
    'suppliers_identified',
    'timeline'
  ]
  let properties = {}
  let requiredFields = []
  let dependencies = {}

  Object.entries(defaultSchema.properties).forEach(prop => {
    const [key, value] = prop

    if (acceptableProperties.includes(key)) {
      if (value.required) {
        requiredFields.push(key)
        delete value['required']
      }

      if (value.dependencies) {
        dependencies[key] = value[key]
        delete value['dependencies']
      }

      properties[key] = value
    }
  })

  return {
    'type': defaultSchema.type,
    'required': requiredFields,
    'properties': properties,
    'dependencies': dependencies,
  }
}

export const dynamicFormUiSchema = (schema, defaultOptions) => {
  let UiSchema = {}
  const { fields } = defaultOptions

  if (fields) {
    for (let key in schema.properties) {
      if (fields.hasOwnProperty(key)) {
        let fieldOptions = { 'ui:classNames': 'mb-4' }

        if(fields[key].type === 'textarea') {
          fieldOptions['ui:options'] = fields[key]
        } else if (fields[key].type === 'text') {
          fieldOptions['ui:options'] = fields[key]
        } else if (fields[key].type === 'radio') {
          fieldOptions['ui:options'] = fields[key]
        }

          // if (fields[key].helper) {
          //   field_options['ui:help'] = <HelpBlock content={fields[key].helper} />
          // }

        if (fieldOptions) {
          UiSchema[key] = fieldOptions
        }
      }
    }
  }

  return UiSchema
}
