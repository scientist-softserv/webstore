import { useRouter } from 'next/router'
import {
  ActionsGroup,
  CollapsibleSection,
  Document,
  Loading,
  Messages,
  RequestStats,
  StatusBar,
  Title,
} from 'webstore-component-library'
import {
  sendMessage,
  STATUS_ARRAY,
  getAllMessages,
  useAllSOWs,
  useOneRequest,
} from '../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

const Request = () => {
  const router = useRouter()
  const { id } = router.query
  const { request, isLoadingRequest, isRequestError } = useOneRequest(id)
  const { allSOWs, isLoadingSOWs, isSOWError } = useAllSOWs(id, request?.identifier)
  const { messages, isLoadingMessages, isMessagesError } = getAllMessages(id)

  if (isLoadingRequest || isLoadingSOWs || isLoadingMessages) return <Loading wrapperClass='item-page' />
  if (isRequestError || isSOWError || isMessagesError) return <h1>{`${isRequestError.name}: ${isRequestError.message}`}</h1>

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
          <Title title={request.title}/>
          <CollapsibleSection header='Additional Information' description={request.htmlDescription}/>
          {allSOWs && allSOWs.map(document => (
            <Document key={request.id} document={document} addClass='mt-3'/>
          ))}
        </div>
        <Messages messages={messages} />
      </div>
    </div>
  )
}

export default Request
