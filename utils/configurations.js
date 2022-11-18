import { DEFAULT_WARE_IMAGE } from './constants'
import { black, light_grey, statusColors } from './theme'

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
  return data?.map(request => {
    const description = normalize_description(request.description)

    return {
      createdAt: request.created_at,
      description,
      href: `${path}/${request.id}`,
      id: request.id,
      img: DEFAULT_WARE_IMAGE,
      title: `${request.identifier}: ${request.name}`,
      status: {
        // TODO(alishaevn): remove the fallback colors below once we're only receiving webstore applicable statuses
        backgroundColor: statusColors[request.status]?.bg || light_grey,
        text: request.status,
        textColor: statusColors[request.status]?.text || black,
      },
      updatedAt: request.updated_at,
    }
  })
}

const normalize_description = (text) => {
  // removes html elements, html comments and sections with 3 spaces from the string
  const regex = /(<([^>]+)>)|\n|-+>|   /g
  const description = text.replace(regex, '')
  console.log({ description })
  const length = 215

  return description.length > length
          ? `${description.substring(0, length - 3)}...`
          : description
}