import React from 'react'
import { useRouter } from 'next/router'
import {
  LinkedButton,
  Loading,
  Notice,
  RequestList,
} from '@scientist-softserv/webstore-component-library'
import {
  buttonBg,
  configureErrors,
  requestListBg,
  useDefaultWare,
  useAllRequests
} from '../../utils'

const Requests = ({ session }) => {
  const router = useRouter()
  const accessToken = session?.accessToken
  const { requests, isLoadingAllRequests, isAllRequestsError } = useAllRequests(accessToken)
  const { defaultWareID, isLoadingDefaultWare, isDefaultWareError } = useDefaultWare(accessToken)
  const isError = isAllRequestsError || isDefaultWareError
  const isLoading = isLoadingAllRequests || isLoadingDefaultWare

  /**
   * checking for the presence of a session has to come after all of the hooks so we don't violate the react-hooks/rules-of-hooks
   * rule. ref: https://legacy.reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
   * we return the loading state in two different locations because it's rendered based on separate conditions. when
   * isLoading is true because we don't have a user, it doesn't ever become false. that's why we were previously returning
   * the loading spinner indefinitely.
   * using a guard clause with an early return inside the api methods also violates the react-hooks/rules-of-hooks rule.
   */
  if (session === undefined) return pageLoading
  if (session === null) return unauthorizedUser
  if (isLoading) return pageLoading

  if (isError) {
    return (
      <Notice
        addClass='my-5'
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
            backgroundColor: buttonBg,
            label: 'Initiate a New Request',
            size: 'large',
          }}
          path={{ pathname: `/requests/new/make-a-request`, query: { id: defaultWareID } }}
        />
      </div>
      <RequestList backgroundColor={requestListBg} requests={requests} />
    </div>
  )
}

const pageLoading = <Loading wrapperClass='mt-5' />

const unauthorizedUser = (
  <Notice
    addClass='my-5'
    alert={{
      body: ['Please log in to make new requests or view existing ones.'],
      title: 'Unauthorized',
      variant: 'info'
    }}
    dismissible={false}
  />
)

export default Requests
