import React from 'react'
import { LinkedButton, RequestList } from 'webstore-component-library'
import { black, configure_requests, getAllRequests } from '../../utils'

const Requests = () => {
  const { all_requests, isLoading, isError } = getAllRequests()
  const requests = configure_requests({ data: all_requests, path: '/requests' })

  if (isError) return <h1>{`${isError.name}: ${isError.message}`}</h1>

  return (
    <div className='container'>
      <LinkedButton
        buttonProps={{
          backgroundColor: black,
          label: 'Initiate a New Request',
          size: 'large',
        }}
        path='/requests/new'
        addClass='text-end d-block mt-4 mb-2'
      />
      <RequestList
        isLoading={isLoading}
        requests={requests}
      />
    </div>
  )
}

export default Requests
