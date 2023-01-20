import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Item, Error, SearchBar } from '@scientist-softserv/webstore-component-library'
import { configureServices, configureErrors, useFilteredWares } from '../../utils'

const Browse = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const existingQuery = router.query.q

  useEffect(() => {
    if (existingQuery) setQuery(existingQuery)
  }, [existingQuery])

  const { wares, isLoading, isError } = useFilteredWares(query)
  const services = configureServices({ data: wares, path: '/requests/new' })
  const handleOnSubmit = ({ value }) => {
    setQuery(value)
    return router.push({ pathname: '/browse', query: { q: value } }, (value.length > 0 ? `/browse?q=${value}` : '/browse'))
  }

  if (isError) {
    return (
      <Error errors={configureErrors([isError])} router={router} />
    )
  }

  return (
    <div className='container'>
      <SearchBar onSubmit={handleOnSubmit} initialValue={existingQuery} />
      {isLoading
        ? (
          // TODO(alishaevn): refactor for prop error: missing "item.id"
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
              }}
            />
          ))
        )
      }
    </div>
  )
}

export default Browse
