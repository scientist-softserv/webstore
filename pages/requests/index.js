import React from 'react'
import { useRouter } from 'next/router'
import {
  Error,
  LinkedButton,
  Loading,
  RequestList,
  Title,
} from '@scientist-softserv/webstore-component-library'
import { configureErrors, dark, useAllRequests } from '../../utils'

const Requests = ({ ...props }) => {
  const router = useRouter()
  const { requests, isLoading, isError } = useAllRequests()
  const { user, userError, userLoading } = props

  if (isError) return <Error errors={configureErrors([isError, userError])} router={router} />
  
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
