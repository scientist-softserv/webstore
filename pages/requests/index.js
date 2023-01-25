import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import {
  Error,
  LinkedButton,
  Loading,
  RequestList,
  Title,
} from '@scientist-softserv/webstore-component-library'
import { configureErrors, dark, useAllRequests } from '../../utils'

// TODO(alishaevn): authenticate the user
const Requests = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { requests, isLoading, isError } = useAllRequests(session?.accessToken)

  if (isError) return <Error errors={configureErrors([isError])} router={router} />
  if (isLoading) return <Loading />

  return (
    <>
      {session ? (
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
