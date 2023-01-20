import React from 'react'
import { useSession } from 'next-auth/react'
import {
  LinkedButton,
  Loading,
  RequestList,
  Title,
} from '@scientist-softserv/webstore-component-library'
import { dark, useAllRequests } from '../../utils'

const Requests = ({ ...props }) => {
  const { data: session } = useSession()
  const { requests, isLoading, isError } = useAllRequests()
  const { user, userError, userLoading } = props

  // if there isn't a session, inform the user they need to sign in to access that page

  if (isError) return <h1>{`${isError.name}: ${isError.message}`}</h1>
  if (userError) return <h1>{`${userError.name}: ${userError.message}`}</h1>
  if (isLoading || userLoading) return <Loading />

  return (
    <>
      {user ? (
        <div className='container'>
          <LinkedButton
            buttonProps={{
              backgroundColor: dark,
              label: 'Initiate a New Request',
              size: 'large',
            }}
            path='/requests/new'
            addClass='text-end d-block mt-4 mb-2'
          />
          <RequestList requests={requests} />
        </div>
      ): (
        <div className='container'>
          <Title
            addClass='mt-2'
            size='medium'
            title='Please log in to make new requests or view existing ones.'
          />
        </div>
      )}
    </>
  )
}

export default Requests
