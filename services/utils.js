import useSWR from 'swr'
import { fetcher } from './fetcher'

export const useWares = (url) => {
  const { data, error } = useSWR(url, fetcher)

  return {
    wares: data,
    isLoading: !error && !data,
    isError: error,
  }
}

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
