import React from 'react'
import { RequestList } from 'webstore-component-library'
import { getAllRequests, configure_requests } from '../../utils'

const Requests = () => {
  const { all_requests, isLoading, isError } = getAllRequests()
  const requests = configure_requests({ data: all_requests, path: '/request' })

  if (isError) return <h1>{`${isError.name}: ${isError.message}`}</h1>

  return (
    <>
      <RequestList
        isLoading={isLoading}
        requests={requests}
      />
    </>
  )
}

export default Requests
