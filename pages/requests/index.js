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
import {
  configureErrors,
  dark,
  useDefaultWare,
  useAllRequests 
} from '../../utils'

// TODO(alishaevn): authenticate the user
const Requests = ({ ...props }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const { requests, isLoadingAllRequests, isAllRequestsError } = useAllRequests()
  const { user, userError, userLoading } = props
  const { defaultWareID, isLoadingDefaultWare, isDefaultWareError } = useDefaultWare('make-a-request')
  const isError =  isAllRequestsError || isDefaultWareError || userError
  const isLoading = isLoadingAllRequests || userLoading || isLoadingDefaultWare

  if (isError) return <Error errors={configureErrors([isAllRequestsError, userError, isDefaultWareError])} router={router} />
  
  if (isLoading) return <Loading />

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
            path={`/requests/new/make-a-request?id=${defaultWareID}`}
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
