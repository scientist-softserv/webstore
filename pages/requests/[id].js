import { useRouter } from 'next/router'
import { Accordion } from 'react-bootstrap'
import {
  ActionsGroup,
  CollapsibleSection,
  Loading,
  // RequestStats,
  StatusBar,
  Title,
} from 'webstore-component-library'
import { getOneRequest, sendMessage, STATUS_ARRAY } from '../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

const Request = () => {
  const router = useRouter()
  const { id } = router.query
  const { request, isLoadingRequest, isRequestError } = getOneRequest(id)

  if (isLoadingRequest) return <Loading wrapperClass='item-page' />
  if (isRequestError) return <h1>{`${isError.name}: ${isError.message}`}</h1>

  const handleSendingMessages = ({ message, files }) => sendMessage({ id, message, files })
  console.log(request)
  return(
    <div className='container'>
      <StatusBar statusArray={STATUS_ARRAY} apiRequestStatus={request.status} addClass='mt-4'/>
      <div className='row'>
        <div className='col-sm-3 mt-4'>
          <ActionsGroup handleSendingMessages={handleSendingMessages}/>
        </div>
        <div className='col-sm-9 mt-4'>
          <Title title={request.title}/>
          <CollapsibleSection header='Additional Information' description={request.htmlDescription}/>
        </div>
      </div>
    </div>
  )
}

export default Request
