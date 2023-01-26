import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import {
  LinkedButton,
  Loading,
  Notice,
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

  // Check whether the user is authenticated first. If it does, we can return the API errors if applicable.
  if (!session) {
    return (
      <Notice
        alert={{
          body: ['Please log in to make new requests or view existing ones.'],
          title: 'Unauthorized',
          variant: 'info'
        }}
        dismissible={false}
        withBackButton={false}
      />
    )
  }

  if (isLoading) return <Loading wrapperClass='mt-5' />

  if (isError) {
    return (
      <Notice
        alert={configureErrors([isAllRequestsError, isDefaultWareError])}
        dismissible={false}
        withBackButton={true}
        buttonProps={{
          onClick: () => router.back(),
          text: 'Click to return to the previous page.',
        }}
      />
    )
  }

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
