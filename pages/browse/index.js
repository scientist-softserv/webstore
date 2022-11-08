import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Item, SearchBar } from 'webstore-component-library'
import { fetcher } from '../../services/fetcher'

const Browse = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const existingQuery = router.query.q

  useEffect(() => {
    if (existingQuery) setQuery(existingQuery)
  }, [existingQuery])

  // TODO(alishaevn): once the api is updated to accept a query with this path, we will want to use the second "url" declaration instead.
  const url = () => `/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`
  // const url = () => `/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json&q=${query}`
  const { data, error } = useSWR(url, fetcher)

  const handleOnSubmit = ({ value }) => setQuery(value)

  const wares = data?.ware_refs.filter((ware) => {
    const queryExpression = new RegExp(query, 'i')
    return queryExpression.test(ware.name)
  })

  const services = wares?.map(ware => {
    return {
      description: ware.snippet,
      id: ware.reference_of_id,
      img: {
        src: ware.promo_image,
        alt: `The promotional image for ${ware.name}`
      },
      name: ware.name,
      href: `/requests/new/${ware.slug}`,
    }
  })

  return (
    <>
      <SearchBar onSubmit={handleOnSubmit} initialValue={existingQuery} />
      {services && services.map(service => (
        <Item
          key={service.id}
          item={service}
          withButtonLink={true}
          buttonLink={service.href}
          orientation='horizontal'
          buttonProps={{
            backgroundColor: '#A9A9A9',
            label: 'Request this item',
            primary: true,
          }}
          style={{ marginBottom: 30 }}
        />
      ))}
    </>
  )
}

export default Browse
