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
  primary,
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

  if (isLoading) return <Loading wrapperClass='mt-5' />

  if (!session) {
    return (
      <Notice
        alert={{
          body: ['Please log in to make new requests or view existing ones.'],
          title: 'Unauthorized',
          variant: 'info'
        }}
        dismissible={false}
      />
    )
  }

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
      <div className='text-end d-block mt-4 mb-2'>
        <LinkedButton
          buttonProps={{
            backgroundColor: primary,
            label: 'Initiate a New Request',
            size: 'large',
          }}
          path={{ pathname: `/requests/new/make-a-request`, query: { id: defaultWareID } }}
        />
      </div>
      <RequestList backgroundColor='light' requests={requests} />
    </div>
  )
}

export default Requests
