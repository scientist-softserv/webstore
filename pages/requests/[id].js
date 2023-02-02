import React from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import {
  ActionsGroup,
  CollapsibleSection,
  Document,
  Loading,
  Messages,
  Notice,
  RequestStats,
  StatusBar,
  TextBox,
  Title,
} from '@scientist-softserv/webstore-component-library'
import {
  configureErrors,
  postMessageOrFile,
  useMessagesAndFiles,
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
  const { messages, files, isLoadingMessagesAndFiles, isMessagesAndFilesError, mutate, data } = useMessagesAndFiles(id, session?.accessToken)
  const documents = (allSOWs) ? [...allSOWs] : []

  const isLoading = isLoadingRequest || isLoadingSOWs || isLoadingMessagesAndFiles
  const isError = isRequestError || isSOWError || isMessagesAndFilesError

  if (isLoading) return <Loading wrapperClass='item-page mt-5' />

  if (!session) {
    return (
      <Notice
        alert={{
          body: ['Please log in to view this request.'],
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
        alert={configureErrors([isRequestError, isSOWError, isMessagesError])}
        dismissible={false}
        withBackButton={true}
        buttonProps={{
          onClick: () => router.back(),
          text: 'Click to return to the previous page.',
        }}
      />
    )
  }

  // TODO(alishaevn): refactor the below once the direction of https://github.com/scientist-softserv/webstore/issues/156 has been decided
  // const handleSendingMessages = ({ message, files }) => {
  //   postMessageOrFile({
  //     id,
  //     message,
  //     files,
  //     accessToken: session?.accessToken,
  //   })
  //   mutate({ ...data, ...messages })
  // }

  return (
    <div className='container'>
      <StatusBar statusArray={STATUS_ARRAY} apiRequestStatus={request.status.text} addClass='mt-4' />
      <div className='row mb-4'>
        <div className='col-sm-4 col-md-3 mt-2 mt-sm-4 order-1 order-sm-0'>
          {/* TODO(@summercook): add back in the handleSendingMessages={handleSendingMessages} prop to ActionsGroup once the direction of
          https://github.com/scientist-softserv/webstore/issues/156 has been decided */}
          <ActionsGroup files={files}/>
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
