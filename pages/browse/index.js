import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Item, SearchBar } from 'webstore-component-library'
import { configure_services, getAllWares } from '../../utils'

const Browse = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const existingQuery = router.query.q

  useEffect(() => {
    if (existingQuery) setQuery(existingQuery)
  }, [existingQuery])

  // TODO(alishaevn): once the api is updated to accept a query with this path, we will want to delete line 17,
  // uncomment line 18 and delete the filter method from the "services" variable definition
  const { wares, isLoading, isError } = getAllWares()
  // const { wares, isLoading, isError } = getFilteredWares(query)
  const services = configure_services({ data: wares, path: '/requests/new' })?.filter((ware) => {
    const queryExpression = new RegExp(query, 'i')
    return queryExpression.test(ware.name)
  })

  const handleOnSubmit = ({ value }) => setQuery(value)

  if (isError) return <h1>Error...</h1>

  return (
    <div className='container'>
      <SearchBar onSubmit={handleOnSubmit} initialValue={existingQuery} />
      {isLoading
        ? (
          <Item isLoading={isLoading} orientation='horizontal' />
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
            />
          ))
        )
      }
    </div>
  )
}

export default Browse
