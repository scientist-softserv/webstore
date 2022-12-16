import { useRouter } from 'next/router'
import {
  ActionsGroup,
  CollapsibleSection,
  Document,
  Loading,
  RequestStats,
  StatusBar,
  Title,
} from 'webstore-component-library'
import { GetOneRequest, sendMessage, GetAllSOWs, STATUS_ARRAY } from '../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

const Request = () => {
  const router = useRouter()
  const { id } = router.query
  const { request, isLoadingRequest, isRequestError } = GetOneRequest(id)
  const {  allSOWs, isLoadingSOWs, isSOWError } = GetAllSOWs(id, request.identifier)
  console.log(allSOWs)

  if (isLoadingRequest) return <Loading wrapperClass='item-page' />
  if (isRequestError) return <h1>{`${isRequestError.name}: ${isRequestError.message}`}</h1>

  const handleSendingMessages = ({ message, files }) => sendMessage({ id, message, files })
  return(
    <div className='container'>
      <StatusBar statusArray={STATUS_ARRAY} apiRequestStatus={request.status} addClass='mt-4'/>
      <div className='row'>
        <div className='col-sm-3 mt-4'>
          <ActionsGroup handleSendingMessages={handleSendingMessages}/>
          <div className='mt-4'>
            <RequestStats
              billingInfo={{ ...request.billingAddress }}
              createdAt={request.createdAt}
              deadline={request.proposedDeadline}
              shippingInfo={{ ...request.shippingAddress }}
            />
          </div>
        </div>
        <div className='col-sm-9 mt-4'>
          <Title title={request.title}/>
          <CollapsibleSection header='Additional Information' description={request.htmlDescription}/>
          {allSOWs && allSOWs.map(document => (
            <Document document={document}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Request
