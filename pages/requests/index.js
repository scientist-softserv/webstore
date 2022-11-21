import React from 'react'
import { Button, RequestList } from 'webstore-component-library'
import { black, configure_requests, getAllRequests } from '../../utils'

const Requests = () => {
  const { all_requests, isLoading, isError } = getAllRequests()
  const requests = configure_requests({ data: all_requests, path: '/requests' })

  if (isError) return <h1>{`${isError.name}: ${isError.message}`}</h1>

  return (
    <>
      <Button 
        size='large'
        backgroundColor={black}
        primary='true'
        label='Initiate a New Request'
        onClick=''
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
