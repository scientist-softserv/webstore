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
  /* eslint-disable camelcase */
  const { data, error } = useSWR(`/wares/${id}/quote_groups.json`, fetcher)
  const acceptableProperties = ['quote_information', 'description', 'timeline']

  let propertiesArray = []
  let filteredProperties = []
  let requiredFields = []
  if (data) {
    propertiesArray = Object.entries(data?.dynamic_form.schema.properties)
    // TODO(alishaevn):
      // use "dynamic_forms"
      // sort each form according to order_priority
      // pull out the schema of each form
      // return the desired schema properties
      // propertiesArray = data?.dynamic_forms.sort((a,b) => a.order_priority - b.order_priority )
    filteredProperties = propertiesArray.filter(prop => acceptableProperties.includes(prop[0]))
    requiredFields = filteredProperties.map(prop => { if (prop[1].required) return prop[0] })
  }

  // TODO:(alishaevn): this may need to be altered for a blank request
  return {
    dynamicForm: {
      // TODO:(alishaevn): the description is just a list of questions. the empty string momentarily displays error text on the page
      options: data?.dynamic_form?.options,
      properties: Object.fromEntries(filteredProperties),
      requiredFields,
      title: data?.name,
      type: data?.dynamic_form?.schema.type,
    },
    isLoadingInitialRequest: !error && !data,
    isInitialRequestError: error,
  }
  /* eslint-enable camelcase */
}

export const dynamicFormSchema = (dynamicForm) => {
  const schema = {
    'type': dynamicForm.type,
    'required': dynamicForm.requiredFields,
    // 'properties': dynamicForm.properties,
    'properties': {
      'suppliers_identified': {
        'type': 'string',
        'title': 'Have you already identified supplier(s) for this service?',
        'enum': [
            'Yes',
            'No'
        ],
        // 'required': [true]
      },
      'quote_information': {
        'type': 'string',
        'title': 'Do you want a price quote or just information?',
        // 'required': [true],
        'enum': [
            'I need a quote(s)',
            'I am looking for information only'
        ]
      },
      'description': {
        'type': 'string',
        'title': 'Description',
        // 'required': [true],
        // 'dependencies': 'suppliers_identified'
      },
      'timeline': {
        'type': 'string',
        // 'required': [true],
        'title': 'What is the timeline for this project?'
      }
    },
    'dependencies': {
      "description": ["suppliers_identified"],
      "quote_information": ["suppliers_identified"],
    }
  }

  return schema
}

export const dynamicFormUiSchema = (dynamicForm) => {
    let schema = {}
    const fields = dynamicForm?.options?.fields

    if (fields) {
      for (let key in dynamicForm?.properties) {
        if (fields.hasOwnProperty(key)) {
          let field_options = {}

          if(fields[key].type === 'textarea') {
            field_options['ui:options'] = fields[key]
          } else if (fields[key].type === 'text') {
            field_options['ui:options'] = fields[key]
          } else if (fields[key].type === 'radio') {
            field_options['ui:options'] = fields[key]
          }

          // if (fields[key].helper) {
          //   field_options['ui:help'] = <HelpBlock content={fields[key].helper} />
          // }

          if (field_options) {
            schema[key] = field_options
          }
        }
      }
    }
    // console.log('uiSchema', schema)

    // {suppliers_identified: {
    //   // 'ui:classNames': 'd-none',
    //   // 'ui:disabled': true,
    //   // 'ui:emptyValue': ['Yes']
    // },
    // 'ui:disabled': ['suppliers_identified']}
}
