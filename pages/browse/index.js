import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Item, SearchBar } from 'webstore-component-library'
import { configure_services, useWares } from '../../services/utils'

const Browse = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const existingQuery = router.query.q

  useEffect(() => {
    if (existingQuery) setQuery(existingQuery)
  }, [])

  // TODO(alishaevn): once the api is updated to accept a query with this path, we will want to replace the path in useWares on line 17, with the one on line 18
  // and also delete the filter method from the "services" variable definition
  const { wares, isLoading, isError } = useWares(`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`)
  // `/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json&q=${query}`
  const services = configure_services({ data: wares?.ware_refs, path: '/requests/new' })?.filter((ware) => {
      const queryExpression = new RegExp(query, 'i')
      return queryExpression.test(ware.name)
    })

  const handleOnSubmit = ({ value }) => setQuery(value)

  if (isError) return <h1>Error...</h1>

  return (
    <>
      <SearchBar onSubmit={handleOnSubmit} initialValue={existingQuery} />
      {isLoading
        ? (
          <h1>Loading...</h1>
        ) : (
          services.map(service => (
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
          ))
        )
      }
    </>
  )
}

export default Browse
