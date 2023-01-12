import { useRouter } from 'next/router'
import {
  ActionsGroup,
  CollapsibleSection,
  Document,
  Loading,
  Messages,
  RequestStats,
  StatusBar,
  TextBox,
  Title,
} from 'webstore-component-library'
import {
  sendMessage,
  useAllMessages,
  useAllSOWs,
  useOneRequest,
  STATUS_ARRAY,
} from '../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

const Request = () => {
  const router = useRouter()
  const { id } = router.query
  const { request, isLoadingRequest, isRequestError } = useOneRequest(id)
  const { allSOWs, isLoadingSOWs, isSOWError } = useAllSOWs(id, request?.identifier)
  const { messages, isLoadingMessages, isMessagesError } = useAllMessages(id)
  const documents = (allSOWs) ? [...allSOWs] : []

  const isLoading = isLoadingRequest || isLoadingSOWs || isLoadingMessages
  const isError = isRequestError || isSOWError || isMessagesError

  if (isLoading) return <Loading wrapperClass='item-page' />
  if (isError) return [isRequestError, isSOWError, isMessagesError].map((err, index) => err && (
    <div key={index}>
      <h3>{index + 1}. {err.name}:</h3>
      <p>{err.message}</p>
    </div>
  ))

  const handleSendingMessages = ({ message, files }) => sendMessage({ id, message, files })

  return(
    <div className='container'>
      <StatusBar statusArray={STATUS_ARRAY} apiRequestStatus={request.status.text} addClass='mt-4'/>
      <div className='row mb-4'>
        <div className='col-sm-4 col-md-3 mt-2 mt-sm-4 order-1 order-sm-0'>
          <ActionsGroup handleSendingMessages={handleSendingMessages}/>
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
