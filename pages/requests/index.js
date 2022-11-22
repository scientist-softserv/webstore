import React from 'react'
import { LinkedButton, RequestList } from 'webstore-component-library'
import { black, configure_requests, getAllRequests } from '../../utils'

// TODO(alishaevn): figure out what bootstrap classes to pass to LinkedButton so its right aligned
// and has more bottom margin
const Requests = () => {
  const { all_requests, isLoading, isError } = getAllRequests()
  const requests = configure_requests({ data: all_requests, path: '/requests' })

  if (isError) return <h1>{`${isError.name}: ${isError.message}`}</h1>

  return (
    <>
      <LinkedButton
        buttonProps={{
          backgroundColor: black,
          label: 'Initiate a New Request',
          size: 'large',
        }}
        path='/requests/new'
        addClass='ml-auto d-block my-2'
      />
      <RequestList
        isLoading={isLoading}
        requests={requests}
      />
    </>
  )
}

export default Requests
