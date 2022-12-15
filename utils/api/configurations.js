import { DEFAULT_WARE_IMAGE } from '../constants'
import { dark, info, statusColors } from '../theme'

export const configure_services = ({ data, path }) => {
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

export const configure_requests = ({ data, path }) => {
  const sorted_requests = data?.sort((a, b) => b.updated_at.localeCompare(a.updated_at))

  return sorted_requests?.map(request => {
    const description = normalize_description(request.description)
    const createdAt = normalize_date(request.created_at)
    const updatedAt = normalize_date(request.updated_at)

    return {
      createdAt,
      description,
      href: `${path}/${request.id}`,
      id: request.id,
      // TODO(alishaevn): pass the actual image here when it's available
      img: DEFAULT_WARE_IMAGE,
      title: `${request.identifier}: ${request.name}`,
      status: {
        // TODO(alishaevn): remove the fallback colors below once we're only receiving webstore applicable statuses
        backgroundColor: statusColors[request.status]?.bg || info,
        text: request.status,
        textColor: statusColors[request.status]?.text || dark,
      },
      updatedAt,
    }
  })
}

const normalize_description = (text) => {
  // removes html elements, new lines, html comments and sections with 3 spaces from the string
  const regex = /(<([^>]+)>)|\n|-+>|   /g
  const description = text.replace(regex, '')
  const length = 350

  return description.length > length
          ? `${description.substring(0, length - 3)}...`
          : description
}

const normalize_date = (str) => {
  const date = new Date(str)
  return `${date.toDateString().substring(3)} at ${date.toLocaleTimeString()}`
}

export const configure_status = (status) => {
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

export const normalize_date_test = normalize_date

export const configureMessages = (data) => {
  const filteredMessages = data.filter(d => d.user_ref)

  return filteredMessages.map(note => ({
    avatar: note.user_ref.image,
    body: note.body,
    name: `${note.user_ref.first_name} ${note.user_ref.first_name}`,
  }))
}
