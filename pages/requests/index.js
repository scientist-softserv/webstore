import React from 'react'
import {
  LinkedButton,
  Loading,
  RequestList,
  Title,
} from 'webstore-component-library'
import { dark, useAllRequests } from '../../utils'

const Requests = ({ ...props }) => {
  const { requests, isLoading, isError } = useAllRequests()
  const { user, userError, userLoading } = props

  if (isError) return <h1>{`${isError.name}: ${isError.message}`}</h1>
  if (userError) return <h1>{`${userError.name}: ${userError.message}`}</h1>
  if (isLoading || userLoading) return <Loading />

  return (
    <>
      {user ? (
        <div className='container mt-5'>
          {/* TODO: this button should either be removed, or should link to the list of services (wares) */}
          {/* <LinkedButton
            buttonProps={{
              backgroundColor: dark,
              label: 'Initiate a New Request',
              size: 'large',
            }}
            path='/requests/new'
            addClass='text-end d-block mt-4 mb-2'
          /> */}
          <RequestList requests={requests} />
        </div>
      ): (
        <div className='container mt-2'>
          <Title
            size='medium'
            title='Please log in to make new requests or view existing ones.'
          />
        </div>
      )}
    </>
  )
}

export default Requests
