import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
  acceptSOWandCreatePO,
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

const Request = ({ session }) => {
  const router = useRouter()
  /**
   * as a dynamically routed file, the router query will always consist of a "key: value" pair that's determined by the name of
   * the file (key) and path string (value). additional query properties may also exist if they were explicitly passed.
  */
  const { createRequestError, uuid } = router.query
  const accessToken = session?.accessToken
  const { request, isLoadingRequest, isRequestError } = useOneRequest(uuid, accessToken)
  const { allSOWs, isLoadingSOWs, isSOWError } = useAllSOWs(uuid, request?.identifier, accessToken)
  const { messages, isLoadingMessages, isMessagesError, mutateMessages, messagesData } = useMessages(uuid, accessToken)
  const { files, isLoadingFiles, isFilesError, mutateFiles, filesData } = useFiles(uuid, accessToken)

  const [show, setShow] = useState(false)
  const [message, setMessage] = useState(null)
  const [allPOs, setAllPOs] = useState([])
  const [isPOError, setIsPOError] = useState(false)
  const [isLoadingPOs, setIsLoadingPOs] = useState(true)

  useEffect(() => {
    if (isLoadingPOs && request) {
      (async () => {
        const { allPOs, isLoadingPOs, isPOError } = await getAllPOs(request?.quotedWareID, uuid, request?.identifier, accessToken)

        setIsLoadingPOs(isLoadingPOs)
        setAllPOs(allPOs)
        setIsPOError(isPOError)
      })()
    }
  }, [request, isLoadingPOs, accessToken, uuid])

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

  const isLoading = isLoadingRequest || isLoadingSOWs || isLoadingFiles || isLoadingMessages
  const isError = isRequestError || isSOWError || isFilesError || isMessagesError || isPOError
  const documents = (allSOWs) ? [...allSOWs, ...allPOs] : []

  if (isLoading) return pageLoading

  // this error is a result of creating the request
  if (createRequestError) {
    // TODO(alishaevn): how to handle a "sent to vendor" error?
    const attachmentError = JSON.parse(createRequestError).config.url.includes('notes')

    return (
      <Notice
        alert={attachmentError &&
          {
            body: ['Your attachment failed. Please visit your request and try again from the "View Files" tab.'],
            title: 'Attachment Error',
            variant: 'info',
          }
        }
        dismissible={false}
        withBackButton={true}
        buttonProps={attachmentError &&
          {
            onClick: () => router.push({ pathname: `/requests/${uuid}` }),
            text: 'Click to view your request.',
          }
        }
      />
    )
  }

  // this error is a result of getting the request or its related data
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

  const handleShow = (messageText) => {
    setMessage(messageText)
    setShow(true)
  }

  const handleClose = () => {
    setMessage(null)
    setShow(false)
  }

  const handleSendingMessagesOrFiles = async ({ message, files }) => {
    const { data, error } = await createMessageOrFile({
      id: request.id,
      message,
      files,
      accessToken,
      quotedWareID: request.quotedWareID,
    })

    if (data) {
      mutateMessages({ ...messagesData, ...messages })
      mutateFiles({ ...filesData, ...files })
    }
  }

  const handleAcceptingSOWandCreatingPO = async (document) => {
    const { data, error } = await acceptSOWandCreatePO(
      request,
      document,
      accessToken,
    )

    if (error || data.code) {
      setIsPOError(error || data.code)
    } else if (data.message) {
      setIsLoadingPOs(true)
      handleShow(data.message)
    }
  }

  return (
    <div className='container'>
      {(message && show) && (
        <Notice
          alert={{
            body: [message],
            variant: 'success',
            onClose: () => handleClose(),
          }}
        />
      )}
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
            <Document
              addClass='mt-3 document'
              acceptSOW={() => handleAcceptingSOWandCreatingPO(document)}
              document={document}
              key={`${request.id}-${index}`}
              request={request}
            />
          )) : (
            <TextBox
              alignment='left'
              size='medium'
              text='No documents have been submitted.'
            />
          )}
          <Messages addClass='mt-4 messages' messages={messages} />
        </div>
      </div>
    </div>
  )
}

const pageLoading = <Loading wrapperClass='item-page mt-5' />

const unauthorizedUser = (
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

export default Request
