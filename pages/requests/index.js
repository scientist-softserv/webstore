import React from 'react'
import { RequestList } from 'webstore-component-library'
import { getAllRequests, configure_requests } from '../../utils'

const Requests = ({ ...props }) => {
  const { all_requests, isLoading, isError } = getAllRequests()
  const { user, userError, userLoading } = props
  const requests = configure_requests({ data: all_requests, path: '/requests' })

  if (isError) return <h1>{`${isError.name}: ${isError.message}`}</h1>

  return (
    <>
      <RequestList
        isLoading={isLoading}
        requests={requests}
        // user={user}
      />
    </>
  )
}

export default Requests
