import React from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import {
  ActionsGroup,
  CollapsibleSection,
  Document,
  Error,
  Loading,
  Messages,
  RequestStats,
  StatusBar,
  TextBox,
  Title,
} from '@scientist-softserv/webstore-component-library'
import {
  configureErrors,
  postMessageOrAttachment,
  useAllMessages,
  useAllSOWs,
  useOneRequest,
  STATUS_ARRAY,
} from '../../utils'

const Request = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { id } = router.query
  const { request, isLoadingRequest, isRequestError } = useOneRequest(id, session?.accessToken)
  const { allSOWs, isLoadingSOWs, isSOWError } = useAllSOWs(id, request?.identifier, session?.accessToken)
  const { messages, isLoadingMessages, isMessagesError } = useAllMessages(id, session?.accessToken)
  const documents = (allSOWs) ? [...allSOWs] : []

  const isLoading = isLoadingRequest || isLoadingSOWs || isLoadingMessages
  const isError = isRequestError || isSOWError || isMessagesError

  if (!session) {
    return (
      <Error
        errors={{
          errorText: ['Please log in to view this request.'],
          errorTitle: 'Unauthorized',
          variant: 'info'
        }}
        router={router}
        showBackButton={false}
      />)
  }

  if (isLoading) return <Loading wrapperClass='item-page mt-5' />

  if (isError) return <Error errors={configureErrors([isRequestError, isSOWError, isMessagesError])} router={router} />

  // TODO(alishaevn): refactor the below once the direction of https://github.com/scientist-softserv/webstore/issues/156 has been decided
  // const handleSendingMessages = ({ message, files }) => {
    // postMessageOrAttachment({
    //   id,
    //   message,
    //   files,
    //   accessToken: session?.accessToken,
    // })
  //   mutate({ ...data, ...messages })
  // }

  return(
    <div className='container'>
      <StatusBar statusArray={STATUS_ARRAY} apiRequestStatus={request.status.text} addClass='mt-4'/>
      <div className='row mb-4'>
        <div className='col-sm-4 col-md-3 mt-2 mt-sm-4 order-1 order-sm-0'>
          {/* // TODO(alishaevn): return the below once the direction of https://github.com/scientist-softserv/webstore/issues/156 has been decided */}
          {/* <ActionsGroup handleSendingMessages={handleSendingMessages}/> */}
          <div className='mt-3'>
            <RequestStats
              billingInfo={{ ...request.billingAddress }}
              createdAt={request.createdAt}
              deadline={request.proposedDeadline}
              shippingInfo={{ ...request.shippingAddress }}
            />
          </div>
        </div>
        <div className='col-sm-8 col-md-9 mt-4 order-0 order-sm-1'>
          <Title title={request.title} />
          <CollapsibleSection header='Additional Information' description={request.htmlDescription} />
          <Title addClass='mt-4' title='Documents' size='small' />
          {documents.length ? documents.map(document => (
            <Document key={request.id} document={document} addClass='mt-3' />
          )) : (
            <TextBox
              alignment='left'
              size='medium'
              text='No documents have been submitted.'
            />
          )}
          <Messages addClass='mt-4' messages={messages} />
        </div>
      </div>
    </div>
  )
}

export default Request
