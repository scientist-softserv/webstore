import useSWR from 'swr'
import { fetcher } from './fetcher'
import { DEFAULT_WARE_IMAGE } from '../constants'

export const configure_services = ({ data, path }) => {
  return data?.map(ware => {
    return {
      description: ware.snippet,
      id: ware.reference_of_id,
      img: {
        src: ware.promo_image,
        alt: `The promotional image for ${ware.name}`
      },
      name: ware.name,
      href: `${path}/${ware.slug}`,
    }
  })
}

export const getAllWares = () => {
  const { data, error } = useSWR(`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`, fetcher)

  return {
    wares: data?.ware_refs,
    isLoading: !error && !data,
    isError: error,
  }
}

export const getFilteredWares = (query) => {
  const { data, error } = useSWR(`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json&q=${query}`, fetcher)

  return {
    wares: data?.ware_refs,
    isLoading: !error && !data,
    isError: error,
  }
}
