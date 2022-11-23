import React from 'react'
import {
  LinkedButton,
  Loading,
  RequestList,
  Title,
} from 'webstore-component-library'
import { black, configure_requests, getAllRequests } from '../../utils'

const Requests = ({ ...props }) => {
  const { all_requests, isLoading, isError } = getAllRequests()
  const { user, userError, userLoading } = props
  const requests = configure_requests({ data: all_requests, path: '/requests' })

  if (isError) return <h1>{`${isError.name}: ${isError.message}`}</h1>
  if (userError) return <h1>{`${userError.name}: ${userError.message}`}</h1>
  if (isLoading || userLoading) return <Loading />

  return (
    <>
      {user ? (
        <>
          <LinkedButton
            buttonProps={{
              backgroundColor: black,
              label: 'Initiate a New Request',
              size: 'large',
            }}
            path='/requests/new'
            addClass='text-end d-block my-2'
          />
          <RequestList requests={requests} />
        </>
      ): (
        <Title
          addClass='mt-2'
          size='medium'
          title='Please log in to make new requests or view existing ones.'
        />
      )}
    </>
  )
}

export default Requests
