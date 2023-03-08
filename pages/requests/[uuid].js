import React, { useState, useEffect } from 'react'
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
  acceptSOW,
  configureErrors,
  createMessageOrFile,
  requestActionsBg,
  requestStatsHeaderBg,
  STATUS_ARRAY,
  statusBarBg,
  useMessages,
  useFiles,
  getAllPOs,
  useAllSOWs,
  useOneRequest,
} from '../../utils'

const Request = () => {
  const router = useRouter()
  const { data: session } = useSession()
  /**
   * as a dynamically routed file, the router query will always consist of a "key: value" pair that's determined by the name of
   * the file (key) and path string (value). additional query properties may also exist if they were explicitly passed.
  */
  const { uuid } = router.query
  const accessToken = session?.accessToken
  const { request, isLoadingRequest, isRequestError } = useOneRequest(uuid, accessToken)
  const { allSOWs, isLoadingSOWs, isSOWError } = useAllSOWs(uuid, request?.identifier, accessToken)
  const { messages, isLoadingMessages, isMessagesError, mutateMessages, messagesData } = useMessages(uuid, accessToken)
  const { files, isLoadingFiles, isFilesError, mutateFiles, filesData } = useFiles(uuid, accessToken)

  const [allPOs, setAllPOs] = useState([])
  const [isPOError, setIsPOError] = useState(false)
  const [isLoadingPOs, setIsLoadingPOs] = useState(true)
  useEffect(() => {
    if (request) {
      (async () => {
        const { allPOs, isLoadingPOs, isPOError } = await getAllPOs(request?.quotedWareID, uuid, request?.identifier, session?.accessToken)

        setIsLoadingPOs(isLoadingPOs)
        setAllPOs(allPOs)
        setIsPOError(isPOError)
      })()
    }
  }, [allPOs, isPOError, request, uuid, session])

  const isLoading = isLoadingRequest || isLoadingSOWs || isLoadingFiles || isLoadingMessages || isLoadingPOs
  const isError = isRequestError || isSOWError || isFilesError|| isMessagesError || isPOError
  const documents = (allSOWs) ? [...allSOWs, ...allPOs] : []

  if (isLoading) return <Loading wrapperClass='item-page mt-5' />

  if (!session) {
    return (
      <Notice
        addClass='my-5'
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
        alert={configureErrors([isRequestError, isSOWError, isMessagesError, isFilesError, isPOError])}
        dismissible={false}
        withBackButton={true}
        buttonProps={{
          onClick: () => router.back(),
          text: 'Click to return to the previous page.',
        }}
      />
    )
  }

  const handleSendingMessagesOrFiles = async ({ message, files }) => {
    const { data, error } = await createMessageOrFile({
      id: request.id,
      message,
      files,
      accessToken: accessToken,
      quotedWareID: request.quotedWareID,
    })

    if (data) {
      mutateMessages({ ...messagesData, ...messages })
      mutateFiles({ ...filesData, ...files })
    }
  }

  const handleClick = (value) => {
    switch (value) {
      case 'Accept SOW':
        acceptSOW({
          // params
        })

      case 'Purchase Orders':
        // do something

    }
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
          {documents.length ? documents.map((document, index) => {
            return (
              <Document
                addClass='mt-3'
                onClick={() => {
                  // add callback function to get the value of the string from the component
                  handleClick(value)
                }}
                document={document}
                key={`${request.id}-${index}`}
                request={request}
              />
            )
          }) : (
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
