import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Item,
  ItemLoading,
  Notice,
  SearchBar,
} from '@scientist-softserv/webstore-component-library'
import Markdown from 'react-markdown'
import {
  buttonBg,
  configureErrors,
  configureServices,
  useFilteredWares,
  truncateDescription,
} from '../../utils'

const Browse = ({ session }) => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const existingQuery = router.query.q
  const accessToken = session?.accessToken
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (existingQuery) setQuery(existingQuery)
  }, [existingQuery])

  const { wares, isLoading, isError } = useFilteredWares(query, accessToken)
  const services = configureServices({ data: wares, path: '/requests/new' })

  const handleOnSubmit = ({ value }) => {
    setQuery(value)
    return router.push({ pathname: '/browse', query: { q: value } }, (value.length > 0 ? `/browse?q=${value}` : '/browse'))
  }

  if (isError) {
    return (
      <Notice
        addClass='my-5'
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
          <>
            <ItemLoading orientation='horizontal' withButtonLink={true} />
            <ItemLoading orientation='horizontal' withButtonLink={true} />
            <ItemLoading orientation='horizontal' withButtonLink={true} />
          </>
        ) : (
          <>
            {(services.length > 0) ? (
              <>
                {services.map(service => {
                  const { truncated, cutOffIndex } = truncateDescription(service?.description, 300, open)
                  return (
                    <Item
                      key={service.id}
                      markdownDescriptionTruncated={(
                        <Markdown>
                          {truncated}
                        </Markdown>
                      )}
                      markdownDescriptionExtended={(
                        <Markdown>
                          {service?.description?.slice(cutOffIndex).trimStart()}
                        </Markdown>
                      )}
                      item={service}
                      withButtonLink={true}
                      buttonLink={service.href}
                      orientation='horizontal'
                      buttonProps={{
                        backgroundColor: buttonBg,
                        label: 'Request this item',
                      }}
                    />
                  )
                })}
              </>
            ) : (
              <p data-cy='no-results'>
                Your search for <b>{query}</b> returned no results. Please try another search term.
              </p>
            )}
          </>
        )
      }
    </div>
  )
}

export default Browse
