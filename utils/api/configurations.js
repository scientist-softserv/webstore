import { DEFAULT_WARE_IMAGE } from '../constants'
import { statusColors } from '../theme'

export const configureServices = ({ data, path }) => {
  return data?.map(ware => {
    const img = ware.urls.promo_image
      ? { src: ware.urls.promo_image, alt: `The promotional image for ${ware.name}` }
      : DEFAULT_WARE_IMAGE

    return {
      description: ware.snippet,
      id: ware.id,
      img,
      name: ware.name,
      href: `${path}/${ware.slug}`,
      slug: ware.slug,
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
        id: request.billing_address?.id,
      },
      createdAt: normalizeDate(request.created_at),
      description: normalizeDescription(request.description),
      htmlDescription: normalizeHtmlDescription(request.description),
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

const normalizeHtmlDescription = (text) => {
  const regex = / style="white-space: pre-line;"/g
  return text.replace(regex, '')
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

export const normalizeDate = (str) => {
  if (str) {
    const date = new Date(str)
    return `${date.toDateString().substring(3)} at ${date.toLocaleTimeString()}`
  }

  return 'No deadline set'
}

export const timeSince = function(date) {
  if (typeof date !== 'object') {
    date = new Date(date)
  }

  let seconds = Math.floor((new Date() - date) / 1000)
  let intervalType

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    intervalType = 'year'
  } else {
    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) {
      intervalType = 'month'
    } else {
      interval = Math.floor(seconds / 86400)
      if (interval >= 1) {
        intervalType = 'day'
      } else {
        interval = Math.floor(seconds / 3600)
        if (interval >= 1) {
          intervalType = 'hour'
        } else {
          interval = Math.floor(seconds / 60)
          if (interval >= 1) {
            intervalType = 'minute'
          } else {
            interval = seconds
            intervalType = 'second'
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's'
  }

  return interval + ' ' + intervalType
}

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
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
    id: note.id,
    name: `${note.user_ref.first_name} ${note.user_ref.last_name}`,
    timeSince: timeSince(Date.parse(note.created_at)),
    attachments: note.attachments.map((attachment) => ({
      ...attachment,
      contentLength: formatBytes(attachment.content_length),
      href: `https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}.scientist.com/secure_attachments/${attachment.uuid}`
    })) || [],
  }))
}

export const configureDocuments = (documents, requestIdentifier) => {
  return documents?.map(document => ({
    identifier: document.identifier,
    date: normalizeDate(document.created_at),
    documentStatus: document.status,
    documentStatusColor: statusColors[configureStatus(document.status)].bg,
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
