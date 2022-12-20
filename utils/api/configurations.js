import { DEFAULT_WARE_IMAGE } from '../constants'
import { statusColors } from '../theme'

export const configureServices = ({ data, path }) => {
  return data?.map(ware => {
    const img = ware.promo_image
      ? { src: ware.promo_image, alt: `The promotional image for ${ware.name}` }
      : DEFAULT_WARE_IMAGE

    return {
      description: ware.snippet,
      id: ware.reference_of_id,
      img,
      name: ware.name,
      href: `${path}/${ware.slug}`,
    }
  })
}

export const configureRequests = ({ data, path }) => {
  const sorted_requests = Array.isArray(data)
    ? data.sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    : [data]

  return sorted_requests?.map(request => {
    const status = configureStatus(request.status)

    return {
      billingAddress: {
        address: request.billing_address?.text,
        id: request.billing_address?.id,
      },
      createdAt: normalizeDate(request.created_at),
      description: normalizeDescription(request.description),
      htmlDescription: request.description,
      href: `${path}/${request.id}`,
      id: request.id,
      identifier: request.identifier,
      // TODO(alishaevn): pass the actual image here when it's available
      img: DEFAULT_WARE_IMAGE,
      proposedDeadline: normalizeDate(request.proposed_deadline),
      shippingAddress: {
        address: request.shipping_address?.text,
        id: request.shipping_address?.id,
      },
      status: {
        backgroundColor: statusColors[status].bg,
        text: status,
        textColor: statusColors[status].text,
      },
      title: `${request.identifier}: ${request.name}`,
      updatedAt: normalizeDate(request.updated_at),
    }
  })
}

const normalizeDescription = (text) => {
  // removes html elements, new lines, html comments and sections with 3 spaces from the string
  const regex = /(<([^>]+)>)|\n|-+>|   /g
  const description = text.replace(regex, '')
  const length = 350

  return description.length > length
    ? `${description.substring(0, length - 3)}...`
    : description
}

const normalizeDate = (str) => {
  const date = new Date(str)
  return `${date.toDateString().substring(3)} at ${date.toLocaleTimeString()}`
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
    name: `${note.user_ref.first_name} ${note.user_ref.last_name}`,
  }))
}

export const configureDocuments = (documents, requestIdentifier) => {
  return documents?.map(document => ({
    identifier: document.identifier,
    date: normalizeDate(document.created_at),
    documentStatus: document.status,
    documentStatusColor: statusColors[configure_status(document.status)].bg,
    documentType: document.type,
    documentTypeColor: 'bg-dark',
    lineItems: configureLineItems(document.line_items),
    requestIdentifier,
    subtotalPrice: document.retail_subtotal_price_currency,
    taxAmount: document.tax_cost_currency,
    terms: document.payment_terms,
    totalPrice: document.retail_total_price_currency,
    shippingPrice: document.shipping_cost_currency,
    shipTo: {
      organizationName: document.ship_to.organization_name,
      text: document.ship_to.text,
    },
    shipFrom: {
      organizationName: document.ship_from.organization_name,
      text: document.ship_from.text,
    },
  }))
}

const configureLineItems = (lineItems) => (lineItems.map(lineItem => ({
  id: lineItem.id,
  quantity: lineItem.quantity,
  currency: lineItem.currency,
  name: lineItem.name,
  total: lineItem.retail_subtotal_price_currency,
  unitPrice: lineItem.unit_price,
})))
