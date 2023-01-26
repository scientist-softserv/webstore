import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import {
  Error,
  LinkedButton,
  Loading,
  RequestList,
} from '@scientist-softserv/webstore-component-library'
import {
  configureErrors,
  dark,
  useDefaultWare,
  useAllRequests
} from '../../utils'

const Requests = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { requests, isLoadingAllRequests, isAllRequestsError } = useAllRequests(session?.accessToken)
  const { defaultWareID, isLoadingDefaultWare, isDefaultWareError } = useDefaultWare(session?.accessToken)
  const isError = isAllRequestsError || isDefaultWareError
  const isLoading = isLoadingAllRequests || isLoadingDefaultWare

  if (!session) {
    return (
      <Error
        errors={{
          errorText: ['Please log in to make new requests or view existing ones.'],
          errorTitle: 'Unauthorized',
          variant: 'info'
        }}
        router={router}
        showBackButton={false}
      />)
  }

  if (isLoading) return <Loading wrapperClass='mt-5' />

  if (isError) return <Error errors={configureErrors([isAllRequestsError, isDefaultWareError])} router={router} />

  return (
    <div className='container'>
      <LinkedButton
        buttonProps={{
          backgroundColor: dark,
          label: 'Initiate a New Request',
          size: 'large',
        }}
        path={`/requests/new/make-a-request?id=${defaultWareID}`}
        addClass='text-end d-block mt-4 mb-2'
      />
      <RequestList requests={requests} />
    </div>
  )
}

export default Requests
