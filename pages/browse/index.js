import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Item, Notice, SearchBar } from '@scientist-softserv/webstore-component-library'
import { configureErrors, configureServices, useFilteredWares } from '../../utils'

const Browse = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const existingQuery = router.query.q

  useEffect(() => {
    if (existingQuery) setQuery(existingQuery)
  }, [existingQuery])

  const { wares, isLoading, isError } = useFilteredWares(query, session?.accessToken)
  const services = configureServices({ data: wares, path: '/requests/new' })
  const handleOnSubmit = ({ value }) => {
    setQuery(value)
    return router.push({ pathname: '/browse', query: { q: value } }, (value.length > 0 ? `/browse?q=${value}` : '/browse'))
  }

  if (isError) {
    return (
      <Notice
        alert={configureErrors([isError])}
        dismissible={false}
        withBackButton={true}
        buttonProps={{
          onClick: () => router.back(),
          text: 'Click to return to the previous page.',
        }}
      />
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
