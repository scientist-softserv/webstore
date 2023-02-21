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
  createMessageOrFile,
  requestActionsBg,
  requestStatsHeaderBg,
  STATUS_ARRAY,
  statusBarBg,
  useMessages,
  useFiles,
  useAllSOWs,
  useOneRequest,
} from '../../utils'

const Request = () => {
  const router = useRouter()
  const { data: session } = useSession()
  // parses the query string to get the quote group (request) id
  const { id } = router.query
  const { request, isLoadingRequest, isRequestError } = useOneRequest(id, session?.accessToken)
  const { allSOWs, isLoadingSOWs, isSOWError } = useAllSOWs(id, request?.identifier, session?.accessToken)
  const { messages, isLoadingMessages, isMessagesError, messagesMutate, messagesData } = useMessages(request?.uuid, session?.accessToken)
  const { files, isLoadingFiles, isFilesError, filesMutate, filesData } = useFiles(id, session?.accessToken)
  const documents = (allSOWs) ? [...allSOWs] : []

  const isLoading = isLoadingRequest || isLoadingSOWs || isLoadingFiles || isLoadingMessages
  const isError = isRequestError || isSOWError || isFilesError|| isMessagesError

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
        alert={configureErrors([isRequestError, isSOWError, isMessagesError, isFilesError])}
        dismissible={false}
        withBackButton={true}
        buttonProps={{
          onClick: () => router.back(),
          text: 'Click to return to the previous page.',
        }}
      />
    )
  }

  const handleSendingMessagesOrFiles = ({ message, files }) => {
    createMessageOrFile({
      id,
      message,
      files,
      accessToken: session?.accessToken,
      quotedWareID: request.quotedWareID,
    })
    messagesMutate({ ...messagesData, ...messages })
    filesMutate({ ...filesData, ...files })
  }

  return (
    <div className='container'>
      <StatusBar
        addClass='mt-4'
        apiRequestStatus={request.status.text}
        backgroundColor={statusBarBg}
        statusArray={STATUS_ARRAY}
      />
      <div className='row mb-4'>
        <div className='col-sm-4 col-md-3 mt-2 mt-sm-4 order-1 order-sm-0'>
          <ActionsGroup
            backgroundColor={requestActionsBg}
            files={files}
            handleSendingMessagesOrFiles={handleSendingMessagesOrFiles}
          />
          <div className='mt-3'>
            <RequestStats
              addClass={requestStatsHeaderBg}
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
          {documents.length ? documents.map((document, index) => (
            <Document key={`${request.id}-${index}`} document={document} addClass='mt-3' />
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
