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
  return data?.map(request => ({
    createdAt: request.created_at,
    description: request.description,
    href: `${path}/${request.identifier}`,
    img: DEFAULT_WARE_IMAGE,
    title: `${request.identifier}: ${request.name}`,
    status: {
      // TODO(alishaevn): remove the fallback colors below once we're only receiving webstore applicable statuses
      backgroundColor: statusColors[request.status]?.bg || light_grey,
      text: request.status,
      textColor: statusColors[request.status]?.text || black,
    },
    updatedAt: request.updated_at,
  }))
}
