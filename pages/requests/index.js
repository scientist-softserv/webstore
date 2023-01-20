import React from 'react'
import { useRouter } from 'next/router'
import {
  Error,
  LinkedButton,
  Loading,
  RequestList,
  Title,
} from '@scientist-softserv/webstore-component-library'
import { dark, useAllRequests, configureErrors } from '../../utils'

const Requests = ({ ...props }) => {
  const router = useRouter()
  const { requests, isLoading, isError } = useAllRequests()
  const { user, userError, userLoading } = props

  if (isError) {
    let { errorTitle, errorText, variant } = configureErrors(isError)
    return (
      <Error variant={variant} errorTitle={errorTitle} errorText={errorText} router={router}/>
    )
  }
  
  if (userError) {
    let { errorTitle, errorText, variant } = configureErrors(userError)
    return (
      <Error variant={variant} errorTitle={errorTitle} errorText={errorText} router={router}/>
    )
  }

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
