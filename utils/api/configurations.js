import { DEFAULT_WARE_IMAGE } from '../constants'
import { statusColors } from '../theme'
import {
  normalizeDescription,
  normalizeHtmlDescription,
  normalizeDate,
  timeSince,
  formatBytes
} from '../helpers'

export const configureServices = ({ data, path }) => {
  return data?.map(ware => {
    const img = ware.urls.promo_image
      ? { src: ware.urls.promo_image, alt: `The promotional image for ${ware.name}` }
      : DEFAULT_WARE_IMAGE

    return {
      description: ware.description === '' ? ware.snippet : ware.description,
      snippet: ware.snippet,
      id: ware.id,
      img,
      name: ware.name,
      href: `${path}/${ware.slug}`,
    }
  })
}

export const configureRequests = ({ data, path }) => {
  const sortedRequests = Array.isArray(data)
    ? data.sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    : [data]

  return sortedRequests?.map(request => {
    const status = configureStatus(request.status)
    return {
      billingAddress: {
        address: request.billing_address?.text,
        city: request.billing_address?.city,
        country: request.billing_address?.country,
        state: request.billing_address?.state,
        street: request.billing_address?.street,
        street2: request.billing_address?.street2,
        zipcode: request.billing_address?.zipcode,
        id: request.billing_address?.id,
      },
      billingSameAsShipping: request.billing_same_as_shipping,
      createdAt: normalizeDate(request.created_at),
      description: normalizeDescription(request.description),
      htmlDescription: normalizeHtmlDescription(request.description),
      href: {
        pathname: `${path}/${request.uuid}`,
        query: {},
      },
      id: request.id,
      identifier: request.identifier,
      // TODO(alishaevn): pass the actual image here when it's available
      img: DEFAULT_WARE_IMAGE,
      proposedDeadline: normalizeDate(request.proposed_deadline),
      shippingAddress: {
        address: request.shipping_address?.text,
        city: request.shipping_address?.city,
        country: request.shipping_address?.country,
        state: request.shipping_address?.state,
        street: request.shipping_address?.street,
        street2: request.shipping_address?.street2,
        zipcode: request.shipping_address?.zipcode,
        id: request.shipping_address?.id,
      },
      status: {
        backgroundColor: statusColors[status].bg,
        text: status,
        textColor: statusColors[status].text,
      },
      title: `${request.identifier}: ${request.name}`,
      updatedAt: normalizeDate(request.updated_at),
      uuid: request.uuid,
      quotedWareID: request.quoted_ware_refs?.[0]?.id,
    }
  })
}

// takes an array of errors for each page or component
export const configureErrors = (errors) => {
  const env = process.env.NODE_ENV
  const remainingErrors = errors
    .filter(error => error && Object.keys(error).length)
    .map(error => ({
      ...error,
      message: `${error.message} (${error.response?.data?.message || ''})`,
    }))
  let body = []
  let title = ''

  if (env === 'development') {
    remainingErrors.map(error => {
      body.push(JSON.stringify(error, null, 2))
      title = remainingErrors.length > 1 ? 'There were multiple errors.' : error.name
    })

    return {
      body, // returns an array that will be mapped over in the component
      title,
      variant: 'warning'
    }
  }

  if (env === 'production') {
    // other status codes / custom errors to be shown in production may be added here.
    // could add different variants for each status code
    let text
    switch (remainingErrors[0].response.status) {
    case 404:
      text = 'This page or section was not found.'
      break

    default:
      text = "We're working on getting this back up and running as soon as possible."
    }

    return {
      body: [text],
      title: "We're sorry - something went wrong.",
      variant: 'danger'
    }
  }
}

export const configureStatus = (status) => {
  // account for some of the statuses at the link below that may accidentally be returned:
  // https://github.com/assaydepot/rx/blob/6d2c3b10b25937d783cbf42ff0f965fde27a5f83/app/modules/pg/quote_group_statuses.rb#L16

  switch (status) {
  case 'Completed':
  case 'Work Completed':
  case 'Closed':
  case 'Cancelled':
    status = 'Work Completed'
    break

  case 'Work In Progress':
    status = 'Work Started'
    break

  case 'SOW Submitted':
  case 'Estimate Submitted':
  case 'Selected for Work':
    status = 'SOW Selection'
    break

  default:
    status = 'Supplier Review'
  }

  return status
}

export const configureMessages = (data) => {
  // NOTE(alishaevn): doing some basic filtering here until we come to a resolution on
  // https://github.com/assaydepot/scientist_api_v2/issues/167
  const filteredMessages = data.filter(d => d.user_ref && d.body)

  return filteredMessages.map(note => ({
    avatar: note.user_ref.image,
    body: note.body,
    id: note.id,
    name: `${note.user_ref.first_name} ${note.user_ref.last_name}`,
    timeSince: timeSince(Date.parse(note.created_at)),
    attachments: note.attachments.map((attachment) => ({
      ...attachment,
      contentLength: formatBytes(attachment.content_length),
      href: `https://${process.env.NEXT_PUBLIC_PROVIDER_NAME}.scientist.com/secure_attachments/${attachment.uuid}`
    })) || [],
  }))
}

export const configureFiles = (data) => {
  // filter out the notes that do not have attachments
  const notesWithFiles = data.filter(d => d.attachments?.length)
  let fileArrays = []

  // modify the object for each file
  notesWithFiles.map(note => {
    let singleFileArray = note.attachments.map(file => ({
      contentLength: formatBytes(file.content_length),
      contentType: file.content_type,
      createdAt: normalizeDate(file.created_at),
      download: file.download,
      fileName: file.filename,
      href: `https://${process.env.NEXT_PUBLIC_PROVIDER_NAME}.scientist.com/secure_attachments/${file.uuid}`,
      status: note.status,
      uploadedBy: note.created_by,
      uuid: file.uuid
    }))
    fileArrays.push(singleFileArray)
  })

  // flatten the array of file arrays so we have a single array of only files
  const allFiles = [].concat(...fileArrays)
  return allFiles
}

export const configureDocument = (document, requestIdentifier) => {
  return {
    date: normalizeDate(document.created_at),
    documentStatus: document.status,
    documentStatusColor: statusColors[configureStatus(document.status)].bg,
    documentType: document.type,
    documentTypeColor: 'bg-dark',
    id: document.id,
    identifier: document.identifier,
    lineItems: configureLineItems(document.line_items),
    requestIdentifier,
    shippingPrice: document.shipping_cost_currency,
    shipTo: {
      organizationName: document.ship_to.organization_name,
      text: document.ship_to.text,
    },
    shipFrom: {
      organizationName: document.ship_from.organization_name,
      text: document.ship_from.text,
    },
    subtotalPrice: document.retail_subtotal_price_currency,
    taxAmount: document.tax_cost_currency,
    terms: document.payment_terms,
    totalPrice: document.retail_total_price_currency,
  }
}

export const configureSOWs = (sows, requestIdentifier) => {
  return sows?.map((sow) => ({
    ...configureDocument(sow, requestIdentifier),
  }))
}

export const configurePO = (po, requestIdentifier) => ({
  ...configureDocument(po, requestIdentifier),
  turnaroundTime: po.turn_around_time.human,
  poNumber: po.po_number,
  relatedSOWIdentifier: po.proposal_refs.first?.identifier,
  adPO: po.scientist_identifier,
})

const configureLineItems = (lineItems) => (lineItems.map(lineItem => ({
  id: lineItem.id,
  quantity: lineItem.quantity,
  currency: lineItem.currency,
  name: lineItem.name,
  total: lineItem.retail_subtotal_price_currency,
  unitPrice: lineItem.unit_price,
})))

export const configureDynamicFormSchema = (defaultSchema) => {
  // TODO(alishaevn): will need to account for multiple forms in phase 2

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

      if (value.type === 'array') {
        let { title, type } = adjustedProperty

        propertyFields[key] = {
          type,
          title,
          items: {
            type: 'string',
            enum: adjustedProperty.enum,
          },
          uniqueItems: true,
        }
      } else {
        propertyFields[key] = adjustedProperty
      }
    }
  })

  return {
    'type': defaultSchema.type,
    'required': requiredFields,
    'properties': propertyFields,
    'dependencies': dependencyFields,
  }
}

export const configureDynamicFormUiSchema = (schema, defaultOptions) => {
  let UiSchema = {}
  const { fields } = defaultOptions

  if (fields) {
    for (let key in schema.properties) {
      if (fields.hasOwnProperty(key)) {
        let fieldOptions = { 'ui:classNames': 'mb-4' }

        if(fields[key].helper) fieldOptions['ui:help'] = fields[key].helper
        if(fields[key].placeholder) fieldOptions['ui:placeholder'] = fields[key].placeholder
        if(fields[key].rows) {
          fieldOptions['ui:options']= {
            widget: 'textarea',
            rows: fields[key].rows,
          }
        }
        switch(fields[key].type) {
        case 'checkbox':
          fieldOptions['ui:widget'] = 'checkboxes'
          break
        case 'radio':
          fieldOptions['ui:widget'] = 'radio'
          break
        default:
          fieldOptions['ui:inputType'] = fields[key].type
        }

        UiSchema[key] = fieldOptions
      }
    }
  }

  return UiSchema
}
